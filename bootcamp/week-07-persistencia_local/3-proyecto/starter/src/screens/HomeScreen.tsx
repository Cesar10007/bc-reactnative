import React, { useCallback, useMemo } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { useItems } from '../hooks/useItems';
import { usePreferences } from '../hooks/usePreferences';
import type { HomeScreenProps } from '../navigation/types';
import { COLORS, RADIUS, SPACING, TYPOGRAPHY } from '../theme';
import type { Item } from '../types';

interface ItemRowProps {
  item: Item;
  compact: boolean;
}

function ItemRow({ item, compact }: ItemRowProps): React.JSX.Element {
  return (
    <View style={[styles.row, compact && styles.rowCompact]}>
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>{String(item.id)}</Text>
      </View>

      <View style={styles.rowContent}>
        <Text style={styles.rowTitle} numberOfLines={compact ? 1 : 2}>
          {item.title}
        </Text>

        {!compact && (
          <Text style={styles.rowBody} numberOfLines={2}>
            {item.body}
          </Text>
        )}
      </View>
    </View>
  );
}

export function HomeScreen({
  navigation: _navigation,
}: HomeScreenProps): React.JSX.Element {
  const { data, isLoading, isError, refetch, isFetching } = useItems();

  const {
    sortOrder,
    compactMode,
    itemsPerPage,
  } = usePreferences();

  const sortedItems = useMemo(() => {
    if (!data?.items) {
      return [];
    }

    return [...data.items].sort((firstItem, secondItem) =>
      sortOrder === 'asc'
        ? firstItem.title.localeCompare(secondItem.title)
        : secondItem.title.localeCompare(firstItem.title),
    );
  }, [data?.items, sortOrder]);

  const visibleItems = useMemo(
    () => sortedItems.slice(0, itemsPerPage),
    [itemsPerPage, sortedItems],
  );

  const renderItem = useCallback(
    ({ item }: { item: Item }) => (
      <ItemRow item={item} compact={compactMode} />
    ),
    [compactMode],
  );

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={COLORS.accent} />
        <Text style={styles.loadingText}>Cargando ítems...</Text>
      </View>
    );
  }

  if (isError && !data) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>
          No hay conexión y no hay caché disponible
        </Text>

        <Pressable style={styles.retryBtn} onPress={() => void refetch()}>
          <Text style={styles.retryText}>Reintentar</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {data?.source === 'cache' && (
        <View style={styles.offlineBanner}>
          <Text style={styles.offlineText}>
            ⚠️ Sin red — mostrando datos guardados localmente
          </Text>
        </View>
      )}

      <FlatList
        data={visibleItems}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        onRefresh={() => void refetch()}
        refreshing={isFetching && !isLoading}
        ListHeaderComponent={
          <View style={styles.listHeader}>
            <Text style={styles.listHeaderText}>
              Mostrando {visibleItems.length} de {sortedItems.length} ítems ·{' '}
              Orden: {sortOrder === 'asc' ? 'A → Z' : 'Z → A'}
              {compactMode ? ' · Compacto' : ''}
            </Text>
          </View>
        }
        ListEmptyComponent={
          <View style={styles.centered}>
            <Text style={styles.emptyText}>No hay ítems</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: SPACING.md,
    padding: SPACING.lg,
  },
  loadingText: {
    ...TYPOGRAPHY.caption,
  },
  list: {
    paddingVertical: SPACING.sm,
    flexGrow: 1,
  },
  listHeader: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
  },
  listHeaderText: {
    ...TYPOGRAPHY.caption,
  },
  separator: {
    height: 1,
    backgroundColor: COLORS.border,
    marginHorizontal: SPACING.md,
  },
  offlineBanner: {
    backgroundColor: '#78350f',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
  },
  offlineText: {
    ...TYPOGRAPHY.caption,
    color: '#fbbf24',
  },
  errorText: {
    ...TYPOGRAPHY.body,
    textAlign: 'center',
  },
  retryBtn: {
    backgroundColor: COLORS.accent,
    borderRadius: RADIUS.sm,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
  },
  retryText: {
    ...TYPOGRAPHY.body,
    color: '#fff',
    fontWeight: '700',
  },
  emptyText: {
    ...TYPOGRAPHY.body,
  },
  row: {
    flexDirection: 'row',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    alignItems: 'flex-start',
    gap: SPACING.sm,
  },
  rowCompact: {
    paddingVertical: SPACING.sm,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.accent,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 13,
  },
  rowContent: {
    flex: 1,
    gap: 2,
  },
  rowTitle: {
    ...TYPOGRAPHY.body,
    fontWeight: '600',
  },
  rowBody: {
    ...TYPOGRAPHY.caption,
  },
});