import { create } from 'zustand';

import type { Item } from '../types';

interface SavedStore {
  items: Item[];
  addItem: (item: Item) => void;
  removeItem: (id: string | number) => void;
  clearAll: () => void;
  isItemSaved: (id: string | number) => boolean;
}

export const useSavedStore = create<SavedStore>((set, get) => ({
  items: [],
  addItem: (item) => {
    if (!get().items.some((savedItem) => savedItem.id === item.id)) {
      set((state) => ({ items: [...state.items, item] }));
    }
  },
  removeItem: (id) =>
    set((state) => ({
      items: state.items.filter((item) => item.id !== id),
    })),
  clearAll: () => set({ items: [] }),
  isItemSaved: (id) => get().items.some((item) => item.id === id),
}));