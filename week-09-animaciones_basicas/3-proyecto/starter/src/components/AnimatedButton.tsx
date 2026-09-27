import React, { useRef } from 'react';
import { Animated, Pressable, StyleSheet, Text } from 'react-native';
import { COLORS, RADIUS, SPACING, TYPOGRAPHY } from '../theme';

interface Props { label: string; onPress: () => void; danger?: boolean }

export function AnimatedButton({ label, onPress, danger = false }: Props): React.JSX.Element {
  const scale = useRef(new Animated.Value(1)).current;
  const opacity = useRef(new Animated.Value(1)).current;

  function pressIn(): void {
    Animated.parallel([
      Animated.timing(scale, { toValue: 0.96, duration: 80, useNativeDriver: true }),
      Animated.timing(opacity, { toValue: 0.75, duration: 80, useNativeDriver: true }),
    ]).start();
  }

  function pressOut(): void {
    Animated.sequence([
      Animated.spring(scale, { toValue: 1.03, tension: 400, friction: 12, useNativeDriver: true }),
      Animated.spring(scale, { toValue: 1, tension: 300, friction: 12, useNativeDriver: true }),
    ]).start();
    Animated.timing(opacity, { toValue: 1, duration: 120, useNativeDriver: true }).start();
  }

  return (
    <Animated.View style={{ opacity, transform: [{ scale }] }}>
      <Pressable
        style={[styles.button, danger && styles.danger]}
        onPress={onPress}
        onPressIn={pressIn}
        onPressOut={pressOut}
      >
        <Text style={[styles.text, danger && styles.dangerText]}>{label}</Text>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  button: { backgroundColor: COLORS.accent, borderRadius: RADIUS.sm, paddingHorizontal: SPACING.md, paddingVertical: SPACING.sm, alignItems: 'center' },
  danger: { backgroundColor: COLORS.surface, borderWidth: 1, borderColor: COLORS.error },
  text: { ...TYPOGRAPHY.body, color: COLORS.background, fontWeight: '700' },
  dangerText: { color: COLORS.error },
});
