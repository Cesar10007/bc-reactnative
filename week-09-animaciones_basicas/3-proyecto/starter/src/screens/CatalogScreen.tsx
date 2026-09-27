import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator, Alert, Animated, FlatList, Image, LayoutAnimation,
  Platform, Pressable, StyleSheet, Text, TextInput, UIManager, View,
  type ListRenderItemInfo,
} from 'react-native';

import { AnimatedCard } from '../components/AnimatedCard';
import { ProgressBar } from '../components/ProgressBar';
import { useDeleteItem, useItems } from '../hooks/useItems';
import { usePreferences } from '../hooks/usePreferences';
import type { HomeScreenProps } from '../navigation/types';
import { useSavedStore } from '../stores/savedStore';
import { COLORS, RADIUS, SPACING, TYPOGRAPHY } from '../theme';
import type { Item } from '../types';

if (Platform.OS === 'android') {
  UIManager.setLayoutAnimationEnabledExperimental?.(true);
}

interface PizzaCardProps {
  item: Item; compact: boolean; onDetail: () => void; onEdit: () => void; onDelete: () => void;
}

function PizzaCard({ item, compact, onDetail, onEdit, onDelete }: PizzaCardProps): React.JSX.Element {
  return (
    <AnimatedCard style={[styles.card, compact && styles.cardCompact]} onPress={onDetail}>
      <Image source={{ uri: item.image }} style={[styles.image, compact && styles.imageCompact]} />
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle} numberOfLines={1}>{item.name}</Text>
        <Text style={styles.cardSubtitle} numberOfLines={1}>{item.flavor} · Masa {item.doughType}</Text>
        {!compact && <Text style={styles.description} numberOfLines={2}>{item.description}</Text>}
        <ProgressBar progress={Math.min(item.price / 50000, 1)} label="Nivel de precio" />
        <View style={styles.cardFooter}>
          <Text style={styles.price}>${item.price.toLocaleString('es-CO')}</Text>
          <View style={styles.cardActions}>
            <Pressable style={styles.editButton} onPress={onEdit}><Text style={styles.editText}>Editar</Text></Pressable>
            <Pressable style={styles.deleteButton} onPress={onDelete}><Text style={styles.deleteText}>Eliminar</Text></Pressable>
          </View>
        </View>
      </View>
    </AnimatedCard>
  );
}

