// ============================================================
// MOCK DATA — src/data/mockData.ts
// ============================================================
// Datos de ejemplo para tu dominio asignado.
// Reemplaza estos datos con información coherente a tu dominio.
// ============================================================

import { PizzaMenuItem } from '../types/PizzaMenuItem';

// TODO: Reemplaza los valores por datos reales de tu dominio
// Usa imágenes representativas — puedes usar URLs de picsum.photos
// o incluir imágenes locales en assets/

export const MOCK_ITEMS: PizzaMenuItem[] = [
  {
    id: '1',
    nombre: 'Pepperoni Pizza Clasica',
    imagen: 'https://picsum.photos/id/292/300/200',
    precio: 32000,
    sabor: 'Pepperoni',
    tipoMasa: 'delgada',
    // TODO: Agrega las propiedades específicas de tu dominio
  },
  {
    id: '2',
    nombre: 'Hawaiana',
    imagen: 'https://picsum.photos/id/312/300/200',
    precio: 30000,
    sabor: 'Piña y jamón',
    tipoMasa: 'gruesa',
    // TODO: Agrega las propiedades específicas de tu dominio
  },
  {
    id: '3',
    nombre: 'Cuatro Quesos',
    imagen: 'https://picsum.photos/id/366/300/200',
    precio: 35000,
    sabor: 'Quesos mixtos',
    tipoMasa: 'delgada',
    // TODO: Agrega las propiedades específicas de tu dominio
  },
  {
    id: '4',
    nombre: 'Vegetariana',
    imagen: 'https://picsum.photos/id/412/300/200',
    precio: 32000,
    sabor: 'Verduras frescas',
    tipoMasa: 'delgada',
    // TODO: Agrega las propiedades específicas de tu dominio
  },
];
