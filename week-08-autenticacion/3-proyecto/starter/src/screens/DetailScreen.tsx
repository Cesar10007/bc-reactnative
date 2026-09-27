import React, { useLayoutEffect } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { useItemById } from '../hooks/useItems';
import type { RootStackParamList } from '../navigation/types';
import { useSavedStore } from '../stores/savedStore';
import { COLORS, RADIUS, SPACING, TYPOGRAPHY } from '../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'Detail'>;

export function DetailScreen({ route, navigation }: Props): React.JSX.Element {
  const routeItem = route.params;
  const { data: currentItem } = useItemById(routeItem.id);
  const item = currentItem ?? routeItem;
  const isSaved = useSavedStore((state) => state.isItemSaved(item.id));
  const addItem = useSavedStore((state) => state.addItem);
  const removeItem = useSavedStore((state) => state.removeItem);

  useLayoutEffect(() => {
    navigation.setOptions({ title: item.name });
  }, [item.name, navigation]);

  function toggleFavorite(): void {
    if (isSaved) removeItem(item.id);
    else addItem(item);
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Image source={{ uri: item.image }} style={styles.heroImage} />
      <Text style={styles.title}>{item.name}</Text>
      <Text style={styles.idBadge}>ID: {item.id}</Text>

      <View style={styles.detailsCard}>
        <Text style={styles.description}>{item.description}</Text>
        <Text style={styles.detail}>Sabor: {item.flavor}</Text>
        <Text style={styles.detail}>Masa: {item.doughType}</Text>
        <Text style={styles.price}>${item.price.toLocaleString('es-CO')}</Text>
      </View>

      <Pressable style={[styles.favoriteButton, isSaved && styles.favoriteActive]} onPress={toggleFavorite}>
        <Text style={[styles.favoriteText, isSaved && styles.favoriteTextActive]}>
          {isSaved ? '♥ Quitar de favoritas' : '♡ Guardar como favorita'}
        </Text>
      </Pressable>

      <Pressable
        style={styles.editButton}
        onPress={() => navigation.navigate('Edit', { id: item.id, name: item.name })}
      >
        <Text style={styles.editText}>Editar pizza</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: SPACING.lg, gap: SPACING.md, paddingBottom: SPACING.xxl },
  heroImage: { width: '100%', height: 220, borderRadius: RADIUS.lg },
  title: { ...TYPOGRAPHY.h2 },
  idBadge: { ...TYPOGRAPHY.label, textTransform: 'uppercase', letterSpacing: 1 },
  detailsCard: { backgroundColor: COLORS.card, borderWidth: 1, borderColor: COLORS.border, borderRadius: RADIUS.md, padding: SPACING.md, gap: SPACING.sm },
  description: { ...TYPOGRAPHY.body, color: COLORS.textSecondary, marginBottom: SPACING.sm },
  detail: { ...TYPOGRAPHY.body, color: COLORS.textSecondary },
  price: { ...TYPOGRAPHY.h3, color: COLORS.accent },
  favoriteButton: { borderWidth: 1, borderColor: COLORS.accent, borderRadius: RADIUS.md, padding: SPACING.md, alignItems: 'center' },
  favoriteActive: { backgroundColor: COLORS.accent },
  favoriteText: { ...TYPOGRAPHY.body, color: COLORS.accent, fontWeight: '700' },
  favoriteTextActive: { color: COLORS.background },
  editButton: { backgroundColor: COLORS.surface, borderRadius: RADIUS.md, padding: SPACING.md, alignItems: 'center' },
  editText: { ...TYPOGRAPHY.body, fontWeight: '700' },
});
