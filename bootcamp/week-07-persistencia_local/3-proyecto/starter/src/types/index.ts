export interface Item {
  id: string | number;
  name: string;
  image: string;
  description: string;
  price: number;
  flavor: string;
  doughType: 'delgada' | 'gruesa';
}

export type CreateItemPayload = Omit<Item, 'id'>;

export interface UpdateItemPayload extends CreateItemPayload {
  id: string | number;
}

export interface ItemsWithSource {
  items: Item[];
  source: 'network' | 'cache';
}
