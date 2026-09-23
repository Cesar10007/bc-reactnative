// src/screens/DetailScreen.tsx
// Pantalla de detalle — recibe los datos del ítem seleccionado via params.
// Los params llegan del Stack Navigator cuando se llama navigate('HomeDetail', {...}).

import { useRoute } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';

import { COLORS, RADIUS, SPACING, TYPOGRAPHY } from '../theme';
import type { HomeStackParamList } from '../navigation/types';

// Tipo del route hook para leer los params tipados de esta pantalla
type DetailScreenRouteProp = RouteProp<HomeStackParamList, 'HomeDetail'>;

export function DetailScreen(): React.JSX.Element {
  // useRoute devuelve los params pasados desde HomeScreen
  const route = useRoute<DetailScreenRouteProp>();
  const { id, name, image, price, flavor, doughType } = route.params;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
    >
      {/* Título del elemento */}
      <Text style={styles.name}>{name}</Text>

      <Image source={{ uri: image }} style={styles.image} />

      {/* Badge con el ID */}
      <View style={styles.badge}>
        <Text style={styles.badgeText}>ID: {id}</Text>
      </View>

      <View style={styles.field}>
        <Text style={styles.fieldLabel}>Sabor</Text>
        <Text style={styles.fieldValue}>{flavor}</Text>
      </View>
      <View style={styles.field}>
        <Text style={styles.fieldLabel}>Tipo de masa</Text>
        <Text style={styles.fieldValue}>{doughType}</Text>
      </View>
      <View style={styles.field}>
        <Text style={styles.fieldLabel}>Precio</Text>
        <Text style={styles.fieldValue}>${price.toLocaleString('es-CO')}</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    padding: SPACING.base,
    gap: SPACING.md,
  },
  name: {
    fontSize: TYPOGRAPHY.size.xl,
    fontWeight: TYPOGRAPHY.weight.bold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
  },
  image: {
    width: '100%',
    height: 220,
    borderRadius: RADIUS.md,
  },
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: COLORS.accentDim,
    borderRadius: RADIUS.full,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    marginBottom: SPACING.md,
  },
  badgeText: {
    fontSize: TYPOGRAPHY.size.xs,
    fontWeight: TYPOGRAPHY.weight.medium,
    color: COLORS.accent,
  },
  field: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    padding: SPACING.base,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  fieldLabel: {
    fontSize: TYPOGRAPHY.size.sm,
    fontWeight: TYPOGRAPHY.weight.medium,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xs,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  fieldValue: {
    fontSize: TYPOGRAPHY.size.base,
    color: COLORS.textPrimary,
  },
});
