import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useCategoriesStore } from '../stores/categoriesStore';

interface CategoryPickerProps {
  categoryId: string;
  subcategoryId: string;
  onCategoryChange: (id: string) => void;
  onSubcategoryChange: (id: string) => void;
}

export function CategoryPicker({
  categoryId,
  subcategoryId,
  onCategoryChange,
  onSubcategoryChange,
}: CategoryPickerProps) {
  const { categories, getSubcategoriesByCategoryId } = useCategoriesStore();
  const subs = categoryId ? getSubcategoriesByCategoryId(categoryId) : [];

  if (categories.length === 0) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Catégorie</Text>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scroll}>
        <View style={styles.row}>
          <TouchableOpacity
            onPress={() => onCategoryChange('')}
            style={[styles.chip, !categoryId && styles.chipActive]}
          >
            <Text style={[styles.chipLabel, !categoryId && styles.chipLabelActive]}>
              Aucune
            </Text>
          </TouchableOpacity>
          {categories.map((cat) => (
            <TouchableOpacity
              key={cat.id}
              onPress={() => onCategoryChange(cat.id)}
              style={[
                styles.chip,
                categoryId === cat.id && { backgroundColor: cat.color, borderColor: cat.color },
              ]}
            >
              <Text style={styles.chipEmoji}>{cat.icon}</Text>
              <Text
                style={[
                  styles.chipLabel,
                  categoryId === cat.id && styles.chipLabelActive,
                ]}
              >
                {cat.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Subcategories */}
      {subs.length > 0 && (
        <>
          <Text style={[styles.label, { marginTop: 12 }]}>Sous-catégorie</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.row}>
              <TouchableOpacity
                onPress={() => onSubcategoryChange('')}
                style={[styles.chip, !subcategoryId && styles.chipActive]}
              >
                <Text style={[styles.chipLabel, !subcategoryId && styles.chipLabelActive]}>
                  Aucune
                </Text>
              </TouchableOpacity>
              {subs.map((s) => {
                const cat = categories.find((c) => c.id === categoryId);
                const active = subcategoryId === s.id;
                return (
                  <TouchableOpacity
                    key={s.id}
                    onPress={() => onSubcategoryChange(s.id)}
                    style={[
                      styles.chip,
                      active && { backgroundColor: cat?.color ?? '#6366f1', borderColor: cat?.color ?? '#6366f1' },
                    ]}
                  >
                    <Text style={[styles.chipLabel, active && styles.chipLabelActive]}>
                      {s.name}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </ScrollView>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 8 },
  label: {
    fontSize: 13,
    fontWeight: '700',
    color: '#374151',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  scroll: {},
  row: {
    flexDirection: 'row',
    gap: 8,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 13,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    backgroundColor: '#fff',
  },
  chipActive: {
    backgroundColor: '#6366f1',
    borderColor: '#6366f1',
  },
  chipEmoji: { fontSize: 13 },
  chipLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#374151',
  },
  chipLabelActive: {
    color: '#fff',
  },
});
