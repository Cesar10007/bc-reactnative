import React from 'react';
import { FlatList, Image, Pressable, StyleSheet, Text, View } from 'react-native';

import { useSavedStore } from '../stores/savedStore';
import { COLORS, RADIUS, SPACING, TYPOGRAPHY } from '../theme';
import type { Item } from '../types';

export function SavedScreen(): React.JSX.Element {
  const items = useSavedStore((state) => state.items);
  const removeItem = useSavedStore((state) => state.removeItem);
  const clearAll = useSavedStore((state) => state.clearAll);

  return (
    <View style={styles.container}>
      <FlatList
        data={items}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={styles.list}
        renderItem={({ item }: { item: Item }) => (
          <View style={styles.card}>
            <Image source={{ uri: item.image }} style={styles.image} />
            <View style={styles.cardContent}>
              <Text style={styles.title}>{item.name}</Text>
              <Text style={styles.subtitle}>{item.flavor}</Text>
              <Text style={styles.price}>${item.price.toLocaleString('es-CO')}</Text>
            </View>
            <Pressable onPress={() => removeItem(item.id)} accessibilityLabel={`Quitar ${item.name}`}>
              <Text style={styles.remove}>X</Text>
            </Pressable>
          </View>
        )}
        ListHeaderComponent={
          items.length > 0 ? (
            <View style={styles.header}>
              <Text style={styles.count}>{items.length} pizza{items.length !== 1 ? 's' : ''}</Text>
              <Pressable onPress={clearAll}>
                <Text style={styles.clear}>Limpiar todo</Text>
              </Pressable>
            </View>
          ) : null
        }
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListEmptyComponent={<Text style={styles.empty}>No tienes pizzas guardadas.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  list: { padding: SPACING.md, paddingBottom: SPACING.xl, flexGrow: 1 },
  header: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: SPACING.md },
  count: { ...TYPOGRAPHY.label, textTransform: 'uppercase' },
  clear: { ...TYPOGRAPHY.caption, color: COLORS.error },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    padding: SPACING.md,
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  image: { width: 72, height: 72, borderRadius: RADIUS.sm },
  cardContent: { flex: 1, gap: SPACING.xs },
  title: { ...TYPOGRAPHY.body, fontWeight: '600' },
  subtitle: { ...TYPOGRAPHY.caption },
  price: { ...TYPOGRAPHY.caption, color: COLORS.accent, fontWeight: '600' },
  remove: { ...TYPOGRAPHY.body, color: COLORS.error, fontWeight: '700' },
  separator: { height: SPACING.sm },
  empty: { ...TYPOGRAPHY.body, color: COLORS.textSecondary, textAlign: 'center', marginTop: SPACING.xl },
});