import React, { useEffect, useLayoutEffect, useRef } from 'react';
import { Animated, Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { AnimatedButton } from '../components/AnimatedButton';
import { ProgressBar } from '../components/ProgressBar';
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
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(30)).current;

  useLayoutEffect(() => { navigation.setOptions({ title: item.name }); }, [item.name, navigation]);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, { toValue: 1, duration: 500, useNativeDriver: true }),
      Animated.timing(translateY, { toValue: 0, duration: 500, useNativeDriver: true }),
    ]).start();
  }, [opacity, translateY]);

  function toggleFavorite(): void {
    if (isSaved) removeItem(item.id);
    else addItem(item);
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Animated.View style={{ opacity, transform: [{ translateY }] }}>
        <Image source={{ uri: item.image }} style={styles.heroImage} />
        <Text style={styles.title}>{item.name}</Text>
        <Text style={styles.idBadge}>ID: {item.id}</Text>

        <View style={styles.detailsCard}>
          <Text style={styles.description}>{item.description}</Text>
          <Text style={styles.detail}>Sabor: {item.flavor}</Text>
          <Text style={styles.detail}>Masa: {item.doughType}</Text>
          <Text style={styles.price}>${item.price.toLocaleString('es-CO')}</Text>
          <ProgressBar progress={Math.min(item.price / 50000, 1)} label="Nivel de precio" />
        </View>

        <View style={styles.actions}>
          <AnimatedButton label={isSaved ? '♥ Quitar de favoritas' : '♡ Guardar como favorita'} onPress={toggleFavorite} />
          <AnimatedButton label="Editar pizza" onPress={() => navigation.navigate('Edit', { id: item.id, name: item.name })} />
        </View>
      </Animated.View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: SPACING.lg, paddingBottom: SPACING.xxl },
  heroImage: { width: '100%', height: 220, borderRadius: RADIUS.lg, marginBottom: SPACING.md },
  title: { ...TYPOGRAPHY.h2 },
  idBadge: { ...TYPOGRAPHY.label, textTransform: 'uppercase', letterSpacing: 1, marginVertical: SPACING.sm },
  detailsCard: { backgroundColor: COLORS.card, borderWidth: 1, borderColor: COLORS.border, borderRadius: RADIUS.md, padding: SPACING.md, gap: SPACING.sm },
  description: { ...TYPOGRAPHY.body, color: COLORS.textSecondary, marginBottom: SPACING.sm },
  detail: { ...TYPOGRAPHY.body, color: COLORS.textSecondary },
  price: { ...TYPOGRAPHY.h3, color: COLORS.accent },
  actions: { gap: SPACING.sm, marginTop: SPACING.md },
});
