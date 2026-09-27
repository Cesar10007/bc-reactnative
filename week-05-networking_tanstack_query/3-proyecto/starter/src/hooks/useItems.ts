import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { ITEMS } from '../data/mockData';
import { apiClient } from '../services/api';
import type { CreateItemPayload, Item } from '../types';

export const ITEMS_QUERY_KEY = ['pizzas'] as const;

interface RemotePost {
  id: number;
  title: string;
  body: string;
}

function mapRemotePost(post: RemotePost): Item {
  const localItem = ITEMS[(post.id - 1) % ITEMS.length];

  return {
    ...localItem,
    id: String(post.id),
    description: localItem.description || post.body,
  };
}

export function useItems() {
  return useQuery<Item[]>({
    queryKey: ITEMS_QUERY_KEY,
    queryFn: async () => {
      const { data } = await apiClient.get<RemotePost[]>('/posts?_limit=10');

      return data.map(mapRemotePost);
    },
  });
}

export function useCreateItem() {
  const queryClient = useQueryClient();

  return useMutation<Item, Error, CreateItemPayload>({
    mutationFn: async (payload) => {
      const { data } = await apiClient.post<RemotePost>('/posts', {
        title: payload.name,
        body: payload.description,
      });

      return {
        ...payload,
        id: String(data.id),
      };
    },

    onSuccess: async (newItem) => {
      queryClient.setQueryData<Item[]>(
        ITEMS_QUERY_KEY,
        (currentItems = []) => [newItem, ...currentItems],
      );

      await queryClient.invalidateQueries({
        queryKey: ITEMS_QUERY_KEY,
        refetchType: 'none',
      });
    },

    onError: (error) => {
      console.error('No se pudo crear la pizza:', error.message);
    },
  });
}

export function useDeleteItem() {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string | number>({
    mutationFn: async (id) => {
      await apiClient.delete(`/posts/${id}`);
    },

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ITEMS_QUERY_KEY,
      });
    },
  });
}