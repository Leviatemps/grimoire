import React, { useEffect, useState } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { initDatabase } from '../src/db/database';
import { useItemsStore } from '../src/stores/itemsStore';
import { useCategoriesStore } from '../src/stores/categoriesStore';
import { ErrorBoundary } from '../src/components/ErrorBoundary';
import { LoadingScreen } from '../src/components/LoadingScreen';

export default function RootLayout() {
  const [ready, setReady] = useState(false);
  const [dbError, setDbError] = useState<string | null>(null);

  const loadItems      = useItemsStore((s) => s.loadItems);
  const loadCategories = useCategoriesStore((s) => s.loadCategories);

  useEffect(() => {
    async function boot() {
      try {
        await initDatabase();
        loadCategories();
        loadItems();
      } catch (e: any) {
        console.error('[boot]', e);
        setDbError(e?.message ?? 'Erreur de base de données');
      } finally {
        setReady(true);
      }
    }
    boot();
  }, []);

  if (!ready) return <LoadingScreen />;

  return (
    <ErrorBoundary>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <StatusBar style="auto" />
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="add/index"       options={{ presentation: 'modal' }} />
          <Stack.Screen name="add/link"        options={{ presentation: 'modal' }} />
          <Stack.Screen name="add/photo"       options={{ presentation: 'modal' }} />
          <Stack.Screen name="add/note"        options={{ presentation: 'modal' }} />
          <Stack.Screen name="category/create"   options={{ presentation: 'modal' }} />
          <Stack.Screen name="category/[id]"     options={{ presentation: 'card'  }} />
          <Stack.Screen name="category/edit/[id]" options={{ presentation: 'modal' }} />
          <Stack.Screen name="item/[id]"       options={{ presentation: 'card'  }} />
          <Stack.Screen name="item/edit/[id]"  options={{ presentation: 'modal' }} />
        </Stack>
      </GestureHandlerRootView>
    </ErrorBoundary>
  );
}
