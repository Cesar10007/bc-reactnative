import axios, { type InternalAxiosRequestConfig } from 'axios';
import { clearTokens, getAccessToken, getRefreshToken, saveTokens } from './tokenService';

interface RetryConfig extends InternalAxiosRequestConfig { _retry?: boolean }

export const api = axios.create({ timeout: 10000, headers: { 'Content-Type': 'application/json' } });

api.interceptors.request.use(async (config) => {
  const token = await getAccessToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error: unknown) => {
    if (!axios.isAxiosError(error) || !error.config) return Promise.reject(error);
    const original = error.config as RetryConfig;
    if (error.response?.status !== 401 || original._retry) return Promise.reject(error);
    original._retry = true;
    const refreshToken = await getRefreshToken();
    if (!refreshToken) {
      await clearTokens();
      return Promise.reject(error);
    }
    try {
      const { data } = await axios.post<{ accessToken: string; refreshToken: string }>(
        'https://dummyjson.com/auth/refresh',
        { refreshToken, expiresInMins: 30 },
      );
      await saveTokens(data);
      original.headers.Authorization = `Bearer ${data.accessToken}`;
      return api(original);
    } catch (refreshError) {
      await clearTokens();
      return Promise.reject(refreshError);
    }
  },
);

export { clearTokens, getAccessToken, getRefreshToken, saveTokens };