export function CatalogScreen({ navigation }: HomeScreenProps): React.JSX.Element {
  const [query, setQuery] = useState('');
  const { data, isLoading, isError, error, refetch, isFetching } = useItems();
  const { mutate: deleteItem } = useDeleteItem();
  const removeFavorite = useSavedStore((state) => state.removeItem);
  const { sortOrder, compactMode, itemsPerPage } = usePreferences();
  const headerOpacity = useRef(new Animated.Value(0)).current;
  const headerY = useRef(new Animated.Value(-18)).current;
  const rotation = useRef(new Animated.Value(0)).current;
  const iconOpacity = useRef(new Animated.Value(0)).current;
  const itemAnimations = useRef(new Map<string, Animated.Value>()).current;
  const previousCount = useRef<number | null>(null);

  const catalog = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase('es');
    const filtered = (data?.items ?? []).filter((item) =>
      !normalized || `${item.name} ${item.flavor}`.toLocaleLowerCase('es').includes(normalized),
    );
    filtered.sort((a, b) => {
      const localA = String(a.id).startsWith('local-');
      const localB = String(b.id).startsWith('local-');
      if (localA !== localB) return localA ? -1 : 1;
      return sortOrder === 'asc' ? a.name.localeCompare(b.name, 'es') : b.name.localeCompare(a.name, 'es');
    });
    return { visibleItems: filtered.slice(0, itemsPerPage), filteredCount: filtered.length, totalCount: data?.items.length ?? 0 };
  }, [data?.items, itemsPerPage, query, sortOrder]);

  const idsKey = catalog.visibleItems.map((item) => String(item.id)).join('|');

  useEffect(() => {
    Animated.parallel([
      Animated.timing(headerOpacity, { toValue: 1, duration: 500, useNativeDriver: true }),
      Animated.timing(headerY, { toValue: 0, duration: 500, useNativeDriver: true }),
      Animated.timing(rotation, { toValue: 1, duration: 700, useNativeDriver: true }),
    ]).start();
    Animated.sequence([
      Animated.timing(iconOpacity, { toValue: 1, duration: 260, useNativeDriver: true }),
      Animated.timing(iconOpacity, { toValue: 0, duration: 180, useNativeDriver: true }),
      Animated.timing(iconOpacity, { toValue: 1, duration: 260, useNativeDriver: true }),
    ]).start();
  }, [headerOpacity, headerY, iconOpacity, rotation]);

  useEffect(() => {
    const animations = catalog.visibleItems.map((item) => {
      const key = String(item.id);
      let value = itemAnimations.get(key);
      if (!value) {
        value = new Animated.Value(0);
        itemAnimations.set(key, value);
      }
      value.setValue(0);
      return Animated.timing(value, { toValue: 1, duration: 400, useNativeDriver: true });
    });
    Animated.stagger(80, animations).start();
  }, [idsKey, itemAnimations]);

  useEffect(() => {
    const count = data?.items.length ?? 0;
    if (previousCount.current !== null && previousCount.current !== count) {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    }
    previousCount.current = count;
  }, [data?.items.length]);

  const confirmDelete = useCallback((item: Item) => {
    Alert.alert('Eliminar pizza', `¿Quieres eliminar “${item.name}” del catálogo?`, [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Eliminar', style: 'destructive', onPress: () => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        removeFavorite(item.id);
        deleteItem(item.id);
      } },
    ]);
  }, [deleteItem, removeFavorite]);

  const renderItem = useCallback(({ item }: ListRenderItemInfo<Item>) => {
    const key = String(item.id);
    let animated = itemAnimations.get(key);
    if (!animated) {
      animated = new Animated.Value(0);
      itemAnimations.set(key, animated);
    }
    const translateY = animated.interpolate({ inputRange: [0, 1], outputRange: [22, 0], extrapolate: 'clamp' });
    return (
      <Animated.View style={{ opacity: animated, transform: [{ translateY }] }}>
        <PizzaCard
          item={item}
          compact={compactMode}
          onDetail={() => navigation.navigate('Detail', item)}
          onEdit={() => navigation.navigate('Edit', { id: item.id, name: item.name })}
          onDelete={() => confirmDelete(item)}
        />
      </Animated.View>
    );
  }, [compactMode, confirmDelete, itemAnimations, navigation]);

  if (isLoading) return <View style={styles.centered}><ActivityIndicator size="large" color={COLORS.accent} /><Text style={styles.muted}>Cargando pizzas...</Text></View>;
  if (isError && !data) return <View style={styles.centered}><Text style={styles.error}>No se pudieron cargar las pizzas</Text><Text style={styles.muted}>{error instanceof Error ? error.message : 'Sin conexión y sin caché'}</Text><Pressable style={styles.retry} onPress={() => void refetch()}><Text style={styles.retryText}>Reintentar</Text></Pressable></View>;

  const spin = rotation.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'], extrapolate: 'clamp' });

  return (
    <View style={styles.container}>
      {data?.source === 'cache' && <View style={styles.offline}><Text style={styles.offlineText}>⚠️ Sin red — catálogo guardado en el dispositivo</Text></View>}
      <Animated.View style={[styles.hero, { opacity: headerOpacity, transform: [{ translateY: headerY }] }]}>
        <View style={styles.titleRow}><Animated.Text style={[styles.pizzaIcon, { opacity: iconOpacity, transform: [{ rotate: spin }] }]}>🍕</Animated.Text><Text style={styles.title}>Pizza Ruta</Text></View>
        <Text style={styles.muted}>Pizzas artesanales con delivery</Text>
      </Animated.View>
      <View style={styles.searchWrap}><TextInput style={styles.search} value={query} onChangeText={setQuery} placeholder="Buscar por pizza o sabor..." placeholderTextColor={COLORS.textMuted} /></View>
      <FlatList
        data={catalog.visibleItems}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        onRefresh={() => void refetch()}
        refreshing={isFetching && !isLoading}
        ListHeaderComponent={<Text style={styles.count}>Mostrando {catalog.visibleItems.length} de {catalog.filteredCount}{query.trim() ? ` · ${catalog.totalCount} en total` : ''}{' · '}{sortOrder === 'asc' ? 'A → Z' : 'Z → A'}{compactMode ? ' · Compacto' : ''}</Text>}
        ListEmptyComponent={<Text style={styles.empty}>No encontramos pizzas con esa búsqueda.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: SPACING.md, padding: SPACING.lg, backgroundColor: COLORS.background },
  hero: { paddingHorizontal: SPACING.lg, paddingTop: SPACING.lg, paddingBottom: SPACING.md },
  titleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: SPACING.sm },
  pizzaIcon: { fontSize: 30 }, title: { ...TYPOGRAPHY.h1 }, muted: { ...TYPOGRAPHY.caption, textAlign: 'center' },
  searchWrap: { paddingHorizontal: SPACING.md, paddingBottom: SPACING.md },
  search: { backgroundColor: COLORS.card, borderWidth: 1, borderColor: COLORS.border, borderRadius: RADIUS.md, padding: SPACING.md, ...TYPOGRAPHY.body },
  list: { padding: SPACING.md, paddingTop: 0, paddingBottom: SPACING.xxl, flexGrow: 1 }, count: { ...TYPOGRAPHY.label, textTransform: 'uppercase', letterSpacing: 0.7, marginBottom: SPACING.sm }, separator: { height: SPACING.sm },
  card: { backgroundColor: COLORS.card, borderRadius: RADIUS.md, borderWidth: 1, borderColor: COLORS.border, overflow: 'hidden' }, cardCompact: { flexDirection: 'row' },
  image: { width: '100%', height: 160 }, imageCompact: { width: 88, height: 140 }, cardContent: { flex: 1, padding: SPACING.md, gap: SPACING.xs },
  cardTitle: { ...TYPOGRAPHY.body, fontWeight: '700' }, cardSubtitle: { ...TYPOGRAPHY.caption }, description: { ...TYPOGRAPHY.caption, color: COLORS.textSecondary },
  cardFooter: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: SPACING.xs }, price: { ...TYPOGRAPHY.body, color: COLORS.accent, fontWeight: '700' }, cardActions: { flexDirection: 'row', gap: SPACING.xs },
  editButton: { borderWidth: 1, borderColor: COLORS.accent, borderRadius: RADIUS.sm, paddingHorizontal: SPACING.sm, paddingVertical: 4 }, editText: { ...TYPOGRAPHY.caption, color: COLORS.accent, fontWeight: '700' },
  deleteButton: { borderWidth: 1, borderColor: COLORS.error, borderRadius: RADIUS.sm, paddingHorizontal: SPACING.sm, paddingVertical: 4 }, deleteText: { ...TYPOGRAPHY.caption, color: COLORS.error, fontWeight: '700' },
  offline: { backgroundColor: '#78350f', padding: SPACING.sm }, offlineText: { ...TYPOGRAPHY.caption, color: '#fbbf24', textAlign: 'center' }, error: { ...TYPOGRAPHY.h3, color: COLORS.error, textAlign: 'center' }, retry: { backgroundColor: COLORS.accent, borderRadius: RADIUS.sm, paddingHorizontal: SPACING.lg, paddingVertical: SPACING.sm }, retryText: { ...TYPOGRAPHY.body, color: COLORS.background, fontWeight: '700' }, empty: { ...TYPOGRAPHY.body, color: COLORS.textSecondary, textAlign: 'center', marginTop: SPACING.xl },
});
