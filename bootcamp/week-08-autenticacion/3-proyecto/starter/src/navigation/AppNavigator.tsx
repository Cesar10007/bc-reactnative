import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Pressable, StyleSheet, Text } from 'react-native';
import type { AppTabParamList, CatalogStackParamList } from './types';
import { CatalogScreen } from '../screens/CatalogScreen';
import { CreateScreen } from '../screens/CreateScreen';
import { DetailScreen } from '../screens/DetailScreen';
import { EditScreen } from '../screens/EditScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { SavedScreen } from '../screens/SavedScreen';
import { SettingsScreen } from '../screens/SettingsScreen';
import { useSavedStore } from '../stores/savedStore';
import { COLORS } from '../theme';

const Tab = createBottomTabNavigator<AppTabParamList>();
const Stack = createNativeStackNavigator<CatalogStackParamList>();

function CatalogNavigator(): React.JSX.Element {
  return (
    <Stack.Navigator screenOptions={{ headerStyle: styles.header, headerTintColor: COLORS.accent, contentStyle: styles.content }}>
      <Stack.Screen
        name="Home"
        component={CatalogScreen}
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

export function AppNavigator(): React.JSX.Element {
  const favorites = useSavedStore((state) => state.items.length);
  return (
    <Tab.Navigator screenOptions={({ route }) => ({
      headerShown: false,
      tabBarActiveTintColor: COLORS.accent,
      tabBarInactiveTintColor: COLORS.textSecondary,
      tabBarStyle: styles.tabBar,
      tabBarIcon: ({ color, size, focused }) => (
        <Ionicons
          name={route.name === 'Catalog' ? (focused ? 'pizza' : 'pizza-outline') : route.name === 'Favorites' ? (focused ? 'heart' : 'heart-outline') : (focused ? 'person' : 'person-outline')}
          color={color}
          size={size}
        />
      ),
    })}>
      <Tab.Screen name="Catalog" component={CatalogNavigator} options={{ title: 'Catálogo' }} />
      <Tab.Screen name="Favorites" component={SavedScreen} options={{ title: 'Favoritas', headerShown: true, headerStyle: styles.header, headerTintColor: COLORS.text, tabBarBadge: favorites || undefined }} />
      <Tab.Screen name="Profile" component={ProfileScreen} options={{ title: 'Mi perfil', headerShown: true, headerStyle: styles.header, headerTintColor: COLORS.text }} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  header: { backgroundColor: COLORS.surface },
  content: { backgroundColor: COLORS.background },
  tabBar: { backgroundColor: COLORS.surface, borderTopColor: COLORS.border },
  headerButton: { paddingHorizontal: 8, paddingVertical: 2 },
  createText: { color: COLORS.accent, fontSize: 28, fontWeight: '300' },
});
