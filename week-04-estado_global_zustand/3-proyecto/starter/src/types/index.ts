// src/types/index.ts
// Interface principal del dominio.
// TODO: adaptar a tu dominio asignado.

export interface Item {
  id: string;
  name: string;
  description: string;
  image: string;
  price: number;
  flavor: string;
  doughType: 'delgada' | 'gruesa';
}
