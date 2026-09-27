import { Item } from '../types';

// ============================================
// MOCK DATA — Semana 02
// Reemplaza estos items genéricos con datos
// reales de tu dominio asignado.
//
// REQUISITO: mínimo 10 items
// ============================================

// TODO: Renombra ITEMS a algo descriptivo de tu dominio
//       Ejemplo: BOOKS, MEDICINES, MEMBERS, DISHES...
// TODO: Actualiza el tipo Item con los campos de tu dominio
// TODO: Rellena con datos reales y variados de tu dominio

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
