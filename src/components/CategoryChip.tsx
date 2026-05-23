import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Category } from '../types';

interface CategoryChipProps { category: Category; selected: boolean; onPress: () => void; }

export function CategoryChip({ category, selected, onPress }: CategoryChipProps) {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.75}
      style={[styles.chip, { backgroundColor: selected ? category.color : `${category.color}18`, marginRight: 8 }]}>
      <Text style={styles.icon}>{category.icon}</Text>
      <Text style={[styles.label, { color: selected ? '#fff' : category.color }]}>{category.name}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  chip: { flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 12, paddingVertical: 7, borderRadius: 20 },
  icon: { fontSize: 13 },
  label: { fontSize: 13, fontWeight: '600' },
});
