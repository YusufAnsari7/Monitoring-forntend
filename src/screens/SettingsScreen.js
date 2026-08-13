import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../theme';

export default function SettingsScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <ScrollView style={styles.content} contentContainerStyle={styles.contentPadding}>
        <Pressable onPress={() => navigation.goBack()} style={styles.backLink}>
          <Text style={styles.backText}>← Back</Text>
        </Pressable>

        <Text style={styles.title}>Settings</Text>

        <View style={styles.group}>
          <SettingRow label="Auto refresh" value="Enabled" />
          <SettingRow label="Refresh interval" value="15s" />
          <SettingRow label="Dark theme" value="On" />
          <SettingRow label="Log retention" value="7 days" />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function SettingRow({ label, value }) {
  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  content: { flex: 1 },
  contentPadding: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 40 },
  backLink: { marginBottom: 12 },
  backText: { color: colors.textSoft, fontSize: 14, fontWeight: '600' },
  title: { color: colors.text, fontSize: 30, fontWeight: '700', letterSpacing: -0.6 },
  group: { marginTop: 18 },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 14,
    marginBottom: 10,
  },
  label: { color: colors.textSoft, fontSize: 14 },
  value: { color: colors.text, fontWeight: '700', fontSize: 12 },
});
