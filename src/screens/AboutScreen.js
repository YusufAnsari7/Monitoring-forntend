import React from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../theme';

export default function AboutScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <ScrollView style={styles.content} contentContainerStyle={styles.contentPadding}>
        <Pressable onPress={() => navigation.goBack()} style={styles.backLink}>
          <Text style={styles.backText}>← Back</Text>
        </Pressable>

        <Text style={styles.title}>About</Text>
        <Text style={styles.subtitle}>Docker monitoring designed for operators and developers.</Text>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Monitor</Text>
          <Text style={styles.body}>A fast, developer-centric observability dashboard for Docker hosts, containers, alerts, metrics, and logs.</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Version</Text>
          <Text style={styles.body}>1.0.0</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  content: { flex: 1 },
  contentPadding: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 40 },
  backLink: { marginBottom: 16 },
  backText: { color: colors.textSoft, fontSize: 14, fontWeight: '600' },
  title: { color: colors.text, fontSize: 30, fontWeight: '700', letterSpacing: -0.5 },
  subtitle: { color: colors.textMuted, fontSize: 14, marginTop: 8, marginBottom: 18 },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 18,
    marginBottom: 14,
  },
  cardTitle: { color: colors.text, fontSize: 18, fontWeight: '700', marginBottom: 8 },
  body: { color: colors.textSoft, fontSize: 14, lineHeight: 22 },
});
