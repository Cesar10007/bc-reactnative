import type { Item } from '../types';

export type RootStackParamList = {
  Home: undefined;
  Detail: Item;
  Create: undefined;
  Edit: { id: number | string; name: string };
  Settings: undefined;
};

export type HomeScreenProps = import('@react-navigation/native-stack').NativeStackScreenProps<
  RootStackParamList,
  'Home'
>;
