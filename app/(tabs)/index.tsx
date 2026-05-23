import React, { useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, ScrollView, RefreshControl, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useItemsStore } from '../../src/stores/itemsStore';
import { useCategoriesStore } from '../../src/stores/categoriesStore';
import { AnimatedItemCard } from '../../src/components/AnimatedItemCard';
import { FilterBar } from '../../src/components/FilterBar';
import { CategoryChip } from '../../src/components/CategoryChip';
import { EmptyState } from '../../src/components/EmptyState';
import { Item, FilterType } from '../../src/types';
import { useTheme } from '../../src/theme';

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const t = useTheme();
  const { filter, setFilter, filteredItems, loadItems, selectedCategoryId, setSelectedCategory, isLoading } = useItemsStore();
  const { categories } = useCategoriesStore();
  const items = filteredItems();

  const onRefresh = useCallback(() => { loadItems(); }, [loadItems]);

  const renderItem = useCallback(
    ({ item, index }: { item: Item; index: number }) => (
      <AnimatedItemCard item={item} index={index} onPress={() => router.push(`/item/${item.id}`)} />
    ), []
  );

  const ListHeader = (
    <View>
      <View style={[styles.header, { paddingTop: insets.top + 12, backgroundColor: t.surface, borderBottomColor: t.border }]}>
        <View>
          <Text style={[styles.greeting, { color: t.textTertiary }]}>Bonjour 👋</Text>
          <Text style={[styles.title, { color: t.text }]}>Votre Grimoire</Text>
        </View>
        <TouchableOpacity onPress={() => router.push('/search')} style={[styles.searchButton, { backgroundColor: `${t.primary}18` }]}>
          <Ionicons name="search" size={20} color={t.primary} />
        </TouchableOpacity>
      </View>

      {categories.length > 0 && (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={[styles.chips, { backgroundColor: t.surface }]}>
          <TouchableOpacity onPress={() => setSelectedCategory(null)} activeOpacity={0.75}
            style={[styles.allChip, { backgroundColor: selectedCategoryId ? t.surfaceAlt : t.primary }]}>
            <Ionicons name="apps" size={14} color={selectedCategoryId ? t.textTertiary : '#fff'} />
            <Text style={[styles.allChipLabel, { color: selectedCategoryId ? t.textTertiary : '#fff' }]}>Tout</Text>
          </TouchableOpacity>
          {categories.map((cat) => (
            <CategoryChip key={cat.id} category={cat} selected={selectedCategoryId === cat.id}
              onPress={() => setSelectedCategory(selectedCategoryId === cat.id ? null : cat.id)} />
          ))}
        </ScrollView>
      )}

      <FilterBar current={filter} onChange={(f: FilterType) => setFilter(f)} />

      <View style={styles.countRow}>
        <Text style={[styles.count, { color: t.textTertiary }]}>
          {items.length} {items.length === 1 ? 'élément' : 'éléments'}
        </Text>
      </View>
    </View>
  );

  return (
    <View style={[styles.screen, { backgroundColor: t.bg }]}>
      <FlatList
        data={items} keyExtractor={(item) => item.id} renderItem={renderItem}
        ListHeaderComponent={ListHeader}
        ListEmptyComponent={<EmptyState icon="bookmark-outline" title="Votre grimoire est vide" subtitle={'Appuyez sur + pour ajouter\nvotre premier souvenir.'} />}
        contentContainerStyle={styles.list} showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={isLoading} onRefresh={onRefresh} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingBottom: 16, borderBottomWidth: 1 },
  greeting: { fontSize: 13, fontWeight: '500' },
  title: { fontSize: 24, fontWeight: '800', letterSpacing: -0.5 },
  searchButton: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  chips: { paddingHorizontal: 16, paddingVertical: 12, flexDirection: 'row', gap: 0 },
  allChip: { flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 13, paddingVertical: 7, borderRadius: 20, marginRight: 8 },
  allChipLabel: { fontSize: 13, fontWeight: '600' },
  countRow: { paddingHorizontal: 16, paddingTop: 4, paddingBottom: 4 },
  count: { fontSize: 12, fontWeight: '500' },
  list: { paddingHorizontal: 16, paddingTop: 8, paddingBottom: 100 },
});
