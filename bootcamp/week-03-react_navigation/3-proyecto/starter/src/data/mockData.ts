// src/data/mockData.ts
// Datos de prueba del dominio Pizza Ruta.

import type { Item } from '../types';

// ============================================
// LISTA PRINCIPAL DE ELEMENTOS
// ============================================
export const ITEMS: Item[] = [
  {
    id: '1',
    name: 'Pepperoni Pizza Clasica',
    image: 'https://picsum.photos/id/292/300/200',
    price: 32000,
    flavor: 'Pepperoni',
    doughType: 'delgada',
  },
  {
    id: '2',
    name: 'Hawaiana',
    image: 'https://picsum.photos/id/312/300/200',
    price: 30000,
    flavor: 'Piña y jamón',
    doughType: 'gruesa',
  },
  {
    id: '3',
    name: 'Cuatro Quesos',
    image: 'https://picsum.photos/id/366/300/200',
    price: 35000,
    flavor: 'Quesos mixtos',
    doughType: 'delgada',
  },
  {
    id: '4',
    name: 'Vegetariana',
    image: 'https://picsum.photos/id/412/300/200',
    price: 32000,
    flavor: 'Verduras frescas',
    doughType: 'delgada',
  },
  {
    id: '5',
    name: 'Mexicana',
    image: 'https://picsum.photos/id/488/300/200',
    price: 36000,
    flavor: 'Jalapeño y carne',
    doughType: 'gruesa',
  },
  {
    id: '6',
    name: 'Napolitana',
    image: 'https://picsum.photos/id/1080/300/200',
    price: 34000,
    flavor: 'Tomate y albahaca',
    doughType: 'delgada',
  },
  {
    id: '7',
    name: 'Pollo BBQ',
    image: 'https://picsum.photos/id/1081/300/200',
    price: 37000,
    flavor: 'Pollo y salsa BBQ',
    doughType: 'gruesa',
  },
  {
    id: '8',
    name: 'Carbonara',
    image: 'https://picsum.photos/id/1082/300/200',
    price: 38000,
    flavor: 'Tocineta y champiñones',
    doughType: 'delgada',
  },
  {
    id: '9',
    name: 'Prosciutto',
    image: 'https://picsum.photos/id/1083/300/200',
    price: 40000,
    flavor: 'Jamón serrano y rúgula',
    doughType: 'delgada',
  },
  {
    id: '10',
    name: 'Marinera',
    image: 'https://picsum.photos/id/1084/300/200',
    price: 42000,
    flavor: 'Mariscos y ajo',
    doughType: 'gruesa',
  },
];

// ============================================
// LISTA DE FAVORITOS
// ============================================
// Subconjunto de pizzas para la pestaña Favoritos.

export const FAVORITES: Item[] = [
  ITEMS[0],
  ITEMS[2],
  ITEMS[4],
];
