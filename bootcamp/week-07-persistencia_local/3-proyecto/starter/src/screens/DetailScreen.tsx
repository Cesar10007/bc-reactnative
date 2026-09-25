import React from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useRoute, type RouteProp } from '@react-navigation/native';

import type { RootStackParamList } from '../navigation/types';
import { COLORS, RADIUS, SPACING, TYPOGRAPHY } from '../theme';

type DetailRouteProp = RouteProp<RootStackParamList, 'Detail'>;

export function DetailScreen(): React.JSX.Element {
  const route = useRoute<DetailRouteProp>();

  const {
    id,
    name,
    image,
    price,
    flavor,
    doughType,
    description,
  } = route.params;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Image source={{ uri: image }} style={styles.heroImage} />

      <Text style={styles.title}>{name}</Text>
      <Text style={styles.idBadge}>ID: {id}</Text>

      <View style={styles.detailsCard}>
        <Text style={styles.description}>
          {description ?? 'Pizza artesanal de Pizza Ruta.'}
        </Text>

        <Text style={styles.detail}>Sabor: {flavor}</Text>
        <Text style={styles.detail}>Masa: {doughType}</Text>
        <Text style={styles.detail}>
          Precio: ${price.toLocaleString('es-CO')}
        </Text>
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
    padding: SPACING.lg,
    gap: SPACING.md,
    paddingBottom: SPACING.xxl,
  },
  heroImage: {
    width: '100%',
    height: 220,
    borderRadius: RADIUS.lg,
  },
  title: {
    ...TYPOGRAPHY.h2,
  },
  idBadge: {
    ...TYPOGRAPHY.label,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  detailsCard: {
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    gap: SPACING.sm,
  },
  description: {
    ...TYPOGRAPHY.body,
    color: COLORS.textSecondary,
    marginBottom: SPACING.sm,
  },
  detail: {
    ...TYPOGRAPHY.body,
    color: COLORS.textSecondary,
  },
});