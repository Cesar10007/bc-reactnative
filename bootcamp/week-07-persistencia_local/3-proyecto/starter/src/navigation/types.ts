import type { NavigatorScreenParams } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { Item } from '../types';

export type RootTabParamList = {
  Catalog: NavigatorScreenParams<RootStackParamList>;
  Favorites: undefined;
};

export type RootStackParamList = {
  Home: undefined;
  Detail: Item;
  Create: undefined;
  Edit: { id: number | string; name: string };
  Settings: undefined;
};

export type HomeScreenProps = NativeStackScreenProps<RootStackParamList, 'Home'>;
