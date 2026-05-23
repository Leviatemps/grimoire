import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useCategoriesStore } from '../../src/stores/categoriesStore';
import { CATEGORY_COLORS, CATEGORY_ICONS, generateId } from '../../src/utils/helpers';
import { useTheme } from '../../src/theme';

export default function CreateCategoryScreen() {
  const insets = useSafeAreaInsets();
  const t = useTheme();
  const { addCategory, addSubcategory, categories } = useCategoriesStore();
  const params = useLocalSearchParams<{ parentId?: string }>();
  const isSubcategory = !!params.parentId;
  const parent = isSubcategory ? categories.find((c) => c.id === params.parentId) : undefined;

  const [name,  setName]  = useState('');
  const [color, setColor] = useState(CATEGORY_COLORS[0]);
  const [icon,  setIcon]  = useState(CATEGORY_ICONS[0]);

  const handleSave = () => {
    if (!name.trim()) { Alert.alert('Nom requis', 'Veuillez entrer un nom de catégorie.'); return; }
    const now = new Date().toISOString();
    if (isSubcategory && params.parentId) {
      addSubcategory({ id: generateId(), categoryId: params.parentId, name: name.trim(), createdAt: now, updatedAt: now });
    } else {
      addCategory({ id: generateId(), name: name.trim(), color, icon, createdAt: now, updatedAt: now });
    }
    router.back();
  };

  return (
    <KeyboardAvoidingView style={[styles.screen, { backgroundColor: t.bg }]} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={[styles.header, { paddingTop: insets.top + 8, backgroundColor: t.surface, borderBottomColor: t.border }]}>
        <TouchableOpacity onPress={() => router.back()} style={[styles.closeBtn, { backgroundColor: t.surfaceAlt }]}>
          <Ionicons name="close" size={22} color={t.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: t.text }]}>
          {isSubcategory ? `Sous-catégorie de ${parent?.name ?? ''}` : 'Nouvelle catégorie'}
        </Text>
        <TouchableOpacity onPress={handleSave} style={[styles.saveBtn, { backgroundColor: color }]}>
          <Text style={styles.saveBtnLabel}>Créer</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 32 }]} keyboardShouldPersistTaps="handled">
        <View style={[styles.preview, { backgroundColor: t.surface }]}>
          <View style={[styles.previewBubble, { backgroundColor: `${color}20` }]}>
            <Text style={styles.previewIcon}>{icon}</Text>
          </View>
          <Text style={[styles.previewName, { color: t.text }]}>{name || 'Nom de la catégorie'}</Text>
          <View style={[styles.previewBar, { backgroundColor: color }]} />
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionLabel, { color: t.textSecondary }]}>Nom</Text>
          <TextInput value={name} onChangeText={setName} placeholder="Ex: Voyages, Recettes, Films…"
            placeholderTextColor={t.textTertiary}
            style={[styles.input, { backgroundColor: t.surface, borderColor: t.borderStrong, color: t.text }]}
            autoFocus returnKeyType="done" />
        </View>

        {!isSubcategory && (
          <>
            <View style={styles.section}>
              <Text style={[styles.sectionLabel, { color: t.textSecondary }]}>Couleur</Text>
              <View style={styles.colorGrid}>
                {CATEGORY_COLORS.map((c) => (
                  <TouchableOpacity key={c} onPress={() => setColor(c)}
                    style={[styles.colorDot, { backgroundColor: c }, color === c && styles.colorDotSelected]}>
                    {color === c && <Ionicons name="checkmark" size={16} color="#fff" />}
                  </TouchableOpacity>
                ))}
              </View>
            </View>
            <View style={styles.section}>
              <Text style={[styles.sectionLabel, { color: t.textSecondary }]}>Icône</Text>
              <View style={styles.iconGrid}>
                {CATEGORY_ICONS.map((ic) => (
                  <TouchableOpacity key={ic} onPress={() => setIcon(ic)}
                    style={[styles.iconBtn, { backgroundColor: t.surfaceAlt, borderColor: 'transparent' },
                      icon === ic && { backgroundColor: `${color}20`, borderColor: color }]}>
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
  screen: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingBottom: 12, borderBottomWidth: 1 },
  headerTitle: { fontSize: 16, fontWeight: '700', flex: 1, textAlign: 'center' },
  closeBtn: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  saveBtn: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20 },
  saveBtnLabel: { color: '#fff', fontWeight: '700', fontSize: 14 },
  content: { padding: 20, gap: 24 },
  preview: { alignItems: 'center', gap: 8, paddingVertical: 24, borderRadius: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 },
  previewBubble: { width: 72, height: 72, borderRadius: 36, alignItems: 'center', justifyContent: 'center' },
  previewIcon: { fontSize: 32 },
  previewName: { fontSize: 18, fontWeight: '700' },
  previewBar: { width: 40, height: 4, borderRadius: 2 },
  section: { gap: 10 },
  sectionLabel: { fontSize: 13, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5 },
  input: { borderRadius: 12, padding: 14, fontSize: 16, borderWidth: 1 },
  colorGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  colorDot: { width: 38, height: 38, borderRadius: 19, alignItems: 'center', justifyContent: 'center' },
  colorDotSelected: { transform: [{ scale: 1.2 }] },
  iconGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  iconBtn: { width: 44, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center', borderWidth: 1 },
  iconEmoji: { fontSize: 22 },
});
