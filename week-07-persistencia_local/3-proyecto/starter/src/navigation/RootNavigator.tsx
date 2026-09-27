import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Pressable, StyleSheet, Text } from 'react-native';

import { CreateScreen } from '../screens/CreateScreen';
import { DetailScreen } from '../screens/DetailScreen';
import { EditScreen } from '../screens/EditScreen';
import { HomeScreen } from '../screens/HomeScreen';
import { SavedScreen } from '../screens/SavedScreen';
import { SettingsScreen } from '../screens/SettingsScreen';
import { useSavedStore } from '../stores/savedStore';
import { COLORS } from '../theme';
import type { RootStackParamList, RootTabParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<RootTabParamList>();

function CatalogNavigator(): React.JSX.Element {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: styles.header,
        headerTitleStyle: styles.headerTitle,
        headerTintColor: COLORS.accent,
        contentStyle: styles.content,
      }}
    >
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={({ navigation }) => ({
          title: 'Pizza Ruta',
          headerLeft: () => (
            <Pressable onPress={() => navigation.navigate('Settings')} style={styles.headerButton}>
              <Ionicons name="settings-outline" size={22} color={COLORS.accent} />
            </Pressable>
          ),
          headerRight: () => (
            <Pressable onPress={() => navigation.navigate('Create')} style={styles.headerButton}>
              <Text style={styles.createText}>+</Text>
            </Pressable>
          ),
        })}
      />
      <Stack.Screen name="Detail" component={DetailScreen} options={({ route }) => ({ title: route.params.name })} />
      <Stack.Screen name="Create" component={CreateScreen} options={{ title: 'Nueva pizza', presentation: 'modal' }} />
      <Stack.Screen name="Edit" component={EditScreen} options={({ route }) => ({ title: `Editar ${route.params.name}` })} />
      <Stack.Screen name="Settings" component={SettingsScreen} options={{ title: 'Ajustes' }} />
    </Stack.Navigator>
  );
}

export function RootNavigator(): React.JSX.Element {
  const favoriteCount = useSavedStore((state) => state.items.length);

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: COLORS.accent,
        tabBarInactiveTintColor: COLORS.textSecondary,
        tabBarStyle: { backgroundColor: COLORS.surface, borderTopColor: COLORS.border },
        tabBarIcon: ({ color, size, focused }) => (
          <Ionicons
            name={route.name === 'Catalog'
              ? (focused ? 'pizza' : 'pizza-outline')
              : (focused ? 'heart' : 'heart-outline')}
            color={color}
            size={size}
          />
        ),
      })}
    >
      <Tab.Screen name="Catalog" component={CatalogNavigator} options={{ title: 'Catálogo' }} />
      <Tab.Screen
        name="Favorites"
        component={SavedScreen}
        options={{
          title: 'Favoritas',
          headerShown: true,
          headerStyle: styles.header,
          headerTintColor: COLORS.textPrimary,
          tabBarBadge: favoriteCount || undefined,
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  header: { backgroundColor: COLORS.surface },
  headerTitle: { color: COLORS.textPrimary, fontWeight: '700' },
  content: { backgroundColor: COLORS.background },
  headerButton: { paddingHorizontal: 8, paddingVertical: 2 },
  createText: { color: COLORS.accent, fontSize: 28, fontWeight: '300' },
});
