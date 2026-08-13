import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../theme';
import ProfileAvatar from '../components/ProfileAvatar';
import { supabase, formatAuthError } from '../lib/supabase';
import { fetchCurrentProfile, getDisplayProfile } from '../lib/userProfile';

export default function ProfileScreen({ navigation }) {
  const [loading, setLoading] = useState(true);
  const [profileState, setProfileState] = useState({
    fullName: 'User',
    email: 'No email available',
    avatarUrl: null,
    userId: 'N/A',
  });

  useEffect(() => {
    let isMounted = true;

    const loadProfile = async () => {
      setLoading(true);
      const { user, profile, error } = await fetchCurrentProfile();
      if (!isMounted) {
        return;
      }

      if (error) {
        Alert.alert('Profile unavailable', formatAuthError(error));
      }

      const display = getDisplayProfile(user, profile);
      setProfileState(display);
      setLoading(false);
    };

    loadProfile();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      Alert.alert('Logout failed', formatAuthError(error));
      return;
    }

    navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <ScrollView style={styles.content} contentContainerStyle={styles.contentPadding}>
        <Pressable onPress={() => navigation.goBack()} style={styles.backLink}>
          <Text style={styles.backText}>← Back</Text>
        </Pressable>

        <View style={styles.headerCard}>
          <ProfileAvatar size={72} />
          {loading ? (
            <ActivityIndicator size="small" color={colors.blue} style={styles.loader} />
          ) : (
            <>
              <Text style={styles.name}>{profileState.fullName}</Text>
              <Text style={styles.role}>{profileState.email}</Text>
            </>
          )}
          <View style={styles.statusRow}>
            <View style={styles.statusDot} />
            <Text style={styles.statusText}>Connected</Text>
          </View>
        </View>

        <View style={styles.listGroup}>
          <SettingRow label="User ID" value={profileState.userId} />
          <SettingRow label="Email" value={profileState.email} />
          <SettingRow label="Docker hosts" value="3 connected" />
          <SettingRow label="Notifications" value="Enabled" />
          <SettingRow label="Theme" value="Dark" />
          <SettingRow label="Security" value="2FA active" />
          <SettingRow label="About" value="Monitor v1.0.0" />
        </View>

        <Pressable style={styles.logout} onPress={handleLogout}>
          <Text style={styles.logoutText}>Logout</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

function SettingRow({ label, value }) {
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={styles.rowValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  content: { flex: 1 },
  contentPadding: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 40 },
  backLink: { marginBottom: 16 },
  backText: { color: colors.textSoft, fontSize: 14, fontWeight: '600' },
  headerCard: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 22,
    padding: 20,
    alignItems: 'center',
  },
  name: { color: colors.text, fontSize: 22, fontWeight: '700', marginTop: 16 },
  role: { color: colors.textMuted, fontSize: 13, marginTop: 6 },
  statusRow: { flexDirection: 'row', alignItems: 'center', marginTop: 14 },
  statusDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.green, marginRight: 8 },
  statusText: { color: colors.green, fontWeight: '700', fontSize: 12 },
  listGroup: { marginTop: 18 },
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
  rowLabel: { color: colors.textSoft, fontSize: 14 },
  rowValue: { color: colors.text, fontWeight: '700', fontSize: 12 },
  logout: {
    marginTop: 20,
    backgroundColor: 'rgba(255, 92, 110, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255, 92, 110, 0.18)',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
  },
  logoutText: { color: '#FF9AA6', fontWeight: '700', fontSize: 15 },
});
