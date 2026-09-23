// src/navigation/RootNavigator.tsx
// Stack Navigator con tres pantallas: Home, Detail y Create.

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Pressable, StyleSheet, Text } from 'react-native';

import { CreateScreen } from '../screens/CreateScreen';
import { DetailScreen } from '../screens/DetailScreen';
import { HomeScreen } from '../screens/HomeScreen';
import { COLORS } from '../theme';
import type { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator(): React.JSX.Element {
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
          headerRight: () => (
            <Pressable
              onPress={() => navigation.navigate('Create')}
              style={styles.createButton}
              accessibilityRole="button"
              accessibilityLabel="Crear nueva pizza"
            >
              <Text style={styles.createButtonText}>+</Text>
            </Pressable>
          ),
        })}
      />

      <Stack.Screen
        name="Detail"
        component={DetailScreen}
        options={({ route }) => ({ title: route.params.name })}
      />

      <Stack.Screen
        name="Create"
        component={CreateScreen}
        options={{ title: 'Nueva pizza', presentation: 'modal' }}
      />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: COLORS.surface,
  },
  headerTitle: {
    color: COLORS.textPrimary,
    fontWeight: '600',
  },
  content: {
    backgroundColor: COLORS.background,
  },
  createButton: {
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  createButtonText: {
    color: COLORS.accent,
    fontSize: 28,
    fontWeight: '300',
  },
});