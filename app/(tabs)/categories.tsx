import React from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useCategoriesStore } from '../../src/stores/categoriesStore';
import { useItemsStore } from '../../src/stores/itemsStore';
import { EmptyState } from '../../src/components/EmptyState';
import { Category } from '../../src/types';
import { useTheme } from '../../src/theme';

function CategoryRow({ category }: { category: Category }) {
  const t = useTheme();
  const { deleteCategory, getSubcategoriesByCategoryId } = useCategoriesStore();
  const { items } = useItemsStore();
  const subs  = getSubcategoriesByCategoryId(category.id);
  const count = items.filter((i) => i.categoryId === category.id).length;

  const handleDelete = () => {
    Alert.alert('Supprimer la catégorie', `Supprimer "${category.name}" ? Les contenus associés ne seront pas supprimés.`, [
      { text: 'Annuler', style: 'cancel' },
      { text: 'Supprimer', style: 'destructive', onPress: () => deleteCategory(category.id) },
    ]);
  };

  return (
    <TouchableOpacity onPress={() => router.push(`/category/${category.id}`)} activeOpacity={0.85}
      style={[styles.row, { backgroundColor: t.surface }]}>
      <View style={[styles.iconBubble, { backgroundColor: `${category.color}20` }]}>
        <Text style={styles.iconEmoji}>{category.icon}</Text>
      </View>
      <View style={styles.info}>
        <Text style={[styles.categoryName, { color: t.text }]}>{category.name}</Text>
        <Text style={[styles.meta, { color: t.textTertiary }]}>
          {count} élément{count !== 1 ? 's' : ''}
          {subs.length > 0 ? ` · ${subs.length} sous-catégorie${subs.length > 1 ? 's' : ''}` : ''}
        </Text>
      </View>
      <View style={styles.right}>
        <View style={[styles.colorBar, { backgroundColor: category.color }]} />
        <TouchableOpacity onPress={handleDelete} style={styles.deleteBtn} hitSlop={8}>
          <Ionicons name="trash-outline" size={17} color="#ef4444" />
        </TouchableOpacity>
        <Ionicons name="chevron-forward" size={18} color={t.textTertiary} />
      </View>
    </TouchableOpacity>
  );
}

export default function CategoriesScreen() {
  const insets = useSafeAreaInsets();
  const t = useTheme();
  const { categories } = useCategoriesStore();

  return (
    <View style={[styles.screen, { backgroundColor: t.bg }]}>
      <View style={[styles.header, { paddingTop: insets.top + 12, backgroundColor: t.surface, borderBottomColor: t.border }]}>
        <Text style={[styles.title, { color: t.text }]}>Catégories</Text>
        <TouchableOpacity onPress={() => router.push('/category/create')} style={[styles.addBtn, { backgroundColor: t.primary }]}>
          <Ionicons name="add" size={22} color="#fff" />
        </TouchableOpacity>
      </View>
      <FlatList
        data={categories} keyExtractor={(c) => c.id}
        renderItem={({ item }) => <CategoryRow category={item} />}
        ListEmptyComponent={<EmptyState icon="folder-open-outline" title="Aucune catégorie" subtitle={'Créez des catégories pour organiser\nvos contenus facilement.'} />}
        contentContainerStyle={styles.list}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingBottom: 16, borderBottomWidth: 1 },
  title: { fontSize: 24, fontWeight: '800', letterSpacing: -0.5 },
  addBtn: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  list: { padding: 16, paddingBottom: 100 },
  row: { flexDirection: 'row', alignItems: 'center', borderRadius: 14, padding: 14, gap: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 4, elevation: 2 },
  iconBubble: { width: 48, height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center' },
  iconEmoji: { fontSize: 22 },
  info: { flex: 1, gap: 3 },
  categoryName: { fontSize: 15, fontWeight: '700' },
  meta: { fontSize: 12 },
  right: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  colorBar: { width: 4, height: 24, borderRadius: 2 },
  deleteBtn: { padding: 4 },
  separator: { height: 8 },
});
