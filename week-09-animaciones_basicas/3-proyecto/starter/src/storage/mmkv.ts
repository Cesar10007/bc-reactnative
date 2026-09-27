// src/storage/mmkv.ts
// Instancia global de MMKV para toda la app.
// Requiere un development build nativo; no funciona en Expo Go.

import { createMMKV } from 'react-native-mmkv';

export const storage = createMMKV({ id: 'app-storage' });
