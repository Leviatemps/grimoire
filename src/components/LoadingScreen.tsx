import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { useTheme } from '../theme';

export function LoadingScreen() {
  const t = useTheme();
  const pulse = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 0.6, duration: 800, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 1,   duration: 800, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  return (
    <View style={[styles.container, { backgroundColor: t.bg }]}>
      <Animated.Text style={[styles.logo, { opacity: pulse }]}>📖</Animated.Text>
      <Text style={[styles.label, { color: t.textTertiary }]}>Grimoire</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 16 },
  logo: { fontSize: 64 },
  label: { fontSize: 18, fontWeight: '700', letterSpacing: 1 },
});
