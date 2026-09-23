// src/navigation/RootNavigator.tsx
// Tab Navigator raíz con Stack anidado en la pestaña Home.
// El badge del tab "Guardados" refleja el conteo del store Zustand.

import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';

import { DetailScreen } from '../screens/DetailScreen';
import { SavedScreen } from '../screens/SavedScreen';
import { HomeScreen } from '../screens/HomeScreen';
import { useSavedStore } from '../stores/savedStore';
import { COLORS } from '../theme';
import type { HomeStackParamList, RootTabParamList } from './types';

const HomeStack = createNativeStackNavigator<HomeStackParamList>();

function HomeStackNavigator(): React.JSX.Element {
  return (
    <HomeStack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: COLORS.surface },
        headerTintColor: COLORS.textPrimary,
        headerTitleStyle: { fontWeight: 'bold' },
      }}
    >
      <HomeStack.Screen name="HomeList" component={HomeScreen} options={{ title: 'Pizza Ruta' }} />
      <HomeStack.Screen
        name="HomeDetail"
        component={DetailScreen}
        options={({ route }) => ({ title: route.params.name })}
      />
    </HomeStack.Navigator>
  );
}

const Tab = createBottomTabNavigator<RootTabParamList>();

export function RootNavigator(): React.JSX.Element {
  // Selector reactivo: solo re-renderiza el badge cuando cambia el número de guardados
  const savedCount = useSavedStore((state) => state.items.length);

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          const iconName: keyof typeof Ionicons.glyphMap =
            route.name === 'Home'
              ? focused ? 'home' : 'home-outline'
              : focused ? 'bookmark' : 'bookmark-outline';
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: COLORS.accent,
        tabBarInactiveTintColor: COLORS.textSecondary,
        headerShown: false,
        tabBarStyle: { backgroundColor: COLORS.surface },
      })}
    >
      <Tab.Screen name="Home" component={HomeStackNavigator} options={{ tabBarLabel: 'Inicio' }} />
      <Tab.Screen
        name="Saved"
        component={SavedScreen}
        options={{
          tabBarLabel: 'Guardados',
          tabBarBadge: savedCount > 0 ? savedCount : undefined,
        }}
      />
    </Tab.Navigator>
  );
}