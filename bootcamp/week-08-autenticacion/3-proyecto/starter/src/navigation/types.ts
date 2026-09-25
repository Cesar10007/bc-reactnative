import type { NavigatorScreenParams } from '@react-navigation/native';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { Item } from '../types';

export type AuthStackParamList = { Login: undefined; Register: undefined };
export type CatalogStackParamList = {
  Home: undefined; Detail: Item; Create: undefined;
  Edit: { id: number | string; name: string }; Settings: undefined;
};
export type AppTabParamList = {
  Catalog: NavigatorScreenParams<CatalogStackParamList>;
  Favorites: undefined;
  Profile: undefined;
};
// Alias consumido por las pantallas acumuladas de semanas anteriores.
export type RootStackParamList = CatalogStackParamList;
export type HomeScreenProps = NativeStackScreenProps<CatalogStackParamList, 'Home'>;
export type LoginScreenProps = NativeStackScreenProps<AuthStackParamList, 'Login'>;
export type RegisterScreenProps = NativeStackScreenProps<AuthStackParamList, 'Register'>;
export type ProfileScreenProps = BottomTabScreenProps<AppTabParamList, 'Profile'>;
