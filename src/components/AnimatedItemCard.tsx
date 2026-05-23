import React, { useEffect } from 'react';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  Easing,
} from 'react-native-reanimated';
import { ItemCard } from './ItemCard';
import { Item } from '../types';

interface AnimatedItemCardProps {
  item: Item;
  index: number;
  onPress: () => void;
  onLongPress?: () => void;
}

export function AnimatedItemCard({ item, index, onPress, onLongPress }: AnimatedItemCardProps) {
  const opacity     = useSharedValue(0);
  const translateY  = useSharedValue(20);

  useEffect(() => {
    const delay = Math.min(index * 60, 300); // cap at 300ms
    opacity.value    = withDelay(delay, withTiming(1,  { duration: 280, easing: Easing.out(Easing.quad) }));
    translateY.value = withDelay(delay, withTiming(0,  { duration: 280, easing: Easing.out(Easing.quad) }));
  }, []);

  const animStyle = useAnimatedStyle(() => ({
    opacity:   opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <Animated.View style={animStyle}>
      <ItemCard item={item} onPress={onPress} onLongPress={onLongPress} />
    </Animated.View>
  );
}
