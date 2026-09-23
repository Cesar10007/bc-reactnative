import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {
  createItem,
  fetchItemById,
  fetchItems,
  updateItem,
} from '../services/api';
import type { Item, ItemsWithSource } from '../types';

const ITEMS_QUERY_KEY = ['items'] as const;

const CACHE_KEY = '@items_cache';

export function useItems() {
  return useQuery<ItemsWithSource>({
    queryKey: ITEMS_QUERY_KEY,
    queryFn: async (): Promise<ItemsWithSource> => {
      try {
        const data = await fetchItems();

        await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(data));

        return {
          items: data,
          source: 'network',
        };
      } catch {
        const cached = await AsyncStorage.getItem(CACHE_KEY);

        if (cached) {
          return {
            items: JSON.parse(cached) as Item[],
            source: 'cache',
          };
        }

        throw new Error('Sin red y sin caché disponible');
      }
    },
    staleTime: 1000 * 60 * 5,
  });
}

export function useItemById(id: number | string | undefined) {
  return useQuery({
    queryKey: [...ITEMS_QUERY_KEY, id],
    queryFn: () => fetchItemById(id!),
    enabled: id !== undefined,
  });
}

export function useCreateItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: Omit<Item, 'id'>) => createItem(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ITEMS_QUERY_KEY,
      });
    },
  });
}

export function useUpdateItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      ...payload
    }: { id: number | string } & Partial<Omit<Item, 'id'>>) =>
      updateItem(id, payload),

    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ITEMS_QUERY_KEY,
      });

      queryClient.invalidateQueries({
        queryKey: [...ITEMS_QUERY_KEY, variables.id],
      });
    },
  });
}