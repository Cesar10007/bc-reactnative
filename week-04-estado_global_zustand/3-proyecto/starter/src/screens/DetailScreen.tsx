// src/screens/DetailScreen.tsx
// Pantalla de detalle: muestra la información completa de un ítem
// y permite guardarlo / quitarlo usando el store de Zustand.
// Esta pantalla demuestra cómo acceder al store desde cualquier screen.

import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { useRoute, type RouteProp } from '@react-navigation/native';

import { ITEMS } from '../data/mockData';
import { useSavedStore } from '../stores/savedStore';
import { COLORS, RADIUS, SPACING, TYPOGRAPHY } from '../theme';
import type { HomeStackParamList } from '../navigation/types';

type DetailRouteProp = RouteProp<HomeStackParamList, 'HomeDetail'>;

// ============================================================
// PANTALLA: DetailScreen
// ============================================================

export function DetailScreen(): React.JSX.Element {
  const route = useRoute<DetailRouteProp>();
  const { id, name, image, price, flavor, doughType } = route.params;
  const item = ITEMS.find((currentItem) => currentItem.id === id);
  const isItemSaved = useSavedStore((state) => state.isItemSaved);
  const addItem = useSavedStore((state) => state.addItem);
  const removeItem = useSavedStore((state) => state.removeItem);
  const isSaved = isItemSaved(id);

  const handleToggleSave = (): void => {
    if (isSaved) {
      removeItem(id);
      return;
    }

    if (item) {
      addItem(item);
    }
  };

  return (
    <View style={styles.container}>
      <Image source={{ uri: image }} style={styles.heroImage} />

      {/* Información principal */}
      <View style={styles.info}>
        <Text style={styles.title}>{name}</Text>
        <Text style={styles.id}>ID: {id}</Text>
        <Text style={styles.description}>{item?.description}</Text>
        <Text style={styles.detail}>Sabor: {flavor}</Text>
        <Text style={styles.detail}>Masa: {doughType}</Text>
        <Text style={styles.detail}>Precio: ${price.toLocaleString('es-CO')}</Text>
      </View>

      {/* ──────────────────────────────────────────────────── */}
      {/* BOTÓN GUARDAR / QUITAR — conectado al store Zustand  */}
      {/* ──────────────────────────────────────────────────── */}
      {/* Este botón demuestra el estado compartido entre pantallas:
          al guardar aquí, el badge del Tab "Guardados" se actualiza
          automáticamente sin necesidad de pasar props ni callbacks. */}
      <Pressable
        style={({ pressed }) => [
          styles.saveButton,
          isSaved && styles.saveButtonActive,
          pressed && styles.saveButtonPressed,
        ]}
        onPress={handleToggleSave}
        testID="save-button"
        accessibilityRole="button"
        accessibilityLabel={
          isSaved ? `Quitar ${name} de guardados` : `Guardar ${name}`
        }
      >
        <Text
          style={[
            styles.saveButtonText,
            isSaved && styles.saveButtonTextActive,
          ]}
        >
          {isSaved ? '★ Guardado' : '☆ Guardar'}
        </Text>
      </Pressable>
    </View>
  );
}

// ============================================================
// ESTILOS
// ============================================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: SPACING.lg,
    gap: SPACING.lg,
  },
  heroImage: {
    width: '100%',
    height: 220,
    borderRadius: RADIUS.lg,
  },
  info: {
    gap: SPACING.sm,
  },
  title: {
    ...TYPOGRAPHY.h2,
  },
  id: {
    ...TYPOGRAPHY.label,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  description: {
    ...TYPOGRAPHY.body,
    color: COLORS.textSecondary,
    lineHeight: 24,
    marginTop: SPACING.sm,
  },
  detail: {
    ...TYPOGRAPHY.body,
    color: COLORS.textSecondary,
  },
  saveButton: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingVertical: SPACING.md,
    alignItems: 'center',
    marginTop: 'auto',
  },
  saveButtonActive: {
    backgroundColor: COLORS.accent,
    borderColor: COLORS.accent,
  },
  saveButtonPressed: {
    opacity: 0.7,
  },
  saveButtonText: {
    ...TYPOGRAPHY.body,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  saveButtonTextActive: {
    color: COLORS.background,
  },
});
