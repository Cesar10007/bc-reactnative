import React, { useRef } from 'react';
import { Animated, Pressable, type StyleProp, type ViewStyle } from 'react-native';

interface AnimatedCardProps {
  children: React.ReactNode;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
}

export function AnimatedCard({ children, onPress, style }: AnimatedCardProps): React.JSX.Element {
  const scale = useRef(new Animated.Value(1)).current;

  function animate(toValue: number): void {
    Animated.spring(scale, {
      toValue,
      tension: toValue < 1 ? 420 : 300,
      friction: toValue < 1 ? 18 : 10,
      useNativeDriver: true,
    }).start();
  }

  return (
    <Animated.View style={[style, { transform: [{ scale }] }]}>
      <Pressable
        onPress={onPress}
        onPressIn={() => animate(0.95)}
        onPressOut={() => animate(1)}
        accessibilityRole="button"
      >
        {children}
      </Pressable>
    </Animated.View>
  );
}
