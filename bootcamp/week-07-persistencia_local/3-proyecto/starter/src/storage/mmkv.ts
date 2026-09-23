// src/storage/mmkv.ts
// Instancia global de MMKV para toda la app.
// Importa `storage` desde aquí en cualquier hook o pantalla.
// ⚠️  Requiere build nativo — no funciona con Expo Go.

import AsyncStorage from '@react-native-async-storage/async-storage'

const STORAGE_PREFIX = '@app-storage:'

export const storage = {
  getString: async (key: string): Promise<string | undefined> => {
    const value = await AsyncStorage.getItem(`${STORAGE_PREFIX}${key}`)
    return value ?? undefined
  },

  set: async (key: string, value: string | number | boolean) => {
    await AsyncStorage.setItem(
      `${STORAGE_PREFIX}${key}`,
      String(value),
    )
  },

  delete: async (key: string) => {
    await AsyncStorage.removeItem(`${STORAGE_PREFIX}${key}`)
  },
}