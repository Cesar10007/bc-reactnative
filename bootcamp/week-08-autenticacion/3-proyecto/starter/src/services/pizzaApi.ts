import axios from 'axios';

const API_BASE_URL = 'https://jsonplaceholder.typicode.com';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 8000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (__DEV__) {
      console.error('[API Error]', error.response?.status, error.config?.url);
    }
    return Promise.reject(error);
  },
);
