import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../theme';

interface EmptyStateProps { icon: string; title: string; subtitle: string; }

export function EmptyState({ icon, title, subtitle }: EmptyStateProps) {
  const t = useTheme();
  return (
    <View style={styles.container}>
      <View style={[styles.iconBubble, { backgroundColor: t.surfaceAlt }]}>
        <Ionicons name={icon as any} size={36} color={t.textTertiary} />
      </View>
      <Text style={[styles.title, { color: t.text }]}>{title}</Text>
      <Text style={[styles.subtitle, { color: t.textTertiary }]}>{subtitle}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center', paddingTop: 60, paddingHorizontal: 32, gap: 12 },
  iconBubble: { width: 80, height: 80, borderRadius: 40, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 18, fontWeight: '700', textAlign: 'center' },
  subtitle: { fontSize: 14, textAlign: 'center', lineHeight: 20 },
});
