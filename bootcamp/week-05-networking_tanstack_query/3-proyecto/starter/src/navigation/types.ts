// src/navigation/types.ts
// Tipos de los parámetros de navegación del proyecto.

export type RootStackParamList = {
  Home: undefined;

  Detail: {
    id: string | number;
    name: string;
    image: string;
    description: string;
    price: number;
    flavor: string;
    doughType: 'delgada' | 'gruesa';
  };

  Create: undefined;
};