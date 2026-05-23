import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Image,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as WebBrowser from 'expo-web-browser';
import { useItemsStore } from '../../src/stores/itemsStore';
import { useCategoriesStore } from '../../src/stores/categoriesStore';
import { fetchOGData, generateId, extractDomain, OGFetchResult } from '../../src/utils/helpers';
import { OGData } from '../../src/types';
import { CategoryPicker } from '../../src/components/CategoryPicker';

export default function AddLinkScreen() {
  const insets = useSafeAreaInsets();
  const { addItem } = useItemsStore();
  const { categories, getSubcategoriesByCategoryId } = useCategoriesStore();

  const [url,         setUrl]         = useState('');
  const [title,       setTitle]       = useState('');
  const [description, setDescription] = useState('');
  const [ogData,      setOgData]      = useState<OGData | null>(null);
  const [loading,     setLoading]     = useState(false);
  const [categoryId,  setCategoryId]  = useState('');
  const [subId,       setSubId]       = useState('');

  const subs = categoryId ? getSubcategoriesByCategoryId(categoryId) : [];

  const handleFetch = async () => {
    const trimmed = url.trim();
    if (!trimmed) return;
    const full = trimmed.startsWith('http') ? trimmed : `https://${trimmed}`;
    setLoading(true);
    const result = await fetchOGData(full);
    if (result.ok) {
      setOgData(result.data);
      if (!title) setTitle(result.data.title ?? extractDomain(full));
      if (!description) setDescription(result.data.description ?? '');
    } else {
      Alert.alert('Prévisualisation indisponible', result.error + '\nVous pouvez quand même sauvegarder le lien manuellement.');
      if (!title) setTitle(extractDomain(full));
    }
    setLoading(false);
  };

  const handleSave = () => {
    const trimmedUrl = url.trim();
    if (!trimmedUrl) {
      Alert.alert('URL requise', 'Veuillez entrer une URL valide.');
      return;
    }
    if (!title.trim()) {
      Alert.alert('Titre requis', 'Veuillez entrer un titre.');
      return;
    }
    const full = trimmedUrl.startsWith('http') ? trimmedUrl : `https://${trimmedUrl}`;
    const now  = new Date().toISOString();
    addItem({
      id:             generateId(),
      type:           'link',
      title:          title.trim(),
      description:    description.trim() || undefined,
      coverImage:     ogData?.image,
      url:            full,
      ogTitle:        ogData?.title,
      ogDescription:  ogData?.description,
      ogImage:        ogData?.image,
      ogSiteName:     ogData?.siteName,
      categoryId:     categoryId || undefined,
      subcategoryId:  subId || undefined,
      createdAt:      now,
      updatedAt:      now,
    });
    router.back();
    router.back(); // close both modals
  };

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.closeBtn}>
          <Ionicons name="chevron-back" size={22} color="#374151" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Ajouter un lien</Text>
        <TouchableOpacity onPress={handleSave} style={styles.saveBtn}>
          <Text style={styles.saveBtnLabel}>Sauvegarder</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 40 }]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* URL input */}
        <View style={styles.section}>
          <Text style={styles.label}>URL *</Text>
          <View style={styles.urlRow}>
            <TextInput
              value={url}
              onChangeText={setUrl}
              placeholder="https://exemple.com"
              placeholderTextColor="#9ca3af"
              style={[styles.input, styles.urlInput]}
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="url"
              onSubmitEditing={handleFetch}
              returnKeyType="go"
            />
            <TouchableOpacity
              onPress={handleFetch}
              style={styles.fetchBtn}
              disabled={loading}
            >
              {loading
                ? <ActivityIndicator size="small" color="#fff" />
                : <Ionicons name="arrow-forward" size={18} color="#fff" />
              }
            </TouchableOpacity>
          </View>
        </View>

        {/* OG Preview card */}
        {ogData && (
          <View style={styles.previewCard}>
            {ogData.image && (
              <Image
                source={{ uri: ogData.image }}
                style={styles.previewImage}
                resizeMode="cover"
              />
            )}
            <View style={styles.previewContent}>
              {ogData.siteName && (
                <Text style={styles.previewSite}>{ogData.siteName}</Text>
              )}
              <Text style={styles.previewTitle} numberOfLines={2}>
                {ogData.title ?? extractDomain(url)}
              </Text>
              {ogData.description && (
                <Text style={styles.previewDesc} numberOfLines={2}>
                  {ogData.description}
                </Text>
              )}
            </View>
            <TouchableOpacity
              onPress={() => WebBrowser.openBrowserAsync(url.startsWith('http') ? url : `https://${url}`)}
              style={styles.openBtn}
            >
              <Ionicons name="open-outline" size={16} color="#6366f1" />
            </TouchableOpacity>
          </View>
        )}

        {/* Title */}
        <View style={styles.section}>
          <Text style={styles.label}>Titre *</Text>
          <TextInput
            value={title}
            onChangeText={setTitle}
            placeholder="Titre du contenu"
            placeholderTextColor="#9ca3af"
            style={styles.input}
          />
        </View>

        {/* Description */}
        <View style={styles.section}>
          <Text style={styles.label}>Description</Text>
          <TextInput
            value={description}
            onChangeText={setDescription}
            placeholder="Notes personnelles…"
            placeholderTextColor="#9ca3af"
            style={[styles.input, styles.multiline]}
            multiline
            numberOfLines={3}
            textAlignVertical="top"
          />
        </View>

        {/* Category */}
        <CategoryPicker
          categoryId={categoryId}
          subcategoryId={subId}
          onCategoryChange={(id) => { setCategoryId(id); setSubId(''); }}
          onSubcategoryChange={setSubId}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#f8f9fb' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f3f6',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    flex: 1,
    textAlign: 'center',
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#6366f1',
  },
  saveBtnLabel: { color: '#fff', fontWeight: '700', fontSize: 13 },
  content: { padding: 20, gap: 20 },
  section: { gap: 8 },
  label: {
    fontSize: 13,
    fontWeight: '700',
    color: '#374151',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  urlRow: { flexDirection: 'row', gap: 8 },
  input: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    fontSize: 15,
    color: '#111827',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  urlInput: { flex: 1 },
  fetchBtn: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#6366f1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  multiline: { minHeight: 90 },
  previewCard: {
    backgroundColor: '#fff',
    borderRadius: 14,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  previewImage: {
    width: '100%',
    height: 160,
  },
  previewContent: { padding: 12, gap: 4 },
  previewSite: { fontSize: 11, color: '#9ca3af', fontWeight: '600', textTransform: 'uppercase' },
  previewTitle: { fontSize: 15, fontWeight: '700', color: '#111827' },
  previewDesc: { fontSize: 13, color: '#6b7280', lineHeight: 18 },
  openBtn: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#f0f0ff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
