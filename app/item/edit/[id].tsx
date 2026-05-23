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
  Alert,
  Image,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useItemsStore } from '../../../src/stores/itemsStore';
import { CategoryPicker } from '../../../src/components/CategoryPicker';

export default function EditItemScreen() {
  const insets = useSafeAreaInsets();
  const { id }  = useLocalSearchParams<{ id: string }>();
  const { items, updateItem } = useItemsStore();

  const item = items.find((i) => i.id === id);

  if (!item) {
    return (
      <View style={styles.screen}>
        <Text style={{ padding: 20, color: '#374151' }}>Contenu introuvable.</Text>
      </View>
    );
  }

  const [title,       setTitle]       = useState(item.title);
  const [description, setDescription] = useState(item.description ?? '');
  const [coverImage,  setCoverImage]  = useState(item.coverImage ?? '');
  const [categoryId,  setCategoryId]  = useState(item.categoryId ?? '');
  const [subId,       setSubId]       = useState(item.subcategoryId ?? '');
  const [isDirty,     setDirty]       = useState(false);

  const markDirty = () => setDirty(true);

  const handleBack = () => {
    if (isDirty) {
      Alert.alert(
        'Modifications non sauvegardées',
        'Voulez-vous quitter sans sauvegarder ?',
        [
          { text: 'Rester', style: 'cancel' },
          { text: 'Quitter', style: 'destructive', onPress: () => router.back() },
        ]
      );
    } else {
      router.back();
    }
  };

  const handleSave = () => {
    if (!title.trim()) {
      Alert.alert('Titre requis', 'Veuillez entrer un titre.');
      return;
    }
    updateItem({
      id:            item.id,
      title:         title.trim(),
      description:   description.trim() || undefined,
      coverImage:    coverImage || undefined,
      categoryId:    categoryId || undefined,
      subcategoryId: subId || undefined,
    });
    router.back();
  };

  const pickNewPhoto = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission refusée', "L'accès à la galerie est requis.");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.9,
    });
    if (!result.canceled) {
      setCoverImage(result.assets[0].uri);
      markDirty();
    }
  };

  const TYPE_CONFIG = {
    link:  { color: '#6366f1', label: 'Lien web',  icon: 'link' },
    photo: { color: '#ec4899', label: 'Photo',      icon: 'image' },
    note:  { color: '#f97316', label: 'Note',       icon: 'document-text' },
  } as const;
  const config = TYPE_CONFIG[item.type];

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <TouchableOpacity onPress={handleBack} style={styles.closeBtn}>
          <Ionicons name="chevron-back" size={22} color="#374151" />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <View style={[styles.typeBadge, { backgroundColor: `${config.color}15` }]}>
            <Ionicons name={config.icon as any} size={13} color={config.color} />
            <Text style={[styles.typeLabel, { color: config.color }]}>{config.label}</Text>
          </View>
          <Text style={styles.headerTitle}>Modifier</Text>
        </View>
        <TouchableOpacity onPress={handleSave} style={[styles.saveBtn, { backgroundColor: config.color }]}>
          <Text style={styles.saveBtnLabel}>Sauvegarder</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 40 }]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Cover image (photo or OG) */}
        {(item.type === 'photo' || item.ogImage || coverImage) && (
          <View style={styles.section}>
            <Text style={styles.label}>Image de couverture</Text>
            {coverImage ? (
              <TouchableOpacity onPress={item.type === 'photo' ? pickNewPhoto : undefined} activeOpacity={0.85}>
                <Image source={{ uri: coverImage }} style={styles.coverPreview} resizeMode="cover" />
                {item.type === 'photo' && (
                  <View style={styles.changeOverlay}>
                    <Ionicons name="camera" size={18} color="#fff" />
                    <Text style={styles.changeText}>Changer</Text>
                  </View>
                )}
              </TouchableOpacity>
            ) : (
              <TouchableOpacity onPress={pickNewPhoto} style={styles.emptyImage}>
                <Ionicons name="image-outline" size={32} color="#9ca3af" />
                <Text style={styles.emptyImageText}>Ajouter une image</Text>
              </TouchableOpacity>
            )}
          </View>
        )}

        {/* Title */}
        <View style={styles.section}>
          <Text style={styles.label}>Titre *</Text>
          <TextInput
            value={title}
            onChangeText={(t) => { setTitle(t); markDirty(); }}
            placeholder="Titre du contenu"
            placeholderTextColor="#9ca3af"
            style={styles.input}
            autoFocus
          />
        </View>

        {/* Description */}
        <View style={styles.section}>
          <Text style={styles.label}>Description / Notes personnelles</Text>
          <TextInput
            value={description}
            onChangeText={(t) => { setDescription(t); markDirty(); }}
            placeholder="Ajoutez vos notes personnelles…"
            placeholderTextColor="#9ca3af"
            style={[styles.input, styles.multiline]}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>

        {/* URL (read-only for links) */}
        {item.type === 'link' && item.url && (
          <View style={styles.section}>
            <Text style={styles.label}>URL (non modifiable)</Text>
            <View style={styles.urlReadOnly}>
              <Ionicons name="link" size={16} color="#9ca3af" />
              <Text style={styles.urlText} numberOfLines={1}>{item.url}</Text>
            </View>
          </View>
        )}

        {/* Category */}
        <CategoryPicker
          categoryId={categoryId}
          subcategoryId={subId}
          onCategoryChange={(cid) => { setCategoryId(cid); setSubId(''); markDirty(); }}
          onSubcategoryChange={(sid) => { setSubId(sid); markDirty(); }}
        />

        {/* Metadata */}
        <View style={styles.metaBox}>
          <Text style={styles.metaRow}>
            <Text style={styles.metaKey}>Ajouté le  </Text>
            {new Date(item.createdAt).toLocaleDateString('fr-FR', {
              day: 'numeric', month: 'long', year: 'numeric',
            })}
          </Text>
          {item.updatedAt !== item.createdAt && (
            <Text style={styles.metaRow}>
              <Text style={styles.metaKey}>Modifié le  </Text>
              {new Date(item.updatedAt).toLocaleDateString('fr-FR', {
                day: 'numeric', month: 'long', year: 'numeric',
              })}
            </Text>
          )}
        </View>
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
  headerCenter: { flex: 1, alignItems: 'center', gap: 2 },
  headerTitle: { fontSize: 15, fontWeight: '700', color: '#111827' },
  typeBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    paddingHorizontal: 8, paddingVertical: 3, borderRadius: 20,
  },
  typeLabel: { fontSize: 11, fontWeight: '600' },
  closeBtn: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: '#f3f4f6', alignItems: 'center', justifyContent: 'center',
  },
  saveBtn: {
    paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20,
  },
  saveBtnLabel: { color: '#fff', fontWeight: '700', fontSize: 13 },
  content: { padding: 20, gap: 20 },
  section: { gap: 8 },
  label: {
    fontSize: 13, fontWeight: '700', color: '#374151',
    textTransform: 'uppercase', letterSpacing: 0.5,
  },
  input: {
    backgroundColor: '#fff', borderRadius: 12, padding: 14,
    fontSize: 15, color: '#111827', borderWidth: 1, borderColor: '#e5e7eb',
  },
  multiline: { minHeight: 100 },
  coverPreview: {
    width: '100%', height: 180, borderRadius: 12,
    overflow: 'hidden',
  },
  changeOverlay: {
    position: 'absolute', bottom: 10, right: 10,
    flexDirection: 'row', alignItems: 'center', gap: 5,
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20,
  },
  changeText: { color: '#fff', fontSize: 12, fontWeight: '600' },
  emptyImage: {
    height: 120, backgroundColor: '#fff', borderRadius: 12,
    borderWidth: 1, borderColor: '#e5e7eb', borderStyle: 'dashed',
    alignItems: 'center', justifyContent: 'center', gap: 8,
  },
  emptyImageText: { fontSize: 13, color: '#9ca3af', fontWeight: '500' },
  urlReadOnly: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: '#f3f4f6', borderRadius: 12, padding: 14,
  },
  urlText: { fontSize: 13, color: '#6b7280', flex: 1 },
  metaBox: {
    backgroundColor: '#fff', borderRadius: 12,
    padding: 14, gap: 6, borderWidth: 1, borderColor: '#f1f3f6',
  },
  metaRow: { fontSize: 12, color: '#6b7280' },
  metaKey: { fontWeight: '700', color: '#374151' },
});
