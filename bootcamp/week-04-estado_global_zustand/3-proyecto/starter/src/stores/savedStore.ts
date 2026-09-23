// src/stores/savedStore.ts
// Store Zustand para gestionar las pizzas guardadas.

import { create } from 'zustand';
import type { Item } from '../types';

// ============================================================
// INTERFACE DEL STORE
// ============================================================
// Define el estado y las acciones del store de guardados.
// TODO: adaptar los nombres según la semántica de tu dominio.
//   Biblioteca  → ReadingListStore con addToReadingList / removeFromReadingList
//   Farmacia    → CartStore con addToCart / removeFromCart
//   Restaurante → OrderStore con addToOrder / removeFromOrder

interface SavedStore {
  // Lista de ítems guardados
  items: Item[];

  // TODO: implementar la acción para agregar un ítem al store
  // Debe verificar que el ítem no esté ya guardado (sin duplicados)
  addItem: (item: Item) => void;

  // TODO: implementar la acción para eliminar un ítem por id
  removeItem: (id: string) => void;

  // TODO: implementar la acción para vaciar todos los guardados
  clearAll: () => void;

  // Helper: devuelve true si el ítem con ese id está guardado
  // Útil para el botón "Guardar" / "Quitar" en DetailScreen
  isItemSaved: (id: string) => boolean;
}

// ============================================================
// CREAR EL STORE
// ============================================================
// TODO: implementar cada acción usando `set` y/o `get`

export const useSavedStore = create<SavedStore>((set, get) => ({
  items: [],

  addItem: (item) => {
    const alreadySaved = get().items.some((savedItem) => savedItem.id === item.id);

    if (!alreadySaved) {
      set((state) => ({ items: [...state.items, item] }));
    }
  },

  removeItem: (id) => {
    set((state) => ({
      items: state.items.filter((item) => item.id !== id),
    }));
  },

  clearAll: () => {
    set({ items: [] });
  },

  isItemSaved: (id) => {
    return get().items.some((item) => item.id === id);
  },
}));
