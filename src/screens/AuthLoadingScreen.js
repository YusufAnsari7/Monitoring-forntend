import React from 'react';
import { View, ActivityIndicator, Text, StyleSheet } from 'react-native';
import { colors } from '../theme';

export default function AuthLoadingScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.logoWrap}>
        <Text style={styles.logo}>M</Text>
      </View>
      <Text style={styles.title}>Monitoring Dashboard</Text>
      <ActivityIndicator size="large" color={colors.blue} style={styles.spinner} />
      <Text style={styles.subtitle}>Checking your session...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
    paddingHorizontal: 24,
  },
  logoWrap: {
    width: 80,
    height: 80,
    borderRadius: 24,
    backgroundColor: 'rgba(90, 168, 255, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(90, 168, 255, 0.24)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
  },
  logo: {
    color: colors.blue,
    fontSize: 32,
    fontWeight: '800',
  },
  title: {
    color: colors.text,
    fontSize: 24,
    fontWeight: '700',
    letterSpacing: -0.4,
  },
  spinner: {
    marginTop: 24,
  },
  subtitle: {
    color: colors.textMuted,
    fontSize: 14,
    marginTop: 12,
  },
});
