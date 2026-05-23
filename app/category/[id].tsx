import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useCategoriesStore } from '../../src/stores/categoriesStore';
import { useItemsStore } from '../../src/stores/itemsStore';
import { ItemCard } from '../../src/components/ItemCard';
import { FilterBar } from '../../src/components/FilterBar';
import { EmptyState } from '../../src/components/EmptyState';
import { FilterType, Item } from '../../src/types';

export default function CategoryDetailScreen() {
  const insets = useSafeAreaInsets();
  const { id }  = useLocalSearchParams<{ id: string }>();
  const { getCategoryById, getSubcategoriesByCategoryId, deleteSubcategory } = useCategoriesStore();
  const { items } = useItemsStore();

  const [filter, setFilter]  = useState<FilterType>('all');
  const [selectedSub, setSelectedSub] = useState<string | null>(null);

  const category = getCategoryById(id);
  const subs     = getSubcategoriesByCategoryId(id);

  if (!category) {
    return (
      <View style={styles.screen}>
        <EmptyState title="Catégorie introuvable" />
      </View>
    );
  }

  let filtered = items.filter((i) => i.categoryId === id);
  if (selectedSub)        filtered = filtered.filter((i) => i.subcategoryId === selectedSub);
  if (filter !== 'all')   filtered = filtered.filter((i) => i.type === filter);

  const ListHeader = (
    <View>
      {/* Category hero */}
      <View style={[styles.hero, { paddingTop: insets.top + 8 }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.back}>
          <Ionicons name="chevron-back" size={22} color="#111827" />
        </TouchableOpacity>
        <View style={[styles.iconBubble, { backgroundColor: `${category.color}20` }]}>
          <Text style={styles.icon}>{category.icon}</Text>
        </View>
        <Text style={styles.categoryName}>{category.name}</Text>
        <Text style={styles.count}>{filtered.length} élément{filtered.length !== 1 ? 's' : ''}</Text>
        <TouchableOpacity
          onPress={() => router.push({ pathname: '/category/create', params: { parentId: id } })}
          style={[styles.addSubBtn, { borderColor: category.color }]}
        >
          <Ionicons name="add" size={16} color={category.color} />
          <Text style={[styles.addSubLabel, { color: category.color }]}>Sous-catégorie</Text>
        </TouchableOpacity>
      </View>

      {/* Subcategories */}
      {subs.length > 0 && (
        <View style={styles.subsRow}>
          <TouchableOpacity
            onPress={() => setSelectedSub(null)}
            style={[styles.subChip, !selectedSub && { backgroundColor: category.color }]}
          >
            <Text style={[styles.subChipLabel, !selectedSub && { color: '#fff' }]}>Tout</Text>
          </TouchableOpacity>
          {subs.map((s) => (
            <TouchableOpacity
              key={s.id}
              onPress={() => setSelectedSub(selectedSub === s.id ? null : s.id)}
              onLongPress={() =>
                Alert.alert('Supprimer', `Supprimer "${s.name}" ?`, [
                  { text: 'Annuler', style: 'cancel' },
                  { text: 'Supprimer', style: 'destructive', onPress: () => deleteSubcategory(s.id) },
                ])
              }
              style={[
                styles.subChip,
                selectedSub === s.id && { backgroundColor: category.color },
                { borderColor: category.color, borderWidth: 1 },
              ]}
            >
              <Text
                style={[
                  styles.subChipLabel,
                  { color: selectedSub === s.id ? '#fff' : category.color },
                ]}
              >
                {s.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Filters */}
      <FilterBar current={filter} onChange={setFilter} />
    </View>
  );

  return (
    <View style={styles.screen}>
      <FlatList
        data={filtered}
        keyExtractor={(i) => i.id}
        renderItem={({ item }: { item: Item }) => (
          <ItemCard item={item} onPress={() => router.push(`/item/${item.id}`)} />
        )}
        ListHeaderComponent={ListHeader}
        ListEmptyComponent={
          <EmptyState
            icon="tray-outline"
            title="Aucun contenu"
            subtitle="Ajoutez des éléments à cette catégorie via le bouton +."
          />
        }
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#f8f9fb' },
  hero: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f3f6',
    gap: 8,
  },
  back: {
    alignSelf: 'flex-start',
    padding: 4,
  },
  iconBubble: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: { fontSize: 32 },
  categoryName: {
    fontSize: 22,
    fontWeight: '800',
    color: '#111827',
  },
  count: {
    fontSize: 13,
    color: '#9ca3af',
  },
  addSubBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
    marginTop: 4,
  },
  addSubLabel: {
    fontSize: 13,
    fontWeight: '600',
  },
  subsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    padding: 16,
    backgroundColor: '#fff',
  },
  subChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: '#f3f4f6',
  },
  subChipLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6b7280',
  },
  list: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 100,
    gap: 0,
  },
});
