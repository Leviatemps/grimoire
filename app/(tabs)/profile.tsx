import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Share,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useItemsStore } from '../../src/stores/itemsStore';
import { useCategoriesStore } from '../../src/stores/categoriesStore';

function StatCard({ label, value, icon, color }: { label: string; value: number; icon: string; color: string }) {
  return (
    <View style={[styles.statCard, { borderTopColor: color }]}>
      <Ionicons name={icon as any} size={24} color={color} />
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

export default function ProfileScreen() {
  const insets  = useSafeAreaInsets();
  const { items } = useItemsStore();
  const { categories } = useCategoriesStore();

  const links  = items.filter((i) => i.type === 'link').length;
  const photos = items.filter((i) => i.type === 'photo').length;
  const notes  = items.filter((i) => i.type === 'note').length;

  const handleExport = async () => {
    const data = JSON.stringify({ items, categories }, null, 2);
    try {
      await Share.share({ title: 'Grimoire — Export', message: data });
    } catch {
      Alert.alert('Erreur', "Impossible d'exporter les données.");
    }
  };

  const MENU_ITEMS = [
    { icon: 'share-outline',    label: 'Exporter mes données (JSON)', color: '#6366f1', onPress: handleExport },
    { icon: 'moon-outline',     label: 'Mode sombre',                 color: '#374151', onPress: () => Alert.alert('Bientôt', 'Le mode sombre arrive prochainement.') },
    { icon: 'cloud-outline',    label: 'Synchronisation cloud',       color: '#3b82f6', onPress: () => Alert.alert('Bientôt', 'La sync Supabase arrive prochainement.') },
    { icon: 'lock-closed-outline', label: 'Confidentialité',          color: '#10b981', onPress: () => {} },
    { icon: 'help-circle-outline', label: 'Aide & support',           color: '#f59e0b', onPress: () => {} },
    { icon: 'information-circle-outline', label: 'À propos de Grimoire', color: '#9ca3af', onPress: () =>
        Alert.alert('Grimoire', 'Version 1.0.0\nVotre mémoire numérique personnelle.')
    },
  ];

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 40 }]}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 20 }]}>
        <View style={styles.avatar}>
          <Text style={styles.avatarEmoji}>📖</Text>
        </View>
        <Text style={styles.appName}>Grimoire</Text>
        <Text style={styles.tagline}>Votre mémoire numérique personnelle</Text>
      </View>

      {/* Stats */}
      <View style={styles.statsGrid}>
        <StatCard label="Total"       value={items.length}     icon="archive"       color="#6366f1" />
        <StatCard label="Liens"       value={links}            icon="link"          color="#6366f1" />
        <StatCard label="Photos"      value={photos}           icon="image"         color="#ec4899" />
        <StatCard label="Notes"       value={notes}            icon="document-text" color="#f97316" />
        <StatCard label="Catégories"  value={categories.length} icon="folder"       color="#22c55e" />
      </View>

      {/* Menu */}
      <View style={styles.menuSection}>
        {MENU_ITEMS.map((item, i) => (
          <TouchableOpacity
            key={i}
            onPress={item.onPress}
            activeOpacity={0.75}
            style={[
              styles.menuItem,
              i === 0 && styles.menuItemFirst,
              i === MENU_ITEMS.length - 1 && styles.menuItemLast,
            ]}
          >
            <View style={[styles.menuIconBubble, { backgroundColor: `${item.color}15` }]}>
              <Ionicons name={item.icon as any} size={18} color={item.color} />
            </View>
            <Text style={styles.menuLabel}>{item.label}</Text>
            <Ionicons name="chevron-forward" size={16} color="#d1d5db" />
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.version}>Grimoire v1.0.0 · Made with ❤️</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#f8f9fb' },
  content: { gap: 20 },
  header: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 24,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f3f6',
    gap: 8,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#f0f0ff',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  avatarEmoji: { fontSize: 36 },
  appName: {
    fontSize: 26,
    fontWeight: '800',
    color: '#111827',
    letterSpacing: -0.5,
  },
  tagline: { fontSize: 14, color: '#9ca3af', textAlign: 'center' },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    paddingHorizontal: 16,
  },
  statCard: {
    flex: 1,
    minWidth: 80,
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 14,
    alignItems: 'center',
    gap: 6,
    borderTopWidth: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  statValue: { fontSize: 22, fontWeight: '800', color: '#111827' },
  statLabel: { fontSize: 11, color: '#9ca3af', fontWeight: '600', textAlign: 'center' },
  menuSection: {
    marginHorizontal: 16,
    backgroundColor: '#fff',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f3f6',
    gap: 12,
  },
  menuItemFirst: { borderTopLeftRadius: 16, borderTopRightRadius: 16 },
  menuItemLast:  { borderBottomWidth: 0, borderBottomLeftRadius: 16, borderBottomRightRadius: 16 },
  menuIconBubble: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuLabel: { flex: 1, fontSize: 15, fontWeight: '500', color: '#111827' },
  version: {
    textAlign: 'center',
    fontSize: 12,
    color: '#d1d5db',
    paddingBottom: 8,
  },
});
