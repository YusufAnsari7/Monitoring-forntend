import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Pressable, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AppHeader from '../components/AppHeader';
import BottomNavigation from '../components/BottomNavigation';
import SideDrawer from '../components/SideDrawer';
import { logLines } from '../mock/mockData';
import { colors } from '../theme';

export default function LogsScreen({ navigation }) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [query, setQuery] = useState('');

  const filtered = logLines.filter((line) => line.toLowerCase().includes(query.toLowerCase()));

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <View style={styles.container}>
        <AppHeader title="Logs" subtitle="Container stream" onMenuPress={() => setDrawerOpen(true)} />

        <View style={styles.searchWrap}>
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Search logs…"
            placeholderTextColor={colors.textMuted}
            style={styles.input}
          />
        </View>

        <ScrollView style={styles.content} contentContainerStyle={styles.contentPadding}>
          <View style={styles.terminal}>
            {filtered.map((line, index) => (
              <Text key={`${line}-${index}`} style={styles.logLine}>{line}</Text>
            ))}
          </View>
        </ScrollView>

        <BottomNavigation active="Logs" onNavigate={(screen) => navigation.navigate(screen)} />

        <SideDrawer
          visible={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          active="Logs"
          onNavigate={(screen) => navigation.navigate(screen)}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  container: { flex: 1, backgroundColor: colors.background },
  searchWrap: { paddingHorizontal: 20, marginTop: 6 },
  input: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    color: colors.text,
    fontSize: 14,
  },
  content: { flex: 1 },
  contentPadding: { paddingHorizontal: 20, paddingBottom: 120 },
  terminal: {
    marginTop: 16,
    backgroundColor: '#07111B',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 14,
  },
  logLine: {
    color: '#B8D7FF',
    fontSize: 12,
    lineHeight: 22,
    fontFamily: 'monospace',
  },
});
