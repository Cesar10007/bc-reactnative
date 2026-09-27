import React from 'react';
import { View, Text, Image, Pressable, StyleSheet } from 'react-native';
import { Item } from '../types';
import { COLORS, TYPOGRAPHY, SPACING, RADIUS } from '../theme';

interface ItemCardProps {
  item: Item;
  onPress: (item: Item) => void;
}

/**
 * Tarjeta reutilizable para mostrar un elemento del dominio.
 * Personaliza el contenido según los campos de tu interfaz Item.
 */
export function ItemCard({ item, onPress }: ItemCardProps): React.JSX.Element {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.card,
        pressed && styles.cardPressed,
      ]}
      onPress={() => onPress(item)}
      accessibilityRole="button"
      accessibilityLabel={`${item.name}, ${item.price.toLocaleString('es-CO')} pesos`}
    >
      <Image source={{ uri: item.image }} style={styles.image} />
      <Text style={styles.itemName}>{item.name}</Text>
      <Text style={styles.fieldText}>{item.flavor}</Text>
      <View style={styles.footer}>
        <Text style={styles.fieldText}>{item.doughType}</Text>
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
    marginVertical: SPACING.xs,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  cardPressed: {
    backgroundColor: COLORS.surfaceAlt,
  },
  itemName: {
    fontSize: TYPOGRAPHY.size.md,
    fontWeight: TYPOGRAPHY.weight.semibold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
    paddingHorizontal: SPACING.base,
    marginTop: SPACING.md,
  },
  fieldText: {
    fontSize: TYPOGRAPHY.size.sm,
    color: COLORS.textSecondary,
    marginBottom: 2,
    paddingHorizontal: SPACING.base,
  },
  image: {
    width: '100%',
    height: 160,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: SPACING.sm,
    paddingBottom: SPACING.base,
  },
  price: {
    fontSize: TYPOGRAPHY.size.base,
    fontWeight: TYPOGRAPHY.weight.semibold,
    color: COLORS.accent,
    paddingHorizontal: SPACING.base,
  },
});
