import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import type { Item } from '../types';

interface SavedStore {
  items: Item[];
  addItem: (item: Item) => void;
  removeItem: (id: Item['id']) => void;
  clearAll: () => void;
  isItemSaved: (id: Item['id']) => boolean;
}

export const useSavedStore = create<SavedStore>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item) => {
        if (!get().items.some((saved) => String(saved.id) === String(item.id))) {
          set((state) => ({ items: [...state.items, item] }));
        }
      },
      removeItem: (id) =>
        set((state) => ({
          items: state.items.filter((item) => String(item.id) !== String(id)),
        })),
      clearAll: () => set({ items: [] }),
      isItemSaved: (id) =>
        get().items.some((item) => String(item.id) === String(id)),
    }),
    {
      name: '@pizza_ruta/favorites',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
