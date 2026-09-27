// src/data/mockData.ts
// Datos de ejemplo del dominio Pizza Ruta.

import type { Item } from '../types';

// ============================================================
// LISTA DE ÍTEMS
// ============================================================
export const ITEMS: Item[] = [
  {
    id: '1',
    name: 'Pepperoni Clásica',
    description: 'Pizza clásica con pepperoni y queso mozzarella derretido.',
    image: 'https://picsum.photos/id/292/300/200',
    price: 32000,
    flavor: 'Pepperoni',
    doughType: 'delgada',
  },
  {
    id: '2',
    name: 'Hawaiana',
    description: 'Combinación agridulce de piña y jamón sobre salsa de tomate.',
    image: 'https://picsum.photos/id/312/300/200',
    price: 30000,
    flavor: 'Piña y jamón',
    doughType: 'gruesa',
  },
  {
    id: '3',
    name: 'Cuatro Quesos',
    description: 'Mezcla de mozzarella, parmesano, gorgonzola y provolone.',
    image: 'https://picsum.photos/id/366/300/200',
    price: 35000,
    flavor: 'Quesos mixtos',
    doughType: 'delgada',
  },
  {
    id: '4',
    name: 'Vegetariana',
    description: 'Vegetales frescos de temporada sobre base de tomate.',
    image: 'https://picsum.photos/id/1080/300/200',
    price: 29000,
    flavor: 'Vegetales frescos',
    doughType: 'gruesa',
  },
  {
    id: '5',
    name: 'Margarita',
    description: 'La receta original: tomate, mozzarella y albahaca fresca.',
    image: 'https://picsum.photos/id/163/300/200',
    price: 27000,
    flavor: 'Tomate y albahaca',
    doughType: 'delgada',
  },
  {
    id: '6',
    name: 'BBQ Pollo',
    description: 'Pollo desmechado bañado en salsa BBQ ahumada.',
    image: 'https://picsum.photos/id/431/300/200',
    price: 34000,
    flavor: 'Pollo con salsa BBQ',
    doughType: 'gruesa',
  },
  {
    id: '7',
    name: 'Napolitana',
    description: 'Anchoas, orégano y aceite de oliva, estilo tradicional italiano.',
    image: 'https://picsum.photos/id/488/300/200',
    price: 31000,
    flavor: 'Anchoas y orégano',
    doughType: 'delgada',
  },
  {
    id: '8',
    name: 'Mexicana',
    description: 'Un toque picante con jalapeños y chorizo.',
    image: 'https://picsum.photos/id/598/300/200',
    price: 33000,
    flavor: 'Jalapeños y chorizo',
    doughType: 'gruesa',
  },
  {
    id: '9',
    name: 'Champiñones',
    description: 'Champiñones frescos salteados con hierbas.',
    image: 'https://picsum.photos/id/674/300/200',
    price: 28000,
    flavor: 'Champiñones frescos',
    doughType: 'delgada',
  },
  {
    id: '10',
    name: 'Carnes Frías',
    description: 'Jamón, tocineta y salami para los amantes de la carne.',
    image: 'https://picsum.photos/id/718/300/200',
    price: 36000,
    flavor: 'Jamón, tocineta y salami',
    doughType: 'gruesa',
  },
];
