import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useItemsStore } from '../../src/stores/itemsStore';
import { ItemCard } from '../../src/components/ItemCard';
import { EmptyState } from '../../src/components/EmptyState';
import { Item } from '../../src/types';

export default function SearchScreen() {
  const insets = useSafeAreaInsets();
  const { searchItems, items } = useItemsStore();

  const [query,   setQuery]   = useState('');
  const [results, setResults] = useState<Item[]>([]);
  const [searched, setSearched] = useState(false);

  const handleSearch = useCallback(
    (text: string) => {
      setQuery(text);
      if (text.trim().length > 1) {
        setResults(searchItems(text));
        setSearched(true);
      } else {
        setResults([]);
        setSearched(false);
      }
    },
    [searchItems]
  );

  return (
    <View style={styles.screen}>
      {/* Search header */}
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <Text style={styles.title}>Recherche</Text>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={18} color="#9ca3af" style={styles.searchIcon} />
          <TextInput
            value={query}
            onChangeText={handleSearch}
            placeholder="Rechercher dans votre Grimoire…"
            placeholderTextColor="#9ca3af"
            style={styles.searchInput}
            autoFocus
            returnKeyType="search"
            clearButtonMode="while-editing"
          />
          {query.length > 0 && (
            <TouchableOpacity onPress={() => handleSearch('')}>
              <Ionicons name="close-circle" size={18} color="#9ca3af" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Results */}
      <FlatList
        data={searched ? results : []}
        keyExtractor={(i) => i.id}
        renderItem={({ item }: { item: Item }) => (
          <ItemCard item={item} onPress={() => router.push(`/item/${item.id}`)} />
        )}
        ListEmptyComponent={
          searched ? (
            <EmptyState
              icon="search-outline"
              title="Aucun résultat"
              subtitle={`Aucun contenu ne correspond à "${query}".`}
            />
          ) : (
            <View style={styles.hint}>
              <Ionicons name="sparkles-outline" size={40} color="#e5e7eb" />
              <Text style={styles.hintTitle}>Recherche full-text</Text>
              <Text style={styles.hintSub}>
                {items.length} élément{items.length !== 1 ? 's' : ''} dans votre Grimoire
              </Text>
            </View>
          )
        }
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#f8f9fb' },
  header: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f3f6',
    gap: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#111827',
    letterSpacing: -0.5,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 44,
    gap: 8,
  },
  searchIcon: {},
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: '#111827',
  },
  list: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 100,
  },
  hint: {
    alignItems: 'center',
    paddingTop: 60,
    gap: 10,
  },
  hintTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#374151',
  },
  hintSub: {
    fontSize: 13,
    color: '#9ca3af',
  },
});
