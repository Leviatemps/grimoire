import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, useColorScheme } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useItemsStore } from '../../src/stores/itemsStore';
import { useCategoriesStore } from '../../src/stores/categoriesStore';
import { useTheme } from '../../src/theme';

function StatCard({ label, value, icon, color }: { label: string; value: number; icon: string; color: string }) {
  const t = useTheme();
  return (
    <View style={[styles.statCard, { backgroundColor: t.surface, borderTopColor: color }]}>
      <Ionicons name={icon as any} size={24} color={color} />
      <Text style={[styles.statValue, { color: t.text }]}>{value}</Text>
      <Text style={[styles.statLabel, { color: t.textTertiary }]}>{label}</Text>
    </View>
  );
}

export default function ProfileScreen() {
  const insets  = useSafeAreaInsets();
  const t = useTheme();
  const scheme = useColorScheme();
  const { items } = useItemsStore();
  const { categories } = useCategoriesStore();

  const links  = items.filter((i) => i.type === 'link').length;
  const photos = items.filter((i) => i.type === 'photo').length;
  const notes  = items.filter((i) => i.type === 'note').length;

  const isDark = scheme === 'dark';

  const MENU_ITEMS = [
    { icon: isDark ? 'moon' : 'moon-outline', label: `Mode sombre · ${isDark ? 'Actif' : 'Inactif (système)'}`, color: '#374151', onPress: () => Alert.alert('Mode sombre', 'Le mode sombre suit automatiquement les réglages de votre téléphone.\nActivez-le dans Réglages → Affichage.') },
    { icon: 'lock-closed-outline', label: 'Confidentialité',          color: '#10b981', onPress: () => {} },
    { icon: 'information-circle-outline', label: 'À propos de Grimoire', color: t.textTertiary, onPress: () => Alert.alert('Grimoire', 'Version 1.0.0\nVotre mémoire numérique personnelle.') },
  ];

  return (
    <ScrollView style={[styles.screen, { backgroundColor: t.bg }]}
      contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 40 }]}
      showsVerticalScrollIndicator={false}>
      <View style={[styles.header, { paddingTop: insets.top + 20, backgroundColor: t.surface, borderBottomColor: t.border }]}>
        <View style={[styles.avatar, { backgroundColor: `${t.primary}18` }]}>
          <Text style={styles.avatarEmoji}>📖</Text>
        </View>
        <Text style={[styles.appName, { color: t.text }]}>Grimoire</Text>
        <Text style={[styles.tagline, { color: t.textTertiary }]}>Votre mémoire numérique personnelle</Text>
      </View>

      <View style={styles.statsGrid}>
        <StatCard label="Total"      value={items.length}      icon="archive"       color="#6366f1" />
        <StatCard label="Liens"      value={links}             icon="link"          color="#6366f1" />
        <StatCard label="Photos"     value={photos}            icon="image"         color="#ec4899" />
        <StatCard label="Notes"      value={notes}             icon="document-text" color="#f97316" />
        <StatCard label="Catégories" value={categories.length} icon="folder"        color="#22c55e" />
      </View>

      <View style={[styles.menuSection, { backgroundColor: t.surface }]}>
        {MENU_ITEMS.map((item, i) => (
          <TouchableOpacity key={i} onPress={item.onPress} activeOpacity={0.75}
            style={[styles.menuItem, { borderBottomColor: t.border }, i === MENU_ITEMS.length - 1 && styles.menuItemLast]}>
            <View style={[styles.menuIconBubble, { backgroundColor: `${item.color}15` }]}>
              <Ionicons name={item.icon as any} size={18} color={item.color} />
            </View>
            <Text style={[styles.menuLabel, { color: t.text }]}>{item.label}</Text>
            <Ionicons name="chevron-forward" size={16} color={t.textTertiary} />
          </TouchableOpacity>
        ))}
      </View>

      <Text style={[styles.version, { color: t.borderStrong }]}>Grimoire v1.0.0 · Made with ❤️</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  content: { gap: 20 },
  header: { alignItems: 'center', paddingHorizontal: 20, paddingBottom: 24, borderBottomWidth: 1, gap: 8 },
  avatar: { width: 80, height: 80, borderRadius: 40, alignItems: 'center', justifyContent: 'center', marginBottom: 4 },
  avatarEmoji: { fontSize: 36 },
  appName: { fontSize: 26, fontWeight: '800', letterSpacing: -0.5 },
  tagline: { fontSize: 14, textAlign: 'center' },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, paddingHorizontal: 16 },
  statCard: { flex: 1, minWidth: 80, borderRadius: 14, padding: 14, alignItems: 'center', gap: 6, borderTopWidth: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 4, elevation: 2 },
  statValue: { fontSize: 22, fontWeight: '800' },
  statLabel: { fontSize: 11, fontWeight: '600', textAlign: 'center' },
  menuSection: { marginHorizontal: 16, borderRadius: 16, overflow: 'hidden', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 4, elevation: 2 },
  menuItem: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 14, borderBottomWidth: 1, gap: 12 },
  menuItemLast: { borderBottomWidth: 0 },
  menuIconBubble: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  menuLabel: { flex: 1, fontSize: 15, fontWeight: '500' },
  version: { textAlign: 'center', fontSize: 12, paddingBottom: 8 },
});
