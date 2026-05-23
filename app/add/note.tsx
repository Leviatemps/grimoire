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
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useItemsStore } from '../../src/stores/itemsStore';
import { generateId } from '../../src/utils/helpers';
import { CategoryPicker } from '../../src/components/CategoryPicker';

export default function AddNoteScreen() {
  const insets = useSafeAreaInsets();
  const { addItem } = useItemsStore();

  const [title,       setTitle]       = useState('');
  const [body,        setBody]        = useState('');
  const [categoryId,  setCategoryId]  = useState('');
  const [subId,       setSubId]       = useState('');

  const wordCount = body.trim() ? body.trim().split(/\s+/).length : 0;

  const handleSave = () => {
    if (!title.trim()) {
      Alert.alert('Titre requis', 'Veuillez entrer un titre pour votre note.');
      return;
    }
    const now = new Date().toISOString();
    addItem({
      id:            generateId(),
      type:          'note',
      title:         title.trim(),
      description:   body.trim() || undefined,
      categoryId:    categoryId || undefined,
      subcategoryId: subId || undefined,
      createdAt:     now,
      updatedAt:     now,
    });
    router.back();
    router.back();
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
        <Text style={styles.headerTitle}>Nouvelle note</Text>
        <TouchableOpacity onPress={handleSave} style={styles.saveBtn}>
          <Text style={styles.saveBtnLabel}>Sauvegarder</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 40 }]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Decorative header */}
        <View style={styles.noteHero}>
          <View style={styles.iconBubble}>
            <Ionicons name="document-text" size={32} color="#f97316" />
          </View>
          <Text style={styles.noteHeroLabel}>Note personnelle</Text>
        </View>

        {/* Title */}
        <View style={styles.section}>
          <Text style={styles.label}>Titre *</Text>
          <TextInput
            value={title}
            onChangeText={setTitle}
            placeholder="Un titre clair et mémorable"
            placeholderTextColor="#9ca3af"
            style={[styles.input, styles.titleInput]}
            returnKeyType="next"
          />
        </View>

        {/* Body */}
        <View style={styles.section}>
          <View style={styles.labelRow}>
            <Text style={styles.label}>Contenu</Text>
            <Text style={styles.wordCount}>{wordCount} mot{wordCount !== 1 ? 's' : ''}</Text>
          </View>
          <TextInput
            value={body}
            onChangeText={setBody}
            placeholder="Écrivez votre note ici…"
            placeholderTextColor="#9ca3af"
            style={[styles.input, styles.bodyInput]}
            multiline
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
    backgroundColor: '#f97316',
  },
  saveBtnLabel: { color: '#fff', fontWeight: '700', fontSize: 13 },
  content: { padding: 20, gap: 20 },
  noteHero: {
    alignItems: 'center',
    gap: 8,
    paddingVertical: 20,
    backgroundColor: '#fff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#fed7aa',
  },
  iconBubble: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#fff7ed',
    alignItems: 'center',
    justifyContent: 'center',
  },
  noteHeroLabel: {
    fontSize: 13,
    color: '#f97316',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  section: { gap: 8 },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  label: {
    fontSize: 13,
    fontWeight: '700',
    color: '#374151',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  wordCount: {
    fontSize: 12,
    color: '#9ca3af',
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    fontSize: 15,
    color: '#111827',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  titleInput: {
    fontSize: 17,
    fontWeight: '600',
  },
  bodyInput: {
    minHeight: 200,
    lineHeight: 24,
  },
});
