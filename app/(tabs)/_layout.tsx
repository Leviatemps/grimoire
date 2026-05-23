import React, { useRef } from 'react';
import { Tabs, router } from 'expo-router';
import { View, StyleSheet, Platform, Pressable, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../src/theme';

function AddButton() {
  const scale = useRef(new Animated.Value(1)).current;
  const onPressIn  = () => Animated.spring(scale, { toValue: 0.9, useNativeDriver: true }).start();
  const onPressOut = () => Animated.spring(scale, { toValue: 1,   useNativeDriver: true }).start();
  return (
    <Pressable onPress={() => router.push('/add')} onPressIn={onPressIn} onPressOut={onPressOut}>
      <Animated.View style={[styles.addButton, { transform: [{ scale }] }]}>
        <Ionicons name="add" size={28} color="#fff" />
      </Animated.View>
    </Pressable>
  );
}

export default function TabsLayout() {
  const insets = useSafeAreaInsets();
  const t = useTheme();
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: t.tabBar,
          borderTopColor: t.tabBarBorder,
          borderTopWidth: 1,
          height: 60 + insets.bottom,
          paddingBottom: insets.bottom,
          ...Platform.select({
            ios:     { shadowColor: '#000', shadowOffset: { width: 0, height: -2 }, shadowOpacity: 0.05, shadowRadius: 8 },
            android: { elevation: 8 },
          }),
        },
        tabBarActiveTintColor:   t.primary,
        tabBarInactiveTintColor: t.textTertiary,
        tabBarLabelStyle: styles.tabLabel,
        tabBarShowLabel: true,
      }}
    >
      <Tabs.Screen name="index"       options={{ title: 'Accueil',   tabBarIcon: ({ color, size }) => <Ionicons name="home"   size={size} color={color} /> }} />
      <Tabs.Screen name="categories"  options={{ title: 'Catégories',tabBarIcon: ({ color, size }) => <Ionicons name="folder" size={size} color={color} /> }} />
      <Tabs.Screen name="add-placeholder" options={{ title: '', tabBarIcon: () => null, tabBarButton: () => <View style={styles.addContainer}><AddButton /></View> }}
        listeners={{ tabPress: (e) => { e.preventDefault(); router.push('/add'); } }}
      />
      <Tabs.Screen name="search"  options={{ title: 'Recherche', tabBarIcon: ({ color, size }) => <Ionicons name="search" size={size} color={color} /> }} />
      <Tabs.Screen name="profile" options={{ title: 'Profil',    tabBarIcon: ({ color, size }) => <Ionicons name="person" size={size} color={color} /> }} />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabLabel: { fontSize: 11, fontWeight: '600', marginTop: 2 },
  addContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', top: -12 },
  addButton: { width: 56, height: 56, borderRadius: 28, backgroundColor: '#6366f1', alignItems: 'center', justifyContent: 'center', shadowColor: '#6366f1', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.4, shadowRadius: 8, elevation: 6 },
});
