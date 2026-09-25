import AsyncStorage from '@react-native-async-storage/async-storage';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { apiClient } from '../services/api';
import type {
  CreateItemPayload,
  Item,
  ItemsWithSource,
  UpdateItemPayload,
} from '../types';

export const ITEMS_QUERY_KEY = ['pizzas'] as const;
export const PIZZAS_CACHE_KEY = '@pizza_ruta/pizzas_cache';
const LOCAL_PIZZAS_KEY = '@pizza_ruta/local_pizzas';

interface RemotePost {
  id: number;
  title: string;
  body: string;
}

const pizzaTemplates: Array<Omit<Item, 'id' | 'name' | 'description'>> = [
  { image: 'https://picsum.photos/id/292/600/400', price: 32000, flavor: 'Pepperoni', doughType: 'delgada' },
  { image: 'https://picsum.photos/id/312/600/400', price: 30000, flavor: 'Piña y jamón', doughType: 'gruesa' },
  { image: 'https://picsum.photos/id/366/600/400', price: 35000, flavor: 'Cuatro quesos', doughType: 'delgada' },
  { image: 'https://picsum.photos/id/1080/600/400', price: 29000, flavor: 'Vegetales frescos', doughType: 'gruesa' },
  { image: 'https://picsum.photos/id/163/600/400', price: 27000, flavor: 'Tomate y albahaca', doughType: 'delgada' },
];

const pizzaNames = [
  'Pepperoni Clásica',
  'Hawaiana',
  'Cuatro Quesos',
  'Vegetariana',
  'Margarita',
  'BBQ Pollo',
  'Napolitana',
  'Mexicana',
  'Champiñones',
  'Carnes Frías',
];

function mapRemotePost(post: RemotePost): Item {
  const template = pizzaTemplates[(post.id - 1) % pizzaTemplates.length];
  return {
    ...template,
    id: String(post.id),
    name: pizzaNames[(post.id - 1) % pizzaNames.length],
    description: post.body,
  };
}

function createLocalId(): string {
  return `local-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

async function saveCache(items: Item[]): Promise<void> {
  await AsyncStorage.setItem(PIZZAS_CACHE_KEY, JSON.stringify(items));
}

export async function clearPizzasCache(): Promise<void> {
  await AsyncStorage.removeItem(PIZZAS_CACHE_KEY);
}

export async function clearPizzaRutaLocalData(): Promise<void> {
  await AsyncStorage.multiRemove([
    PIZZAS_CACHE_KEY,
    LOCAL_PIZZAS_KEY,
    '@pizza_ruta/last_sync',
  ]);
}

async function getLocalPizzas(): Promise<Item[]> {
  const value = await AsyncStorage.getItem(LOCAL_PIZZAS_KEY);
  return value ? (JSON.parse(value) as Item[]) : [];
}

async function saveLocalPizzas(items: Item[]): Promise<void> {
  await AsyncStorage.setItem(LOCAL_PIZZAS_KEY, JSON.stringify(items));
}

export function useItems() {
  return useQuery<ItemsWithSource>({
    queryKey: ITEMS_QUERY_KEY,
    queryFn: async () => {
      try {
        const [{ data }, localPizzas] = await Promise.all([
          apiClient.get<RemotePost[]>('/posts?_limit=15'),
          getLocalPizzas(),
        ]);
        const items = [...localPizzas, ...data.map(mapRemotePost)];
        await saveCache(items);
        await AsyncStorage.setItem('@pizza_ruta/last_sync', new Date().toISOString());
        return { items, source: 'network' };
      } catch (networkError) {
        const cached = await AsyncStorage.getItem(PIZZAS_CACHE_KEY);
        if (!cached) throw networkError;
        return { items: JSON.parse(cached) as Item[], source: 'cache' };
      }
    },
    staleTime: 1000 * 60 * 5,
  });
}

export function useItemById(id: number | string) {
  const queryClient = useQueryClient();
  return useQuery<Item>({
    queryKey: [...ITEMS_QUERY_KEY, id],
    queryFn: async () => {
      const current = queryClient.getQueryData<ItemsWithSource>(ITEMS_QUERY_KEY);
      const cachedItem = current?.items.find((item) => String(item.id) === String(id));
      if (cachedItem) return cachedItem;
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
      // JSONPlaceholder no conserva escrituras. Creamos primero el registro local
      // para que el formulario responda al instante, incluso con una red lenta.
      const newItem: Item = { ...payload, id: createLocalId() };

      void apiClient
        .post('/posts', {
          title: payload.name,
          body: payload.description,
        })
        .catch(() => {
          if (__DEV__) {
            console.warn('Sin conexión: la pizza quedó guardada localmente.');
          }
        });

      return newItem;
    },
    onSuccess: (newItem) => {
      const current = queryClient.getQueryData<ItemsWithSource>(ITEMS_QUERY_KEY);
      const items = [newItem, ...(current?.items ?? [])];

      // Actualizar primero la interfaz; la escritura en disco no debe bloquear
      // la navegación ni hacer que un formulario válido parezca fallar.
      queryClient.setQueryData<ItemsWithSource>(ITEMS_QUERY_KEY, {
        items,
        source: current?.source ?? 'network',
      });

      const localPizzas = items.filter((item) =>
        String(item.id).startsWith('local-'),
      );
      void Promise.all([saveCache(items), saveLocalPizzas(localPizzas)]).catch(
        (error: unknown) => {
          console.error('No se pudo actualizar la caché de pizzas:', error);
        },
      );
    },
  });
}

export function useUpdateItem() {
  const queryClient = useQueryClient();
  return useMutation<Item, Error, UpdateItemPayload>({
    mutationFn: async (payload) => {
      if (!String(payload.id).startsWith('local-')) {
        await apiClient.put(`/posts/${payload.id}`, {
          title: payload.name,
          body: payload.description,
        });
      }
      return payload;
    },
    onSuccess: async (updatedItem) => {
      const current = queryClient.getQueryData<ItemsWithSource>(ITEMS_QUERY_KEY);
      const items = (current?.items ?? []).map((item) =>
        String(item.id) === String(updatedItem.id) ? updatedItem : item,
      );
      queryClient.setQueryData<ItemsWithSource>(ITEMS_QUERY_KEY, {
        items,
        source: current?.source ?? 'network',
      });
      queryClient.setQueryData([...ITEMS_QUERY_KEY, updatedItem.id], updatedItem);
      await saveCache(items);
    },
  });
}
