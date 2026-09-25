import axios from 'axios';
import type { AuthResponse, AuthTokens, LoginCredentials, RegisterData } from '../types';
import { api } from './api';

const BASE_URL = 'https://dummyjson.com';

export async function login(credentials: LoginCredentials): Promise<AuthResponse> {
  const { data } = await axios.post<AuthResponse>(`${BASE_URL}/auth/login`, {
    ...credentials,
    expiresInMins: 30,
  });
  return data;
}

// DummyJSON permite crear un usuario, pero no entrega tokens. Para una demo
// completa registramos el perfil y luego iniciamos la sesión de demostración.
export async function register(data: RegisterData): Promise<AuthResponse> {
  await axios.post(`${BASE_URL}/users/add`, {
    username: data.username,
    email: data.email,
    password: data.password,
    firstName: data.firstName ?? data.username,
    lastName: data.lastName ?? '',
  });
  return login({ username: 'emilys', password: 'emilyspass' });
}

export async function refreshTokens(refreshToken: string): Promise<AuthTokens> {
  const { data } = await axios.post<AuthTokens>(`${BASE_URL}/auth/refresh`, {
    refreshToken,
    expiresInMins: 30,
  });
  return data;
}

export async function getProfile(): Promise<AuthResponse> {
  const { data } = await api.get<AuthResponse>(`${BASE_URL}/auth/me`);
  return data;
}
