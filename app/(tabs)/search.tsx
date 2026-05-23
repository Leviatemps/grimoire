import React, { useState, useCallback } from 'react';
import { View, Text, TextInput, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useItemsStore } from '../../src/stores/itemsStore';
import { ItemCard } from '../../src/components/ItemCard';
import { EmptyState } from '../../src/components/EmptyState';
import { Item } from '../../src/types';
import { useTheme } from '../../src/theme';

export default function SearchScreen() {
  const insets = useSafeAreaInsets();
  const t = useTheme();
  const { searchItems, items } = useItemsStore();
  const [query,    setQuery]    = useState('');
  const [results,  setResults]  = useState<Item[]>([]);
  const [searched, setSearched] = useState(false);

  const handleSearch = useCallback((text: string) => {
    setQuery(text);
    if (text.trim().length > 1) { setResults(searchItems(text)); setSearched(true); }
    else { setResults([]); setSearched(false); }
  }, [searchItems]);

  return (
    <View style={[styles.screen, { backgroundColor: t.bg }]}>
      <View style={[styles.header, { paddingTop: insets.top + 12, backgroundColor: t.surface, borderBottomColor: t.border }]}>
        <Text style={[styles.title, { color: t.text }]}>Recherche</Text>
        <View style={[styles.searchBar, { backgroundColor: t.searchBg }]}>
          <Ionicons name="search" size={18} color={t.textTertiary} />
          <TextInput
            value={query} onChangeText={handleSearch}
            placeholder="Rechercher dans votre Grimoire…" placeholderTextColor={t.textTertiary}
            style={[styles.searchInput, { color: t.text }]}
            autoFocus returnKeyType="search" clearButtonMode="while-editing"
          />
          {query.length > 0 && (
            <TouchableOpacity onPress={() => handleSearch('')}>
              <Ionicons name="close-circle" size={18} color={t.textTertiary} />
            </TouchableOpacity>
          )}
        </View>
      </View>
      <FlatList
        data={searched ? results : []}
        keyExtractor={(i) => i.id}
        renderItem={({ item }: { item: Item }) => <ItemCard item={item} onPress={() => router.push(`/item/${item.id}`)} />}
        ListEmptyComponent={
          searched ? (
            <EmptyState icon="search-outline" title="Aucun résultat" subtitle={`Aucun contenu ne correspond à "${query}".`} />
          ) : (
            <View style={styles.hint}>
              <Ionicons name="sparkles-outline" size={40} color={t.borderStrong} />
              <Text style={[styles.hintTitle, { color: t.textSecondary }]}>Recherche full-text</Text>
              <Text style={[styles.hintSub, { color: t.textTertiary }]}>
                {items.length} élément{items.length !== 1 ? 's' : ''} dans votre Grimoire
              </Text>
            </View>
          )
        }
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  header: { paddingHorizontal: 16, paddingBottom: 16, borderBottomWidth: 1, gap: 12 },
  title: { fontSize: 24, fontWeight: '800', letterSpacing: -0.5 },
  searchBar: { flexDirection: 'row', alignItems: 'center', borderRadius: 12, paddingHorizontal: 12, height: 44, gap: 8 },
  searchInput: { flex: 1, fontSize: 15 },
  list: { paddingHorizontal: 16, paddingTop: 12, paddingBottom: 100 },
  hint: { alignItems: 'center', paddingTop: 60, gap: 10 },
  hintTitle: { fontSize: 16, fontWeight: '700' },
  hintSub: { fontSize: 13 },
});
