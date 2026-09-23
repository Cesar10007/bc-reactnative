export interface PizzaMenuItem {
  id: string;
  nombre: string;
  imagen: string;
  precio: number;
  sabor: string;
  tipoMasa: 'delgada' | 'gruesa';
}