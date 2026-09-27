import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import { COLORS, RADIUS, SPACING, TYPOGRAPHY } from '../theme';

interface Props { progress: number; label: string }

export function ProgressBar({ progress, label }: Props): React.JSX.Element {
  const value = Math.max(0, Math.min(1, progress));
  const animated = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(animated, {
      toValue: value,
      duration: 800,
      // Width and color are layout/style properties unsupported by the native driver.
      useNativeDriver: false,
    }).start();
  }, [animated, value]);

  const width = animated.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'], extrapolate: 'clamp' });
  const backgroundColor = animated.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [COLORS.error, COLORS.warning, COLORS.success],
    extrapolate: 'clamp',
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.percentage}>{Math.round(value * 100)}%</Text>
      </View>
      <View style={styles.track}>
        <Animated.View style={[styles.fill, { width, backgroundColor }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: SPACING.xs },
  header: { flexDirection: 'row', justifyContent: 'space-between' },
  label: { ...TYPOGRAPHY.caption },
  percentage: { ...TYPOGRAPHY.caption, fontWeight: '700' },
  track: { height: 10, backgroundColor: COLORS.surfaceHigh, borderRadius: RADIUS.full, overflow: 'hidden' },
  fill: { height: 10, borderRadius: RADIUS.full },
});
