import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AppHeader from '../components/AppHeader';
import BottomNavigation from '../components/BottomNavigation';
import SideDrawer from '../components/SideDrawer';
import { containers } from '../mock/mockData';
import { colors } from '../theme';

const statusColors = {
  running: colors.green,
  warning: colors.amber,
  critical: colors.red,
  stopped: colors.textMuted,
};

export default function ContainersScreen({ navigation }) {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <View style={styles.container}>
        <AppHeader title="Containers" subtitle="Live inventory" onMenuPress={() => setDrawerOpen(true)} />

        <ScrollView style={styles.content} contentContainerStyle={styles.contentPadding}>
          {containers.map((container) => (
            <Pressable key={container.id} style={styles.card} onPress={() => navigation.navigate('Profile')}>
              <View style={styles.cardTop}>
                <View style={styles.nameWrap}>
                  <View style={[styles.statusDot, { backgroundColor: statusColors[container.status] || colors.textMuted }]} />
                  <Text style={styles.name}>{container.name}</Text>
                </View>
                <Text style={styles.arrow}>›</Text>
              </View>

              <Text style={styles.image}>{container.image}</Text>

              <View style={styles.metaRow}>
                <Text style={styles.meta}>CPU {container.cpu}%</Text>
                <Text style={styles.meta}>RAM {container.memory} MB</Text>
              </View>

              <View style={styles.bottomRow}>
                <Text style={styles.statusText}>{container.status}</Text>
                <Text style={styles.uptime}>{container.uptime}</Text>
              </View>
            </Pressable>
          ))}
        </ScrollView>

        <BottomNavigation active="Containers" onNavigate={(screen) => navigation.navigate(screen)} />

        <SideDrawer
          visible={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          active="Containers"
          onNavigate={(screen) => navigation.navigate(screen)}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  container: { flex: 1, backgroundColor: colors.background },
  content: { flex: 1 },
  contentPadding: { paddingHorizontal: 20, paddingBottom: 120 },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 16,
    marginTop: 12,
  },
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  nameWrap: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  statusDot: { width: 8, height: 8, borderRadius: 4, marginRight: 10 },
  name: { color: colors.text, fontSize: 17, fontWeight: '700' },
  arrow: { color: colors.textMuted, fontSize: 26, marginLeft: 10 },
  image: { color: colors.textMuted, fontSize: 12, marginTop: 8, marginBottom: 14 },
  metaRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  meta: { color: colors.textSoft, fontSize: 12 },
  bottomRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  statusText: { color: colors.text, fontSize: 12, textTransform: 'capitalize', fontWeight: '700' },
  uptime: { color: colors.textMuted, fontSize: 12 },
});
