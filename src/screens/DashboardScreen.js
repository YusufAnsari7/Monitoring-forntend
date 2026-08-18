import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AppHeader from '../components/AppHeader';
import PrimaryButton from '../components/PrimaryButton';
import BottomNavigation from '../components/BottomNavigation';
import SideDrawer from '../components/SideDrawer';
import { fetchAlertStats } from '../api/client';
import { colors, radii } from '../theme';

const defaultSummary = { totalContainers: 0, running: 0, stopped: 0, alerts: 0 };

export default function DashboardScreen({ navigation }) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [summary, setSummary] = useState(defaultSummary);

  useEffect(() => {
    let isMounted = true;

    const loadSummary = async () => {
      try {
        const stats = await fetchAlertStats();
        if (!isMounted) return;

        setSummary({
          totalContainers: Number(stats?.total ?? 0),
          running: Number(stats?.firing ?? 0),
          stopped: Number(stats?.resolved ?? 0),
          alerts: Number(stats?.total ?? 0),
        });
      } catch (error) {
        if (!isMounted) return;
        setSummary(defaultSummary);
      }
    };

    loadSummary();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <View style={styles.container}>
        <AppHeader
          title="Dashboard"
          subtitle="Monitor. Analyze. Act."
          onMenuPress={() => setDrawerOpen(true)}
        />

        <ScrollView style={styles.content} contentContainerStyle={styles.contentPadding} showsVerticalScrollIndicator={false}>
          <View style={styles.heroShell}>
            <View style={styles.infrastructureVisual}>
              <View style={styles.nodeCore}>
                <Text style={styles.nodeLabel}>Docker</Text>
              </View>

              <View style={[styles.nodeOrb, styles.nodeOrbTop]} />
              <View style={[styles.nodeOrb, styles.nodeOrbRight]} />
              <View style={[styles.nodeOrb, styles.nodeOrbBottom]} />
              <View style={[styles.nodeOrb, styles.nodeOrbLeft]} />

              <View style={[styles.connector, styles.connectorTop]} />
              <View style={[styles.connector, styles.connectorRight]} />
              <View style={[styles.connector, styles.connectorBottom]} />
              <View style={[styles.connector, styles.connectorLeft]} />
            </View>

            <Text style={styles.emptyTitle}>No containers added yet.</Text>
            <Text style={styles.emptyBody}>Connect your infrastructure to start monitoring workloads, health, and performance in real time.</Text>

            <PrimaryButton
              label="+ Add Container"
              onPress={() => navigation.navigate('AddContainer')}
              style={styles.primaryButton}
            />
          </View>

          <View style={styles.summarySection}>
            <Text style={styles.sectionLabel}>Overview</Text>
            <View style={styles.summaryGrid}>
              <MetricTile label="Containers" value={String(summary.totalContainers)} tone="blue" />
              <MetricTile label="Running" value={String(summary.running)} tone="green" />
              <MetricTile label="Stopped" value={String(summary.stopped)} tone="amber" />
              <MetricTile label="Alerts" value={String(summary.alerts)} tone="red" />
            </View>
          </View>

          <View style={styles.quickLinks}>
            <QuickAction title="Real-time Metrics" subtitle="CPU · Memory · Network" onPress={() => navigation.navigate('Metrics')} />
            <QuickAction title="Active Alerts" subtitle={`${summary.alerts} issue${summary.alerts === 1 ? '' : 's'} reported`} onPress={() => navigation.navigate('Alerts')} />
          </View>
        </ScrollView>

        <BottomNavigation active="Dashboard" onNavigate={(screen) => navigation.navigate(screen)} />

        <SideDrawer
          visible={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          active="Dashboard"
          onNavigate={(screen) => navigation.navigate(screen)}
        />
      </View>
    </SafeAreaView>
  );
}

function MetricTile({ label, value, tone }) {
  const palette = {
    blue: { bg: 'rgba(90, 168, 255, 0.1)', dot: colors.blue },
    green: { bg: 'rgba(35, 198, 122, 0.1)', dot: colors.green },
    amber: { bg: 'rgba(245, 185, 66, 0.1)', dot: colors.amber },
    red: { bg: 'rgba(255, 92, 110, 0.1)', dot: colors.red },
  };

  const item = palette[tone] || palette.blue;

  return (
    <View style={[styles.metricTile, { backgroundColor: item.bg }]}> 
      <View style={[styles.metricDot, { backgroundColor: item.dot }]} />
      <Text style={styles.metricLabel}>{label}</Text>
      <Text style={styles.metricValue}>{value}</Text>
    </View>
  );
}

function QuickAction({ title, subtitle, onPress }) {
  return (
    <Pressable style={styles.quickAction} onPress={onPress}>
      <Text style={styles.quickActionTitle}>{title}</Text>
      <Text style={styles.quickActionSubtitle}>{subtitle}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
  },
  contentPadding: {
    paddingHorizontal: 20,
    paddingBottom: 120,
  },
  heroShell: {
    backgroundColor: colors.surface,
    borderRadius: radii.xl,
    borderWidth: 1,
    borderColor: colors.border,
    paddingTop: 26,
    paddingBottom: 24,
    paddingHorizontal: 20,
    marginTop: 8,
  },
  infrastructureVisual: {
    height: 220,
    marginBottom: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nodeCore: {
    width: 116,
    height: 116,
    borderRadius: 30,
    backgroundColor: '#101D31',
    borderWidth: 1,
    borderColor: 'rgba(90, 168, 255, 0.18)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.blue,
    shadowOpacity: 0.22,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 0 },
  },
  nodeLabel: {
    fontSize: 18,
    letterSpacing: 0.8,
    color: colors.text,
    fontWeight: '700',
  },
  nodeOrb: {
    position: 'absolute',
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: colors.violet,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.14)',
  },
  nodeOrbTop: {
    top: 32,
    left: '50%',
    marginLeft: -9,
  },
  nodeOrbRight: {
    right: 42,
    top: '50%',
    marginTop: -9,
  },
  nodeOrbBottom: {
    bottom: 26,
    left: '50%',
    marginLeft: -9,
  },
  nodeOrbLeft: {
    left: 42,
    top: '50%',
    marginTop: -9,
  },
  connector: {
    position: 'absolute',
    height: 2,
    backgroundColor: 'rgba(138, 124, 255, 0.28)',
  },
  connectorTop: {
    top: 70,
    left: '50%',
    width: 80,
    marginLeft: -40,
  },
  connectorRight: {
    top: '50%',
    right: 58,
    width: 78,
    transform: [{ rotate: '90deg' }],
  },
  connectorBottom: {
    bottom: 64,
    left: '50%',
    width: 80,
    marginLeft: -40,
  },
  connectorLeft: {
    top: '50%',
    left: 58,
    width: 78,
    transform: [{ rotate: '90deg' }],
  },
  emptyTitle: {
    color: colors.text,
    fontSize: 26,
    fontWeight: '700',
    letterSpacing: -0.4,
    textAlign: 'center',
    marginBottom: 8,
  },
  emptyBody: {
    color: colors.textMuted,
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
    marginBottom: 22,
  },
  primaryButton: {
    width: '100%',
    marginTop: 6,
    borderRadius: 16,
  },
  summarySection: {
    marginTop: 22,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1.1,
    color: colors.textMuted,
    textTransform: 'uppercase',
    marginBottom: 12,
  },
  summaryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 10,
  },
  metricTile: {
    width: '48%',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 14,
    minHeight: 92,
  },
  metricDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginBottom: 10,
  },
  metricLabel: {
    color: colors.textMuted,
    fontSize: 11,
    textTransform: 'uppercase',
    letterSpacing: 0.9,
    fontWeight: '700',
  },
  metricValue: {
    color: colors.text,
    fontSize: 24,
    fontWeight: '700',
    letterSpacing: -0.4,
    marginTop: 8,
  },
  quickLinks: {
    marginTop: 24,
    gap: 12,
  },
  quickAction: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  quickActionTitle: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '700',
  },
  quickActionSubtitle: {
    color: colors.textMuted,
    fontSize: 12,
    marginTop: 4,
  },
});
