import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as WebBrowser from 'expo-web-browser';
import { useItemsStore } from '../../src/stores/itemsStore';
import { useCategoriesStore } from '../../src/stores/categoriesStore';
import { formatRelativeDate, extractDomain } from '../../src/utils/helpers';

const TYPE_CONFIG = {
  link:  { color: '#6366f1', label: 'Lien web',  icon: 'link' },
  photo: { color: '#ec4899', label: 'Photo',      icon: 'image' },
  note:  { color: '#f97316', label: 'Note',       icon: 'document-text' },
} as const;

export default function ItemDetailScreen() {
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { items, deleteItem } = useItemsStore();
  const { getCategoryById, getSubcategoriesByCategoryId } = useCategoriesStore();

  const item = items.find((i) => i.id === id);

  if (!item) {
    return (
      <View style={styles.screen}>
        <Text style={{ padding: 20 }}>Contenu introuvable.</Text>
      </View>
    );
  }

  const config   = TYPE_CONFIG[item.type];
  const category = item.categoryId ? getCategoryById(item.categoryId) : undefined;
  const subs     = category ? getSubcategoriesByCategoryId(category.id) : [];
  const sub      = item.subcategoryId ? subs.find((s) => s.id === item.subcategoryId) : undefined;

  const handleDelete = () => {
    Alert.alert('Supprimer', 'Supprimer ce contenu définitivement ?', [
      { text: 'Annuler', style: 'cancel' },
      {
        text: 'Supprimer',
        style: 'destructive',
        onPress: () => { deleteItem(item.id); router.back(); },
      },
    ]);
  };

  const handleOpenLink = () => {
    if (item.url) WebBrowser.openBrowserAsync(item.url);
  };

  const hasImage = !!(item.coverImage || item.ogImage);
  const imageUri = item.coverImage ?? item.ogImage;

  return (
    <View style={styles.screen}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 40 }}
      >
        {/* Cover image */}
        {hasImage && (
          <View style={styles.coverContainer}>
            <Image source={{ uri: imageUri }} style={styles.cover} resizeMode="cover" />
            {/* Gradient overlay for back button */}
            <View style={styles.overlay} />
          </View>
        )}

        {/* Back + actions */}
        <View style={[styles.topBar, { top: insets.top + 8 }]}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="chevron-back" size={22} color={hasImage ? '#fff' : '#374151'} />
          </TouchableOpacity>
          <View style={{ flexDirection: 'row', gap: 8 }}>
          <TouchableOpacity onPress={() => router.push(`/item/edit/${item.id}`)} style={styles.backBtn}>
            <Ionicons name="create-outline" size={20} color={hasImage ? '#fff' : '#6366f1'} />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleDelete} style={styles.backBtn}>
            <Ionicons name="trash-outline" size={20} color={hasImage ? '#fff' : '#ef4444'} />
          </TouchableOpacity>
        </View>
        </View>

        {/* Content card */}
        <View style={[styles.card, hasImage && styles.cardOverlap]}>
          {/* Type badge */}
          <View style={[styles.typeBadge, { backgroundColor: `${config.color}15` }]}>
            <Ionicons name={config.icon as any} size={14} color={config.color} />
            <Text style={[styles.typeLabel, { color: config.color }]}>{config.label}</Text>
          </View>

          {/* Title */}
          <Text style={styles.title}>{item.title}</Text>

          {/* Breadcrumb */}
          {category && (
            <View style={styles.breadcrumb}>
              <Text style={[styles.breadcrumbText, { color: category.color }]}>
                {category.icon} {category.name}
              </Text>
              {sub && (
                <>
                  <Ionicons name="chevron-forward" size={12} color="#9ca3af" />
                  <Text style={styles.breadcrumbSub}>{sub.name}</Text>
                </>
              )}
            </View>
          )}

          {/* Date */}
          <Text style={styles.date}>{formatRelativeDate(item.createdAt)}</Text>

          {/* Divider */}
          <View style={styles.divider} />

          {/* Description */}
          {(item.description || item.ogDescription) && (
            <Text style={styles.description}>
              {item.description ?? item.ogDescription}
            </Text>
          )}

          {/* Link specific */}
          {item.type === 'link' && item.url && (
            <TouchableOpacity onPress={handleOpenLink} style={styles.linkBtn}>
              <View style={styles.linkBtnLeft}>
                <Ionicons name="globe-outline" size={18} color="#6366f1" />
                <View>
                  <Text style={styles.linkBtnSite}>
                    {item.ogSiteName ?? extractDomain(item.url)}
                  </Text>
                  <Text style={styles.linkBtnUrl} numberOfLines={1}>
                    {item.url}
                  </Text>
                </View>
              </View>
              <Ionicons name="open-outline" size={18} color="#6366f1" />
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#f8f9fb' },
  coverContainer: { height: 280, position: 'relative' },
  cover: { width: '100%', height: '100%' },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.25)',
  },
  topBar: {
    position: 'absolute',
    left: 16,
    right: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    zIndex: 10,
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(0,0,0,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    margin: 16,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  cardOverlap: {
    marginTop: -24,
  },
  typeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  typeLabel: { fontSize: 12, fontWeight: '600' },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: '#111827',
    lineHeight: 28,
    letterSpacing: -0.3,
  },
  breadcrumb: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  breadcrumbText: {
    fontSize: 13,
    fontWeight: '600',
  },
  breadcrumbSub: {
    fontSize: 13,
    color: '#9ca3af',
  },
  date: { fontSize: 12, color: '#9ca3af' },
  divider: {
    height: 1,
    backgroundColor: '#f1f3f6',
    marginVertical: 4,
  },
  description: {
    fontSize: 15,
    color: '#374151',
    lineHeight: 24,
  },
  linkBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#f0f0ff',
    borderRadius: 12,
    padding: 14,
    gap: 12,
    marginTop: 4,
  },
  linkBtnLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  linkBtnSite: {
    fontSize: 13,
    fontWeight: '700',
    color: '#6366f1',
  },
  linkBtnUrl: {
    fontSize: 11,
    color: '#9ca3af',
    maxWidth: 220,
  },
});
