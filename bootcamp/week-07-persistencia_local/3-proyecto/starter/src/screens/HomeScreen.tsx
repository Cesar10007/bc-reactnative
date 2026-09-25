import React, { useCallback, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  type ListRenderItem,
} from 'react-native';

import { useDeleteItem, useItems } from '../hooks/useItems';
import { usePreferences } from '../hooks/usePreferences';
import type { HomeScreenProps } from '../navigation/types';
import { useSavedStore } from '../stores/savedStore';
import { COLORS, RADIUS, SPACING, TYPOGRAPHY } from '../theme';
import type { Item } from '../types';

interface PizzaCardProps {
  item: Item;
  compact: boolean;
  onDetail: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

function PizzaCard({ item, compact, onDetail, onEdit, onDelete }: PizzaCardProps): React.JSX.Element {
  return (
    <Pressable style={({ pressed }) => [styles.card, compact && styles.cardCompact, pressed && styles.pressed]} onPress={onDetail}>
      <Image source={{ uri: item.image }} style={[styles.image, compact && styles.imageCompact]} />
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle} numberOfLines={1}>{item.name}</Text>
        <Text style={styles.cardSubtitle} numberOfLines={1}>{item.flavor} · Masa {item.doughType}</Text>
        {!compact && <Text style={styles.description} numberOfLines={2}>{item.description}</Text>}
        <View style={styles.cardFooter}>
          <Text style={styles.price}>${item.price.toLocaleString('es-CO')}</Text>
          <View style={styles.cardActions}>
            <Pressable style={styles.editButton} onPress={onEdit} hitSlop={8}>
              <Text style={styles.editText}>Editar</Text>
            </Pressable>
            <Pressable style={styles.deleteButton} onPress={onDelete} hitSlop={8}>
              <Text style={styles.deleteText}>Eliminar</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Pressable>
  );
}

