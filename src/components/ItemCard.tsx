import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Item } from '../types';
import { formatRelativeDate, extractDomain } from '../utils/helpers';
import { useCategoriesStore } from '../stores/categoriesStore';
import { useTheme } from '../theme';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width - 32;

interface ItemCardProps { item: Item; onPress: () => void; onLongPress?: () => void; }

const TYPE_CONFIG = {
  link:  { icon: 'link',          label: 'Lien',  color: '#6366f1' },
  photo: { icon: 'image',         label: 'Photo', color: '#ec4899' },
  note:  { icon: 'document-text', label: 'Note',  color: '#f97316' },
} as const;

export function ItemCard({ item, onPress, onLongPress }: ItemCardProps) {
  const t = useTheme();
  const getCategoryById = useCategoriesStore((s) => s.getCategoryById);
  const category = item.categoryId ? getCategoryById(item.categoryId) : undefined;
  const config   = TYPE_CONFIG[item.type];
  const hasImage = !!(item.coverImage || item.ogImage);
  const imageUri = item.coverImage ?? item.ogImage;

  return (
    <TouchableOpacity
      onPress={onPress} onLongPress={onLongPress} activeOpacity={0.92}
      style={[styles.card, { backgroundColor: t.surface, shadowColor: t.cardShadow }]}
    >
      {hasImage && (
        <View style={styles.imageContainer}>
          <Image source={{ uri: imageUri }} style={styles.coverImage} resizeMode="cover" />
          <View style={[styles.typeBadge, { backgroundColor: config.color }]}>
            <Ionicons name={config.icon as any} size={12} color="#fff" />
          </View>
        </View>
      )}
      <View style={styles.content}>
        <View style={styles.topRow}>
          {!hasImage && (
            <View style={[styles.typeChip, { backgroundColor: `${config.color}18` }]}>
              <Ionicons name={config.icon as any} size={12} color={config.color} />
              <Text style={[styles.typeLabel, { color: config.color }]}>{config.label}</Text>
            </View>
          )}
          {category && (
            <View style={[styles.categoryChip, { backgroundColor: `${category.color}18` }]}>
              <Text style={styles.categoryIcon}>{category.icon}</Text>
              <Text style={[styles.categoryName, { color: category.color }]} numberOfLines={1}>{category.name}</Text>
            </View>
          )}
        </View>
        <Text style={[styles.title, { color: t.text }]} numberOfLines={2}>{item.title}</Text>
        {(item.description || item.ogDescription) && (
          <Text style={[styles.description, { color: t.textSecondary }]} numberOfLines={2}>
            {item.description || item.ogDescription}
          </Text>
        )}
        <View style={styles.footer}>
          {item.type === 'link' && item.url && (
            <Text style={[styles.source, { color: t.textTertiary }]} numberOfLines={1}>
              🌐 {item.ogSiteName ?? extractDomain(item.url)}
            </Text>
          )}
          <Text style={[styles.date, { color: t.textTertiary }]}>{formatRelativeDate(item.createdAt)}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: { width: CARD_WIDTH, borderRadius: 16, overflow: 'hidden', marginBottom: 12, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 3 },
  imageContainer: { height: 180, position: 'relative' },
  coverImage: { width: '100%', height: '100%' },
  typeBadge: { position: 'absolute', top: 12, left: 12, width: 28, height: 28, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  content: { padding: 14, gap: 6 },
  topRow: { flexDirection: 'row', alignItems: 'center', gap: 8, flexWrap: 'wrap' },
  typeChip: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 20 },
  typeLabel: { fontSize: 11, fontWeight: '600' },
  categoryChip: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 20 },
  categoryIcon: { fontSize: 11 },
  categoryName: { fontSize: 11, fontWeight: '600', maxWidth: 100 },
  title: { fontSize: 16, fontWeight: '700', lineHeight: 22 },
  description: { fontSize: 13, lineHeight: 18 },
  footer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 4 },
  source: { fontSize: 12, flex: 1 },
  date: { fontSize: 12 },
});
