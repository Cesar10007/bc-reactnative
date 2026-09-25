import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { CreateScreen } from '../screens/CreateScreen';
import { DetailScreen } from '../screens/DetailScreen';
import { EditScreen } from '../screens/EditScreen';
import { HomeScreen } from '../screens/HomeScreen';
import { SettingsScreen } from '../screens/SettingsScreen';
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
          headerLeft: () => (
            <Pressable onPress={() => navigation.navigate('Settings')} style={styles.headerButton}>
              <Text style={styles.settingsText}>⚙️</Text>
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

const styles = StyleSheet.create({
  header: { backgroundColor: COLORS.surface },
  headerTitle: { color: COLORS.textPrimary, fontWeight: '700' },
  content: { backgroundColor: COLORS.background },
  headerButton: { paddingHorizontal: 8, paddingVertical: 2 },
  settingsText: { fontSize: 20 },
  createText: { color: COLORS.accent, fontSize: 28, fontWeight: '300' },
});
