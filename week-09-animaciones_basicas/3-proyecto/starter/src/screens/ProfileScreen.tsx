import React from 'react';
import { Alert, Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { getProfile } from '../services/authService';
import { useAuthStore } from '../stores/authStore';
import { useSavedStore } from '../stores/savedStore';
import { theme } from '../theme';

export function ProfileScreen(): React.JSX.Element {
  const storedUser = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const favoriteCount = useSavedStore((state) => state.items.length);
  const { data } = useQuery({
    queryKey: ['auth-profile', storedUser?.id],
    queryFn: getProfile,
    enabled: Boolean(storedUser),
  });
  const user = data ?? storedUser;

  function confirmLogout(): void {
    Alert.alert('Cerrar sesión', '¿Quieres salir de Pizza Ruta?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Salir', style: 'destructive', onPress: () => void logout() },
    ]);
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {user?.image ? <Image source={{ uri: user.image }} style={styles.avatar} /> : null}
      <Text style={styles.name}>{user ? `${user.firstName} ${user.lastName}` : 'Cliente Pizza Ruta'}</Text>
      <Text style={styles.email}>{user?.email ?? '—'}</Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Mi cuenta de delivery</Text>
        <View style={styles.row}><Text style={styles.label}>Usuario</Text><Text style={styles.value}>{user?.username ?? '—'}</Text></View>
        <View style={styles.row}><Text style={styles.label}>Pizzas favoritas</Text><Text style={styles.value}>{favoriteCount}</Text></View>
        <View style={styles.row}><Text style={styles.label}>Beneficio</Text><Text style={styles.value}>Cliente Pizza Ruta</Text></View>
      </View>

      <Text style={styles.security}>Tus tokens se almacenan cifrados en SecureStore y nunca se muestran en pantalla.</Text>
      <Pressable style={styles.logout} onPress={confirmLogout}><Text style={styles.logoutText}>Cerrar sesión</Text></Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  content: { padding: theme.spacing.lg, alignItems: 'center', gap: theme.spacing.md },
  avatar: { width: 92, height: 92, borderRadius: 46 },
  name: { color: theme.colors.text, fontSize: theme.fontSize.xl, fontWeight: '700' },
  email: { color: theme.colors.textSecondary, fontSize: theme.fontSize.sm },
  card: { width: '100%', backgroundColor: theme.colors.surface, borderRadius: theme.radius.lg, padding: theme.spacing.md, gap: theme.spacing.sm },
  cardTitle: { color: theme.colors.brand, fontSize: theme.fontSize.lg, fontWeight: '700' },
  row: { flexDirection: 'row', justifyContent: 'space-between', borderBottomWidth: 1, borderBottomColor: theme.colors.border, paddingVertical: theme.spacing.sm },
  label: { color: theme.colors.textSecondary },
  value: { color: theme.colors.text, fontWeight: '600' },
  security: { color: theme.colors.textMuted, textAlign: 'center', fontSize: theme.fontSize.sm },
  logout: { width: '100%', backgroundColor: theme.colors.danger, borderRadius: theme.radius.md, padding: 14, alignItems: 'center' },
  logoutText: { color: '#fff', fontWeight: '700' },
});
