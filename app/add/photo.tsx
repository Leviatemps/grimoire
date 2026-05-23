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
  Image,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useItemsStore } from '../../src/stores/itemsStore';
import { generateId } from '../../src/utils/helpers';
import { CategoryPicker } from '../../src/components/CategoryPicker';

export default function AddPhotoScreen() {
  const insets = useSafeAreaInsets();
  const { addItem } = useItemsStore();

  const [photoUri,    setPhotoUri]    = useState('');
  const [title,       setTitle]       = useState('');
  const [description, setDescription] = useState('');
  const [categoryId,  setCategoryId]  = useState('');
  const [subId,       setSubId]       = useState('');

  const pickFromGallery = async () => {
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
    if (!result.canceled) setPhotoUri(result.assets[0].uri);
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission refusée', "L'accès à l'appareil photo est requis.");
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 0.9,
    });
    if (!result.canceled) setPhotoUri(result.assets[0].uri);
  };

  const handleSave = () => {
    if (!photoUri) {
      Alert.alert('Photo requise', 'Veuillez sélectionner ou prendre une photo.');
      return;
    }
    if (!title.trim()) {
      Alert.alert('Titre requis', 'Veuillez entrer un titre.');
      return;
    }
    const now = new Date().toISOString();
    addItem({
      id:            generateId(),
      type:          'photo',
      title:         title.trim(),
      description:   description.trim() || undefined,
      coverImage:    photoUri,
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
        <Text style={styles.headerTitle}>Ajouter une photo</Text>
        <TouchableOpacity onPress={handleSave} style={styles.saveBtn}>
          <Text style={styles.saveBtnLabel}>Sauvegarder</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 40 }]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Photo picker */}
        {photoUri ? (
          <TouchableOpacity onPress={pickFromGallery} activeOpacity={0.9} style={styles.photoPreview}>
            <Image source={{ uri: photoUri }} style={styles.photo} resizeMode="cover" />
            <View style={styles.changeOverlay}>
              <Ionicons name="camera" size={24} color="#fff" />
              <Text style={styles.changeText}>Changer</Text>
            </View>
          </TouchableOpacity>
        ) : (
          <View style={styles.pickerRow}>
            <TouchableOpacity onPress={pickFromGallery} style={styles.pickerBtn}>
              <Ionicons name="images-outline" size={32} color="#ec4899" />
              <Text style={styles.pickerLabel}>Galerie</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={takePhoto} style={styles.pickerBtn}>
              <Ionicons name="camera-outline" size={32} color="#ec4899" />
              <Text style={styles.pickerLabel}>Appareil photo</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Title */}
        <View style={styles.section}>
          <Text style={styles.label}>Titre *</Text>
          <TextInput
            value={title}
            onChangeText={setTitle}
            placeholder="Titre de la photo"
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
            placeholder="Contexte, lieu, date…"
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
    backgroundColor: '#ec4899',
  },
  saveBtnLabel: { color: '#fff', fontWeight: '700', fontSize: 13 },
  content: { padding: 20, gap: 20 },
  pickerRow: {
    flexDirection: 'row',
    gap: 12,
  },
  pickerBtn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    height: 140,
    backgroundColor: '#fff',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#fce7f3',
    borderStyle: 'dashed',
  },
  pickerLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ec4899',
  },
  photoPreview: {
    height: 220,
    borderRadius: 16,
    overflow: 'hidden',
    position: 'relative',
  },
  photo: { width: '100%', height: '100%' },
  changeOverlay: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(0,0,0,0.55)',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
  },
  changeText: { color: '#fff', fontSize: 13, fontWeight: '600' },
  section: { gap: 8 },
  label: {
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
    fontSize: 15,
    color: '#111827',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  multiline: { minHeight: 90 },
});
