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
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useCategoriesStore } from '../../src/stores/categoriesStore';
import { CATEGORY_COLORS, CATEGORY_ICONS, generateId } from '../../src/utils/helpers';
import { Category } from '../../src/types';

export default function CreateCategoryScreen() {
  const insets = useSafeAreaInsets();
  const { addCategory, addSubcategory, categories } = useCategoriesStore();
  const params = useLocalSearchParams<{ parentId?: string }>();

  const isSubcategory = !!params.parentId;
  const parent = isSubcategory
    ? categories.find((c) => c.id === params.parentId)
    : undefined;

  const [name,  setName]  = useState('');
  const [color, setColor] = useState(CATEGORY_COLORS[0]);
  const [icon,  setIcon]  = useState(CATEGORY_ICONS[0]);

  const handleSave = () => {
    if (!name.trim()) {
      Alert.alert('Nom requis', 'Veuillez entrer un nom de catégorie.');
      return;
    }

    const now = new Date().toISOString();

    if (isSubcategory && params.parentId) {
      addSubcategory({
        id: generateId(),
        categoryId: params.parentId,
        name: name.trim(),
        createdAt: now,
        updatedAt: now,
      });
    } else {
      addCategory({
        id: generateId(),
        name: name.trim(),
        color,
        icon,
        createdAt: now,
        updatedAt: now,
      });
    }

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
          <Ionicons name="close" size={22} color="#374151" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {isSubcategory ? `Sous-catégorie de ${parent?.name ?? ''}` : 'Nouvelle catégorie'}
        </Text>
        <TouchableOpacity onPress={handleSave} style={styles.saveBtn}>
          <Text style={styles.saveBtnLabel}>Créer</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 32 }]}
        keyboardShouldPersistTaps="handled"
      >
        {/* Preview */}
        <View style={styles.preview}>
          <View style={[styles.previewBubble, { backgroundColor: `${color}20` }]}>
            <Text style={styles.previewIcon}>{icon}</Text>
          </View>
          <Text style={styles.previewName}>{name || 'Nom de la catégorie'}</Text>
          <View style={[styles.previewBar, { backgroundColor: color }]} />
        </View>

        {/* Name input */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Nom</Text>
          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="Ex: Voyages, Recettes, Achats…"
            placeholderTextColor="#9ca3af"
            style={styles.input}
            autoFocus
            returnKeyType="done"
          />
        </View>

        {/* Color picker (only for main categories) */}
        {!isSubcategory && (
          <>
            <View style={styles.section}>
              <Text style={styles.sectionLabel}>Couleur</Text>
              <View style={styles.colorGrid}>
                {CATEGORY_COLORS.map((c) => (
                  <TouchableOpacity
                    key={c}
                    onPress={() => setColor(c)}
                    style={[
                      styles.colorDot,
                      { backgroundColor: c },
                      color === c && styles.colorDotSelected,
                    ]}
                  >
                    {color === c && (
                      <Ionicons name="checkmark" size={16} color="#fff" />
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionLabel}>Icône</Text>
              <View style={styles.iconGrid}>
                {CATEGORY_ICONS.map((ic) => (
                  <TouchableOpacity
                    key={ic}
                    onPress={() => setIcon(ic)}
                    style={[
                      styles.iconBtn,
                      icon === ic && { backgroundColor: `${color}20`, borderColor: color },
                    ]}
                  >
                    <Text style={styles.iconEmoji}>{ic}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
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
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#6366f1',
  },
  saveBtnLabel: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 14,
  },
  content: {
    padding: 20,
    gap: 24,
  },
  preview: {
    alignItems: 'center',
    gap: 8,
    paddingVertical: 24,
    backgroundColor: '#fff',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  previewBubble: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  previewIcon: {
    fontSize: 32,
  },
  previewName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  previewBar: {
    width: 40,
    height: 4,
    borderRadius: 2,
  },
  section: {
    gap: 10,
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#374151',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    color: '#111827',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  colorDot: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
  },
  colorDotSelected: {
    transform: [{ scale: 1.2 }],
  },
  iconGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  iconBtn: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  iconEmoji: {
    fontSize: 22,
  },
});
