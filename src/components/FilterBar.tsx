import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { FilterType } from '../types';

interface FilterBarProps {
  current: FilterType;
  onChange: (f: FilterType) => void;
}

const FILTERS: { key: FilterType; label: string; icon: string; color: string }[] = [
  { key: 'all',   label: 'Tout',   icon: 'grid-outline',         color: '#6b7280' },
  { key: 'link',  label: 'Liens',  icon: 'link-outline',         color: '#6366f1' },
  { key: 'photo', label: 'Photos', icon: 'image-outline',        color: '#ec4899' },
  { key: 'note',  label: 'Notes',  icon: 'document-text-outline', color: '#f97316' },
];

export function FilterBar({ current, onChange }: FilterBarProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {FILTERS.map((f) => {
        const active = current === f.key;
        return (
          <TouchableOpacity
            key={f.key}
            onPress={() => onChange(f.key)}
            activeOpacity={0.75}
            style={[
              styles.pill,
              {
                backgroundColor: active ? f.color : `${f.color}12`,
                borderColor: f.color,
                borderWidth: active ? 0 : 1,
              },
            ]}
          >
            <Ionicons name={f.icon as any} size={14} color={active ? '#fff' : f.color} />
            <Text style={[styles.label, { color: active ? '#fff' : f.color }]}>
              {f.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 8,
    flexDirection: 'row',
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 13,
    paddingVertical: 7,
    borderRadius: 20,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
  },
});
