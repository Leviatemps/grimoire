import React, { Component, ReactNode } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface Props { children: ReactNode; }
interface State { hasError: boolean; error?: Error; }

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('[Grimoire ErrorBoundary]', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <View style={styles.container}>
          <Ionicons name="warning-outline" size={56} color="#ef4444" />
          <Text style={styles.title}>Une erreur est survenue</Text>
          <Text style={styles.message}>{this.state.error?.message ?? 'Erreur inconnue'}</Text>
          <TouchableOpacity
            style={styles.btn}
            onPress={() => this.setState({ hasError: false, error: undefined })}
          >
            <Text style={styles.btnLabel}>Réessayer</Text>
          </TouchableOpacity>
        </View>
      );
    }
    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1, alignItems: 'center', justifyContent: 'center',
    padding: 32, backgroundColor: '#f8f9fb', gap: 12,
  },
  title: { fontSize: 18, fontWeight: '700', color: '#111827', textAlign: 'center' },
  message: { fontSize: 13, color: '#6b7280', textAlign: 'center', lineHeight: 20 },
  btn: {
    marginTop: 8, paddingHorizontal: 24, paddingVertical: 12,
    borderRadius: 20, backgroundColor: '#6366f1',
  },
  btnLabel: { color: '#fff', fontWeight: '700', fontSize: 14 },
});
