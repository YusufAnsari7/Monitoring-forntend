import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Pressable, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../theme';
import PrimaryButton from '../components/PrimaryButton';

export default function AddContainerScreen({ navigation }) {
  const [name, setName] = useState('nginx-prod');
  const [host, setHost] = useState('localhost');
  const [port, setPort] = useState('2375');
  const [type, setType] = useState('TCP');
  const [auth, setAuth] = useState('None');

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <ScrollView style={styles.content} contentContainerStyle={styles.contentPadding}>
        <Pressable onPress={() => navigation.goBack()} style={styles.backLink}>
          <Text style={styles.backText}>← Back</Text>
        </Pressable>

        <Text style={styles.title}>Add Container</Text>
        <Text style={styles.subtitle}>Connect a Docker container to start monitoring.</Text>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Container Name</Text>
          <TextInput value={name} onChangeText={setName} style={styles.input} />
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Docker Host</Text>
          <TextInput value={host} onChangeText={setHost} style={styles.input} />
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Port</Text>
          <TextInput value={port} onChangeText={setPort} keyboardType="numeric" style={styles.input} />
        </View>

        <View style={styles.row}>
          <View style={styles.column}>
            <Text style={styles.label}>Connection Type</Text>
            <Pressable style={styles.selectBox} onPress={() => setType(type === 'TCP' ? 'Socket' : 'TCP')}>
              <Text style={styles.selectText}>{type}</Text>
            </Pressable>
          </View>
          <View style={styles.column}>
            <Text style={styles.label}>Authentication</Text>
            <Pressable style={styles.selectBox} onPress={() => setAuth(auth === 'None' ? 'TLS' : 'None')}>
              <Text style={styles.selectText}>{auth}</Text>
            </Pressable>
          </View>
        </View>

        <View style={styles.statusBox}>
          <Text style={styles.statusLabel}>Connection status</Text>
          <View style={styles.statusRow}>
            <View style={styles.statusDot} />
            <Text style={styles.statusText}>Ready to test</Text>
          </View>
        </View>

        <PrimaryButton label="Connect Container" onPress={() => navigation.navigate('Dashboard')} style={styles.primary} />
        <Pressable style={styles.secondary} onPress={() => navigation.navigate('Dashboard')}>
          <Text style={styles.secondaryText}>Test Connection</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  content: { flex: 1 },
  contentPadding: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 48 },
  backLink: { marginBottom: 12 },
  backText: { color: colors.textSoft, fontSize: 14, fontWeight: '600' },
  title: { color: colors.text, fontSize: 32, fontWeight: '700', letterSpacing: -0.6 },
  subtitle: { color: colors.textMuted, fontSize: 14, marginTop: 8, marginBottom: 24 },
  fieldGroup: { marginBottom: 20 },
  label: { color: colors.textMuted, fontSize: 12, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8, fontWeight: '700' },
  input: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 14,
    color: colors.text,
    fontSize: 16,
  },
  row: { flexDirection: 'row', marginBottom: 20 },
  column: { flex: 1, marginRight: 12 },
  selectBox: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 14,
  },
  selectText: { color: colors.text, fontSize: 15, fontWeight: '600' },
  statusBox: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    padding: 14,
    marginBottom: 22,
  },
  statusLabel: { color: colors.textMuted, fontSize: 11, letterSpacing: 1, textTransform: 'uppercase', fontWeight: '700' },
  statusRow: { flexDirection: 'row', alignItems: 'center', marginTop: 10 },
  statusDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.green, marginRight: 8 },
  statusText: { color: colors.textSoft, fontSize: 14 },
  primary: { marginBottom: 12, borderRadius: 14 },
  secondary: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  secondaryText: { color: colors.text, fontWeight: '700', fontSize: 14 },
});
