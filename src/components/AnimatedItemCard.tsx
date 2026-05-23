import React, { useEffect, useRef } from 'react';
import { Animated, Easing } from 'react-native';
import { ItemCard } from './ItemCard';
import { Item } from '../types';

interface AnimatedItemCardProps {
  item: Item;
  index: number;
  onPress: () => void;
  onLongPress?: () => void;
}

export function AnimatedItemCard({ item, index, onPress, onLongPress }: AnimatedItemCardProps) {
  const opacity    = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    const delay = Math.min(index * 60, 300);
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 280,
        delay,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 280,
        delay,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <Animated.View style={{ opacity, transform: [{ translateY }] }}>
      <ItemCard item={item} onPress={onPress} onLongPress={onLongPress} />
    </Animated.View>
  );
}
