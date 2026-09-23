// ============================================================
// COMPONENT: ItemCard
// ============================================================
// Tarjeta reutilizable para mostrar un elemento del dominio.
// Este componente se renderiza por cada item en HomeScreen.
// ============================================================

import React from 'react';
import { View, Text, Image, StyleSheet, Pressable } from 'react-native';
import { PizzaMenuItem } from '../types/PizzaMenuItem';

interface Props {
  item: PizzaMenuItem;
  onPress: (item: PizzaMenuItem) => void;
}

export function ItemCard({ item, onPress }: Props): React.JSX.Element {
  return (
    <Pressable
      onPress={() => onPress(item)}
      style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
    >
      <Image source={{ uri: item.imagen }} style={styles.image} />
      <View style={styles.info}>
        <Text style={styles.name}>{item.nombre}</Text>
        <Text style={styles.flavor}>{item.sabor}</Text>
        <View style={styles.footer}>
          <Text style={styles.dough}>{item.tipoMasa}</Text>
          <Text style={styles.price}>${item.precio.toLocaleString('es-CO')}</Text>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#161b22',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#30363d',
  },
  cardPressed: {
    opacity: 0.6,
    borderColor: '#58a6ff',
  },
  image: { width: '100%', height: 160 },
  info: { padding: 12, gap: 4 },
  name: { fontSize: 18, fontWeight: 'bold', color: '#ffffff' },
  flavor: { fontSize: 14, color: '#8b949e' },
  footer: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 },
  dough: { fontSize: 13, color: '#8b949e', textTransform: 'capitalize' },
  price: { fontSize: 16, fontWeight: '600', color: '#58a6ff' },
});