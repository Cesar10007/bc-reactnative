// ============================================
// TYPES — Semana 02
// Define aquí la interfaz de tu dominio
// ============================================

export interface Item {
  id: string;
  /** Nombre o título principal del elemento */
  name: string;
  image: string;
  price: number;
  flavor: string;
  doughType: 'delgada' | 'gruesa';
}
