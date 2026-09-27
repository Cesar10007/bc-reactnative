import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import type { AuthUser, LoginCredentials, RegisterData } from '../types';
import * as authService from '../services/authService';
import { clearTokens, getAccessToken, getRefreshToken, saveTokens } from '../services/tokenService';

interface AuthState {
  user: AuthUser | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isInitialized: boolean;
  error: string | null;
  initialize: () => Promise<void>;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  refreshTokens: () => Promise<void>;
  clearError: () => void;
}

function toUser(response: AuthUser): AuthUser {
  return {
    id: response.id,
    username: response.username,
    email: response.email,
    firstName: response.firstName,
    lastName: response.lastName,
    image: response.image,
  };
}

function errorMessage(error: unknown): string {
  if (axios.isAxiosError<{ message?: string }>(error)) {
    return error.response?.data?.message ?? 'No fue posible conectar con el servidor';
  }
  return error instanceof Error ? error.message : 'Ocurrió un error inesperado';
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
  user: null,
  accessToken: null,
  isAuthenticated: false,
  isLoading: false,
  isInitialized: false,
  error: null,

  initialize: async () => {
    try {
      const accessToken = await getAccessToken();
      if (!accessToken) {
        set({ isInitialized: true, isAuthenticated: false });
        return;
      }
      const profile = await authService.getProfile();
      set({ user: toUser(profile), accessToken, isAuthenticated: true, isInitialized: true });
    } catch {
      await clearTokens();
      set({ user: null, accessToken: null, isAuthenticated: false, isInitialized: true });
    }
  },

  login: async (credentials) => {
    set({ isLoading: true, error: null });
    try {
      const response = await authService.login(credentials);
      await saveTokens(response);
      set({ user: toUser(response), accessToken: response.accessToken, isAuthenticated: true, isLoading: false });
    } catch (error) {
      set({ error: errorMessage(error), isLoading: false });
      throw error;
    }
  },

  register: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const response = await authService.register(data);
      await saveTokens(response);
      set({ user: toUser(response), accessToken: response.accessToken, isAuthenticated: true, isLoading: false });
    } catch (error) {
      set({ error: errorMessage(error), isLoading: false });
      throw error;
    }
  },

  logout: async () => {
    await clearTokens();
    set({ user: null, accessToken: null, isAuthenticated: false, error: null });
  },

  refreshTokens: async () => {
    const refreshToken = await getRefreshToken();
    if (!refreshToken) {
      await get().logout();
      return;
    }
    try {
      const tokens = await authService.refreshTokens(refreshToken);
      await saveTokens(tokens);
      set({ accessToken: tokens.accessToken });
    } catch {
      await get().logout();
    }
  },

      clearError: () => set({ error: null }),
    }),
    {
      name: '@pizza_ruta/auth_user',
      storage: createJSONStorage(() => AsyncStorage),
      // Solo datos no sensibles. Los tokens permanecen exclusivamente en SecureStore.
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
);
