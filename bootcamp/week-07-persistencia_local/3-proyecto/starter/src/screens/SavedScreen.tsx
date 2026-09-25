import React from 'react';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { FlatList, Image, Pressable, StyleSheet, Text, View } from 'react-native';

import type { RootTabParamList } from '../navigation/types';
import { useSavedStore } from '../stores/savedStore';
import { COLORS, RADIUS, SPACING, TYPOGRAPHY } from '../theme';

type Props = BottomTabScreenProps<RootTabParamList, 'Favorites'>;

export function SavedScreen({ navigation }: Props): React.JSX.Element {
  const items = useSavedStore((state) => state.items);
  const removeItem = useSavedStore((state) => state.removeItem);
  const clearAll = useSavedStore((state) => state.clearAll);

  return (
    <View style={styles.container}>
      <FlatList
        data={items}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={styles.list}
        ItemSeparatorComponent={() => <View style={{ height: SPACING.sm }} />}
        ListHeaderComponent={items.length ? (
          <View style={styles.header}>
            <Text style={styles.count}>{items.length} favorita{items.length === 1 ? '' : 's'}</Text>
            <Pressable onPress={clearAll}><Text style={styles.clear}>Limpiar todo</Text></Pressable>
          </View>
        ) : null}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Pressable
              style={styles.detailLink}
              onPress={() =>
                navigation.navigate('Catalog', {
                  screen: 'Detail',
                  params: item,
                })
              }
              accessibilityLabel={`Ver detalles de ${item.name}`}
            >
              <Image source={{ uri: item.image }} style={styles.image} />
              <View style={styles.info}>
                <Text style={styles.title} numberOfLines={1}>{item.name}</Text>
                <Text style={styles.subtitle}>{item.flavor}</Text>
                <Text style={styles.price}>${item.price.toLocaleString('es-CO')}</Text>
              </View>
            </Pressable>
            <Pressable onPress={() => removeItem(item.id)} style={styles.remove}>
              <Text style={styles.removeText}>✕</Text>
            </Pressable>
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.star}>☆</Text>
            <Text style={styles.emptyTitle}>No tienes pizzas favoritas</Text>
            <Text style={styles.subtitle}>Abre el detalle de una pizza para guardarla.</Text>
          </View>
        }
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
  card: { flexDirection: 'row', alignItems: 'center', gap: SPACING.md, padding: SPACING.md, backgroundColor: COLORS.card, borderRadius: RADIUS.md, borderWidth: 1, borderColor: COLORS.border },
  detailLink: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: SPACING.md },
  image: { width: 72, height: 72, borderRadius: RADIUS.sm },
  info: { flex: 1, gap: SPACING.xs },
  title: { ...TYPOGRAPHY.body, fontWeight: '700' },
  subtitle: { ...TYPOGRAPHY.caption },
  price: { ...TYPOGRAPHY.caption, color: COLORS.accent, fontWeight: '700' },
  remove: { width: 34, height: 34, borderRadius: RADIUS.full, backgroundColor: COLORS.surface, alignItems: 'center', justifyContent: 'center' },
  removeText: { color: COLORS.error, fontWeight: '700' },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: SPACING.md },
  star: { color: COLORS.accent, fontSize: 52 },
  emptyTitle: { ...TYPOGRAPHY.h3 },
});
