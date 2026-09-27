// src/screens/HomeScreen.tsx
// Pantalla principal: lista de ítems cargada desde la API.
// TODO: conectar con useItems() y manejar todos los estados de red.

import React, { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
  type ListRenderItem,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { COLORS, RADIUS, SPACING, TYPOGRAPHY } from '../theme';
import { useItems } from '../hooks/useItems';
import type { Item } from '../types';
import type { RootStackParamList } from '../navigation/types';

// TODO: importar el hook de fetching
// import { useItems } from '../hooks/useItems';

type HomeNavProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

// ============================================================
// SUB-COMPONENTE: ItemCard
// ============================================================

interface ItemCardProps {
  item: Item;
  onPress: () => void;
}

function ItemCard({ item, onPress }: ItemCardProps): React.JSX.Element {
  return (
    <Pressable
      style={({ pressed }) => [styles.card, pressed && { opacity: 0.7 }]}
      onPress={onPress}
      testID={`item-card-${item.id}`}
    >
      <Image source={{ uri: item.image }} style={styles.image} />
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle}>{item.name}</Text>
        <Text style={styles.cardSubtitle}>{item.flavor}</Text>
        <View style={styles.cardFooter}>
          <Text style={styles.cardSubtitle}>{item.doughType}</Text>
          <Text style={styles.price}>${item.price.toLocaleString('es-CO')}</Text>
        </View>
      </View>
      <Text style={styles.chevron}>›</Text>
    </Pressable>
  );
}

// ============================================================
// PANTALLA: HomeScreen
// ============================================================

export function HomeScreen(): React.JSX.Element {
  const navigation = useNavigation<HomeNavProp>();
  const [query, setQuery] = useState('');
  const { data, isLoading, isError, isFetching, refetch, error } = useItems();

  const filteredItems = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase();

    if (!normalizedQuery) {
      return data ?? [];
    }

    return (data ?? []).filter((item) =>
      item.name.toLocaleLowerCase().includes(normalizedQuery),
    );
  }, [data, query]);

  // ── Estados de carga ─────────────────────────────────────

  // TODO: mostrar spinner solo en el primer fetch (sin caché)
  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={COLORS.accent} />
        <Text style={styles.loadingText}>Cargando...</Text>
      </View>
    );
  }

  // TODO: mostrar error con botón de reintentar
  if (isError) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>❌ No se pudo cargar la lista</Text>
        <Text style={styles.errorDetail}>{(error as Error)?.message}</Text>
        <Pressable style={styles.retryButton} onPress={() => void refetch()}>
          <Text style={styles.retryButtonText}>Reintentar</Text>
        </Pressable>
      </View>
    );
  }

  const renderItem: ListRenderItem<Item> = ({ item }) => (
    <ItemCard
      item={item}
      onPress={() =>
        navigation.navigate('Detail', {
          id: item.id,
          name: item.name,
          image: item.image,
          description: item.description,
          price: item.price,
          flavor: item.flavor,
          doughType: item.doughType,
        })
      }
    />
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.inner}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Pizza Ruta</Text>
            <Text style={styles.headerSubtitle}>
              Catálogo actualizado desde la API
            </Text>
          </View>
          <View style={styles.searchContainer}>
            <TextInput
              style={styles.searchInput}
              placeholder="Buscar pizzas..."
              placeholderTextColor={COLORS.textMuted}
              value={query}
              onChangeText={setQuery}
              returnKeyType="search"
              clearButtonMode="while-editing"
            />
          </View>
        <FlatList
          data={filteredItems}
          keyExtractor={(item) => String(item.id)}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          // TODO: pull-to-refresh con refetch
          onRefresh={refetch}
          refreshing={isFetching && !isLoading}
          ListEmptyComponent={<Text style={styles.emptyText}>No hay pizzas disponibles.</Text>}
          ListHeaderComponent={
            <Text style={styles.countLabel}>
              {filteredItems.length} pizza{filteredItems.length !== 1 ? 's' : ''}
            </Text>
          }
        />
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

// ============================================================
// ESTILOS
// ============================================================

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  inner: { flex: 1 },
  header: {
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.lg,
    paddingBottom: SPACING.md,
  },
  headerTitle: { ...TYPOGRAPHY.h1 },
  headerSubtitle: { ...TYPOGRAPHY.caption, marginTop: SPACING.xs },
  searchContainer: {
    paddingHorizontal: SPACING.md,
    paddingBottom: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  searchInput: {
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.md,
    paddingVertical: Platform.OS === 'ios' ? 12 : 10,
    color: COLORS.textPrimary,
    fontSize: 16,
  },
  list: { padding: SPACING.md, paddingBottom: SPACING.xl },
  separator: { height: SPACING.sm },
  countLabel: {
    ...TYPOGRAPHY.label,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: SPACING.sm,
  },
  card: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.md,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  image: {
    width: '100%',
    height: 160,
  },
  cardContent: { padding: SPACING.md },
  cardTitle: { ...TYPOGRAPHY.body, fontWeight: '600' },
  cardSubtitle: { ...TYPOGRAPHY.caption },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: SPACING.sm,
  },
  price: { ...TYPOGRAPHY.body, color: COLORS.accent, fontWeight: '600' },
  chevron: { ...TYPOGRAPHY.h2, color: COLORS.textMuted },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.md,
    padding: SPACING.lg,
  },
  loadingText: { ...TYPOGRAPHY.caption },
  errorText: { ...TYPOGRAPHY.h3, color: COLORS.error },
  errorDetail: { ...TYPOGRAPHY.caption, textAlign: 'center' },
  retryButton: {
    backgroundColor: COLORS.accent,
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
  },
  retryButtonText: { ...TYPOGRAPHY.body, color: COLORS.background, fontWeight: '600' },
  emptyText: { ...TYPOGRAPHY.body, color: COLORS.textSecondary, textAlign: 'center' },
  hint: { ...TYPOGRAPHY.caption, textAlign: 'center', color: COLORS.textMuted },
});
