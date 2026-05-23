import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const TYPES = [
  {
    key: 'link',
    label: 'Lien web',
    description: 'Sauvegardez une URL avec prévisualisation',
    icon: 'link',
    color: '#6366f1',
    route: '/add/link',
  },
  {
    key: 'photo',
    label: 'Photo',
    description: 'Importez depuis votre galerie ou appareil photo',
    icon: 'image',
    color: '#ec4899',
    route: '/add/photo',
  },
  {
    key: 'note',
    label: 'Note',
    description: 'Rédigez une note textuelle',
    icon: 'document-text',
    color: '#f97316',
    route: '/add/note',
  },
] as const;

export default function AddIndexScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.screen, { paddingBottom: insets.bottom + 16 }]}>
      {/* Handle bar */}
      <View style={styles.handle} />

      {/* Title */}
      <View style={styles.titleRow}>
        <Text style={styles.title}>Ajouter un contenu</Text>
        <TouchableOpacity onPress={() => router.back()} style={styles.closeBtn}>
          <Ionicons name="close" size={20} color="#374151" />
        </TouchableOpacity>
      </View>
      <Text style={styles.subtitle}>Choisissez le type de contenu à ajouter à votre Grimoire.</Text>

      {/* Type cards */}
      <View style={styles.cards}>
        {TYPES.map((t) => (
          <TouchableOpacity
            key={t.key}
            onPress={() => router.push(t.route as any)}
            activeOpacity={0.85}
            style={styles.card}
          >
            <View style={[styles.iconBubble, { backgroundColor: `${t.color}15` }]}>
              <Ionicons name={t.icon as any} size={28} color={t.color} />
            </View>
            <View style={styles.cardText}>
              <Text style={styles.cardLabel}>{t.label}</Text>
              <Text style={styles.cardDesc}>{t.description}</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#d1d5db" />
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingTop: 12,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#e5e7eb',
    alignSelf: 'center',
    marginBottom: 20,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: '#111827',
  },
  closeBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#9ca3af',
    marginBottom: 24,
    lineHeight: 20,
  },
  cards: {
    gap: 12,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fb',
    borderRadius: 14,
    padding: 16,
    gap: 14,
    borderWidth: 1,
    borderColor: '#f1f3f6',
  },
  iconBubble: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardText: {
    flex: 1,
    gap: 3,
  },
  cardLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },
  cardDesc: {
    fontSize: 13,
    color: '#9ca3af',
    lineHeight: 18,
  },
});
