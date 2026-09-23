import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { apiClient } from '../services/api';
import type { CreateItemPayload, Item, UpdateItemPayload } from '../types';

export const ITEMS_QUERY_KEY = ['pizzas'] as const;

interface RemotePost {
  id: number;
  title: string;
  body: string;
}

const pizzaTemplates = [
  {
    image: 'https://picsum.photos/id/292/300/200',
    price: 32000,
    flavor: 'Pepperoni',
    doughType: 'delgada' as const,
  },
  {
    image: 'https://picsum.photos/id/312/300/200',
    price: 30000,
    flavor: 'Piña y jamón',
    doughType: 'gruesa' as const,
  },
  {
    image: 'https://picsum.photos/id/366/300/200',
    price: 35000,
    flavor: 'Cuatro quesos',
    doughType: 'delgada' as const,
  },
  {
    image: 'https://picsum.photos/id/1080/300/200',
    price: 29000,
    flavor: 'Vegetales frescos',
    doughType: 'gruesa' as const,
  },
  {
    image: 'https://picsum.photos/id/163/300/200',
    price: 27000,
    flavor: 'Tomate y albahaca',
    doughType: 'delgada' as const,
  },
];

function mapRemotePost(post: RemotePost): Item {
  const template = pizzaTemplates[(post.id - 1) % pizzaTemplates.length];

  return {
    id: String(post.id),
    name: post.title
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' '),
    description: post.body,
    image: template.image,
    price: template.price,
    flavor: template.flavor,
    doughType: template.doughType,
  };
}

export function useItems() {
  return useQuery<Item[]>({
    queryKey: ITEMS_QUERY_KEY,
    queryFn: async () => {
      const { data } = await apiClient.get<RemotePost[]>('/posts?_limit=15');

      return data.map(mapRemotePost);
    },
  });
}

export function useItemById(id: number | string) {
  return useQuery<Item>({
    queryKey: [...ITEMS_QUERY_KEY, id],
    queryFn: async () => {
      const { data } = await apiClient.get<RemotePost>(`/posts/${id}`);

      return mapRemotePost(data);
    },
    enabled: Boolean(id),
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
  });
}

export function useUpdateItem() {
  const queryClient = useQueryClient();

  return useMutation<Item, Error, UpdateItemPayload>({
    mutationFn: async (payload) => {
      await apiClient.put(`/posts/${payload.id}`, {
        title: payload.name,
        body: payload.description,
      });

      return payload;
    },

    onSuccess: (updatedItem) => {
      queryClient.setQueryData<Item[]>(
        ITEMS_QUERY_KEY,
        (currentItems = []) =>
          currentItems.map((item) =>
            String(item.id) === String(updatedItem.id) ? updatedItem : item,
          ),
      );

      queryClient.setQueryData<Item>(
        [...ITEMS_QUERY_KEY, updatedItem.id],
        updatedItem,
      );
    },
  });
}