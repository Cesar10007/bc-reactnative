// src/navigation/RootNavigator.tsx
// Configura la estructura completa de navegación:
//   Tab Navigator (raíz)
//     └── Home tab  → HomeStack (Stack Navigator anidado)
//           ├── HomeList  (lista de elementos)
//           └── HomeDetail (detalle de un elemento con params)
//     └── Favorites tab → FavoritesScreen

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';

import { DetailScreen } from '../screens/DetailScreen';
import { FavoritesScreen } from '../screens/FavoritesScreen';
import { HomeScreen } from '../screens/HomeScreen';
import { COLORS } from '../theme';
import type { HomeStackParamList, RootTabParamList } from './types';

// ============================================
// STACK INTERNO — para la pestaña Home
// ============================================

const HomeStack = createNativeStackNavigator<HomeStackParamList>();

/**
 * Navigator que gestiona la navegación dentro de la pestaña Home.
 * Es un componente que se usa dentro del Tab Navigator.
 * El headerShown: false en el Tab evita doble header.
 */
function HomeStackNavigator(): React.JSX.Element {
  return (
    <HomeStack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: COLORS.surface },
        headerTintColor: COLORS.textPrimary,
        headerTitleStyle: { fontWeight: 'bold' },
      }}
    >
      {/* Pantalla inicial del Stack — lista de elementos */}
      <HomeStack.Screen
        name="HomeList"
        component={HomeScreen}
        // TODO: cambiar el título al nombre de tu dominio
        // options={{ title: 'Mis Libros' }}
        // options={{ title: 'Catálogo' }}
        options={{ title: 'Inicio' }}
      />
      {/* Pantalla de detalle — recibe params del Stack */}
      <HomeStack.Screen
        name="HomeDetail"
        component={DetailScreen}
        options={({ route }) => ({ title: route.params.name })}
      />
    </HomeStack.Navigator>
  );
}

// ============================================
// TAB NAVIGATOR — raíz de la app
// ============================================

const Tab = createBottomTabNavigator<RootTabParamList>();

export function RootNavigator(): React.JSX.Element {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          const iconName: keyof typeof Ionicons.glyphMap =
            route.name === 'Home'
              ? focused
                ? 'home'
                : 'home-outline'
              : focused
                ? 'heart'
                : 'heart-outline';

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: COLORS.accent,
        tabBarInactiveTintColor: COLORS.textSecondary,
        headerShown: false,
        tabBarStyle: { backgroundColor: COLORS.surface },
      })}
    >
      {/* La pestaña Home usa el Stack interno */}
      <Tab.Screen
        name="Home"
        component={HomeStackNavigator}
        // TODO: personalizar la etiqueta según tu dominio
        // options={{ tabBarLabel: 'Catálogo' }}
        options={{ tabBarLabel: 'Inicio' }}
      />
      {/* La pestaña Favorites va directo a la pantalla (sin Stack) */}
      <Tab.Screen
        name="Favorites"
        component={FavoritesScreen}
        // TODO: personalizar la etiqueta según tu dominio
        // options={{ tabBarLabel: 'Mis Guardados' }}
        options={{ tabBarLabel: 'Favoritos' }}
      />
    </Tab.Navigator>
  );
}