export function HomeScreen({ navigation }: HomeScreenProps): React.JSX.Element {
  const [query, setQuery] = useState('');
  const { data, isLoading, isError, error, refetch, isFetching } = useItems();
  const { mutate: deleteItem } = useDeleteItem();
  const removeFavorite = useSavedStore((state) => state.removeItem);
  const { sortOrder, compactMode, itemsPerPage } = usePreferences();

  const catalog = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase('es');
    const filtered = (data?.items ?? []).filter((item) =>
      !normalized || `${item.name} ${item.flavor}`.toLocaleLowerCase('es').includes(normalized),
    );
    filtered.sort((a, b) => {
      const aIsLocal = String(a.id).startsWith('local-');
      const bIsLocal = String(b.id).startsWith('local-');

      // Las pizzas recién creadas siempre quedan visibles al inicio, aunque la
      // preferencia limite el catálogo a 5 o 10 resultados.
      if (aIsLocal !== bIsLocal) return aIsLocal ? -1 : 1;

      return sortOrder === 'asc'
        ? a.name.localeCompare(b.name, 'es')
        : b.name.localeCompare(a.name, 'es');
    });
    return {
      visibleItems: filtered.slice(0, itemsPerPage),
      filteredCount: filtered.length,
      totalCount: data?.items.length ?? 0,
    };
  }, [data?.items, itemsPerPage, query, sortOrder]);

  const confirmDelete = useCallback((item: Item) => {
    Alert.alert(
      'Eliminar pizza',
      `¿Quieres eliminar “${item.name}” del catálogo?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: () => {
            removeFavorite(item.id);
            deleteItem(item.id);
          },
        },
      ],
    );
  }, [deleteItem, removeFavorite]);

  const renderItem: ListRenderItem<Item> = useCallback(({ item }) => (
    <PizzaCard
      item={item}
      compact={compactMode}
      onDetail={() => navigation.navigate('Detail', item)}
      onEdit={() => navigation.navigate('Edit', { id: item.id, name: item.name })}
      onDelete={() => confirmDelete(item)}
    />
  ), [compactMode, confirmDelete, navigation]);

  if (isLoading) {
    return <View style={styles.centered}><ActivityIndicator size="large" color={COLORS.accent} /><Text style={styles.muted}>Cargando pizzas...</Text></View>;
  }

  if (isError && !data) {
    return (
      <View style={styles.centered}>
        <Text style={styles.error}>No se pudieron cargar las pizzas</Text>
        <Text style={styles.muted}>{error instanceof Error ? error.message : 'Sin conexión y sin caché'}</Text>
        <Pressable style={styles.retry} onPress={() => void refetch()}><Text style={styles.retryText}>Reintentar</Text></Pressable>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {data?.source === 'cache' && <View style={styles.offline}><Text style={styles.offlineText}>⚠️ Sin red — catálogo guardado en el dispositivo</Text></View>}
      <View style={styles.hero}>
        <Text style={styles.title}>Pizza Ruta</Text>
        <Text style={styles.muted}>Pizzas artesanales con delivery</Text>
      </View>
      <View style={styles.searchWrap}>
        <TextInput style={styles.search} value={query} onChangeText={setQuery} placeholder="Buscar por pizza o sabor..." placeholderTextColor={COLORS.textMuted} />
      </View>
      <FlatList
        data={catalog.visibleItems}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        onRefresh={() => void refetch()}
        refreshing={isFetching && !isLoading}
        ListHeaderComponent={
          <Text style={styles.count}>
            Mostrando {catalog.visibleItems.length} de {catalog.filteredCount}
            {query.trim() ? ` · ${catalog.totalCount} en total` : ''}
            {' · '}{sortOrder === 'asc' ? 'A → Z' : 'Z → A'}
            {compactMode ? ' · Compacto' : ''}
          </Text>
        }
        ListEmptyComponent={<Text style={styles.empty}>No encontramos pizzas con esa búsqueda.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: SPACING.md, padding: SPACING.lg, backgroundColor: COLORS.background },
  hero: { paddingHorizontal: SPACING.lg, paddingTop: SPACING.lg, paddingBottom: SPACING.md },
  title: { ...TYPOGRAPHY.h1 },
  muted: { ...TYPOGRAPHY.caption, textAlign: 'center' },
  searchWrap: { paddingHorizontal: SPACING.md, paddingBottom: SPACING.md },
  search: { backgroundColor: COLORS.card, borderWidth: 1, borderColor: COLORS.border, borderRadius: RADIUS.md, padding: SPACING.md, ...TYPOGRAPHY.body },
  list: { padding: SPACING.md, paddingTop: 0, paddingBottom: SPACING.xxl, flexGrow: 1 },
  count: { ...TYPOGRAPHY.label, textTransform: 'uppercase', letterSpacing: 0.7, marginBottom: SPACING.sm },
  separator: { height: SPACING.sm },
  card: { backgroundColor: COLORS.card, borderRadius: RADIUS.md, borderWidth: 1, borderColor: COLORS.border, overflow: 'hidden' },
  cardCompact: { flexDirection: 'row' },
  pressed: { opacity: 0.75 },
  image: { width: '100%', height: 160 },
  imageCompact: { width: 88, height: 104 },
  cardContent: { flex: 1, padding: SPACING.md, gap: SPACING.xs },
  cardTitle: { ...TYPOGRAPHY.body, fontWeight: '700' },
  cardSubtitle: { ...TYPOGRAPHY.caption },
  description: { ...TYPOGRAPHY.caption, color: COLORS.textSecondary },
  cardFooter: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: SPACING.xs },
  price: { ...TYPOGRAPHY.body, color: COLORS.accent, fontWeight: '700' },
  cardActions: { flexDirection: 'row', gap: SPACING.xs },
  editButton: { borderWidth: 1, borderColor: COLORS.accent, borderRadius: RADIUS.sm, paddingHorizontal: SPACING.sm, paddingVertical: 4 },
  editText: { ...TYPOGRAPHY.caption, color: COLORS.accent, fontWeight: '700' },
  deleteButton: { borderWidth: 1, borderColor: COLORS.error, borderRadius: RADIUS.sm, paddingHorizontal: SPACING.sm, paddingVertical: 4 },
  deleteText: { ...TYPOGRAPHY.caption, color: COLORS.error, fontWeight: '700' },
  offline: { backgroundColor: '#78350f', padding: SPACING.sm },
  offlineText: { ...TYPOGRAPHY.caption, color: '#fbbf24', textAlign: 'center' },
  error: { ...TYPOGRAPHY.h3, color: COLORS.error, textAlign: 'center' },
  retry: { backgroundColor: COLORS.accent, borderRadius: RADIUS.sm, paddingHorizontal: SPACING.lg, paddingVertical: SPACING.sm },
  retryText: { ...TYPOGRAPHY.body, color: COLORS.background, fontWeight: '700' },
  empty: { ...TYPOGRAPHY.body, color: COLORS.textSecondary, textAlign: 'center', marginTop: SPACING.xl },
});
