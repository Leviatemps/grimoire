import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';

export function LoadingScreen() {
  const pulse = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 0.5, duration: 800, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 1,   duration: 800, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  return (
    <View style={styles.container}>
      <Animated.Text style={[styles.logo, { opacity: pulse }]}>🔮</Animated.Text>
      <Text style={styles.title}>Grimoire</Text>
      <Text style={styles.sub}>Chargement de votre mémoire…</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, alignItems: 'center', justifyContent: 'center',
    backgroundColor: '#fff', gap: 10,
  },
  logo: { fontSize: 56 },
  title: { fontSize: 24, fontWeight: '800', color: '#111827', letterSpacing: -0.5 },
  sub: { fontSize: 14, color: '#9ca3af' },
});
