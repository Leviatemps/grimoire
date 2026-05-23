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
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useCategoriesStore } from '../../src/stores/categoriesStore';
import { useItemsStore } from '../../src/stores/itemsStore';
import { EmptyState } from '../../src/components/EmptyState';
import { Category } from '../../src/types';

function CategoryRow({ category }: { category: Category }) {
  const { deleteCategory, getSubcategoriesByCategoryId } = useCategoriesStore();
  const { items } = useItemsStore();
  const subs  = getSubcategoriesByCategoryId(category.id);
  const count = items.filter((i) => i.categoryId === category.id).length;

  const handleDelete = () => {
    Alert.alert(
      'Supprimer la catégorie',
      `Supprimer "${category.name}" ? Les contenus associés ne seront pas supprimés.`,
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: () => deleteCategory(category.id),
        },
      ]
    );
  };

  return (
    <TouchableOpacity
      onPress={() => router.push(`/category/${category.id}`)}
      activeOpacity={0.85}
      style={styles.row}
    >
      {/* Color dot + icon */}
      <View style={[styles.iconBubble, { backgroundColor: `${category.color}20` }]}>
        <Text style={styles.iconEmoji}>{category.icon}</Text>
      </View>

      {/* Info */}
      <View style={styles.info}>
        <Text style={styles.categoryName}>{category.name}</Text>
        <Text style={styles.meta}>
          {count} élément{count !== 1 ? 's' : ''}
          {subs.length > 0 ? ` · ${subs.length} sous-catégorie${subs.length > 1 ? 's' : ''}` : ''}
        </Text>
      </View>

      {/* Color bar + chevron */}
      <View style={styles.right}>
        <View style={[styles.colorBar, { backgroundColor: category.color }]} />
        <TouchableOpacity onPress={handleDelete} style={styles.deleteBtn} hitSlop={8}>
          <Ionicons name="trash-outline" size={17} color="#ef4444" />
        </TouchableOpacity>
        <Ionicons name="chevron-forward" size={18} color="#d1d5db" />
      </View>
    </TouchableOpacity>
  );
}

export default function CategoriesScreen() {
  const insets     = useSafeAreaInsets();
  const { categories } = useCategoriesStore();

  return (
    <View style={styles.screen}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <Text style={styles.title}>Catégories</Text>
        <TouchableOpacity
          onPress={() => router.push('/category/create')}
          style={styles.addBtn}
        >
          <Ionicons name="add" size={22} color="#fff" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={categories}
        keyExtractor={(c) => c.id}
        renderItem={({ item }) => <CategoryRow category={item} />}
        ListEmptyComponent={
          <EmptyState
            icon="folder-open-outline"
            title="Aucune catégorie"
            subtitle={'Créez des catégories pour organiser\nvos contenus facilement.'}
          />
        }
        contentContainerStyle={styles.list}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#f8f9fb',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f3f6',
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#111827',
    letterSpacing: -0.5,
  },
  addBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#6366f1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  list: {
    padding: 16,
    paddingBottom: 100,
    gap: 0,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 14,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  iconBubble: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconEmoji: {
    fontSize: 22,
  },
  info: {
    flex: 1,
    gap: 3,
  },
  categoryName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
  },
  meta: {
    fontSize: 12,
    color: '#9ca3af',
  },
  right: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  colorBar: {
    width: 4,
    height: 24,
    borderRadius: 2,
  },
  deleteBtn: {
    padding: 4,
  },
  separator: {
    height: 8,
  },
});
