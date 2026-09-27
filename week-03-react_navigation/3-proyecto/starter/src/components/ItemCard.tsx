import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

import { COLORS, RADIUS, SPACING, TYPOGRAPHY } from '../theme';
import type { Item } from '../types';

interface ItemCardProps {
  item: Item;
  onPress: (item: Item) => void;
}

export function ItemCard({ item, onPress }: ItemCardProps): React.JSX.Element {
  return (
    <Pressable
      style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
      onPress={() => onPress(item)}
      accessibilityRole="button"
      accessibilityLabel={`${item.name}, ${item.price.toLocaleString('es-CO')} pesos`}
    >
      <Image source={{ uri: item.image }} style={styles.image} />
      <Text style={styles.itemName}>{item.name}</Text>
      <Text style={styles.flavor}>{item.flavor}</Text>
      <View style={styles.footer}>
        <Text style={styles.dough}>{item.doughType}</Text>
        <Text style={styles.price}>${item.price.toLocaleString('es-CO')}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    marginHorizontal: SPACING.base,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  cardPressed: {
    backgroundColor: COLORS.surfaceAlt,
  },
  image: {
    width: '100%',
    height: 160,
  },
  itemName: {
    marginTop: SPACING.md,
    marginBottom: SPACING.xs,
    paddingHorizontal: SPACING.base,
    fontSize: TYPOGRAPHY.size.md,
    fontWeight: TYPOGRAPHY.weight.semibold,
    color: COLORS.textPrimary,
  },
  flavor: {
    paddingHorizontal: SPACING.base,
    fontSize: TYPOGRAPHY.size.sm,
    color: COLORS.textSecondary,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: SPACING.sm,
    paddingBottom: SPACING.base,
  },
  dough: {
    paddingHorizontal: SPACING.base,
    fontSize: TYPOGRAPHY.size.sm,
    color: COLORS.textSecondary,
    textTransform: 'capitalize',
  },
  price: {
    paddingHorizontal: SPACING.base,
    fontSize: TYPOGRAPHY.size.base,
    fontWeight: TYPOGRAPHY.weight.semibold,
    color: COLORS.accent,
  },
});