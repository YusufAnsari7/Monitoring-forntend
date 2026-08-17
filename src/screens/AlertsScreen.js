import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Pressable, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AppHeader from '../components/AppHeader';
import BottomNavigation from '../components/BottomNavigation';
import SideDrawer from '../components/SideDrawer';
import { fetchAlerts } from '../api/client';
import { colors } from '../theme';

const filters = ['All', 'Firing', 'Resolved'];
const severities = ['All', 'Critical', 'Warning', 'Info'];

export default function AlertsScreen({ navigation }) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState('All');
  const [severityFilter, setSeverityFilter] = useState('All');
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const loadAlerts = async () => {
      setLoading(true);
      try {
        const params = {
          status: statusFilter === 'All' ? undefined : statusFilter.toLowerCase(),
          severity: severityFilter === 'All' ? undefined : severityFilter.toLowerCase(),
        };
        const response = await fetchAlerts(params);
        if (!isMounted) return;
        setAlerts(response?.alerts ?? []);
      } catch (error) {
        if (!isMounted) return;
        setAlerts([]);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadAlerts();
    return () => {
      isMounted = false;
    };
  }, [statusFilter, severityFilter]);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <View style={styles.container}>
        <AppHeader title="Alerts" subtitle="Service health" onMenuPress={() => setDrawerOpen(true)} />

        <ScrollView style={styles.content} contentContainerStyle={styles.contentPadding}>
          <View style={styles.filterGroup}>
            <Text style={styles.filterLabel}>Status</Text>
            <View style={styles.chipRow}>
              {filters.map((item) => (
                <Pressable
                  key={item}
                  onPress={() => setStatusFilter(item)}
                  style={[styles.chip, statusFilter === item && styles.chipActive]}
                >
                  <Text style={[styles.chipText, statusFilter === item && styles.chipTextActive]}>{item}</Text>
                </Pressable>
              ))}
            </View>
          </View>

          <View style={styles.filterGroup}>
            <Text style={styles.filterLabel}>Severity</Text>
            <View style={styles.chipRow}>
              {severities.map((item) => (
                <Pressable
                  key={item}
                  onPress={() => setSeverityFilter(item)}
                  style={[styles.chip, severityFilter === item && styles.chipActive]}
                >
                  <Text style={[styles.chipText, severityFilter === item && styles.chipTextActive]}>{item}</Text>
                </Pressable>
              ))}
            </View>
          </View>

          {loading ? (
            <View style={styles.loaderWrap}>
              <ActivityIndicator size="small" color={colors.blue} />
            </View>
          ) : alerts.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyTitle}>No alerts</Text>
              <Text style={styles.emptyText}>Your monitored services are currently healthy.</Text>
            </View>
          ) : (
            alerts.map((alert) => {
              const severity = (alert.severity || 'info').toLowerCase();
              const color = severity === 'critical' ? colors.red : severity === 'warning' ? colors.amber : colors.blue;

              return (
                <View key={alert.id || `${alert.name}-${alert.receivedAt}`} style={styles.alertCard}>
                  <View style={styles.cardHeader}>
                    <View style={[styles.severityMark, { backgroundColor: color }]} />
                    <View style={{ flex: 1 }}>
                      <Text style={styles.alertTitle}>{alert.name || alert.summary || 'Alert'}</Text>
                      <Text style={styles.alertSource}>{alert.job || alert.instance || alert.source || 'System'}</Text>
                    </View>
                    <Text style={[styles.severityLabel, { color }]}>{(severity || 'INFO').toUpperCase()}</Text>
                  </View>

                  <Text style={styles.alertMessage}>{alert.summary || alert.description || alert.message || 'No description provided.'}</Text>
                  <Text style={styles.time}>{alert.receivedAt ? new Date(alert.receivedAt).toLocaleString() : alert.startsAt || 'Just now'}</Text>
                </View>
              );
            })
          )}
        </ScrollView>

        <BottomNavigation active="Alerts" onNavigate={(screen) => navigation.navigate(screen)} />

        <SideDrawer
          visible={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          active="Alerts"
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
  filterGroup: { marginTop: 8, marginBottom: 14 },
  filterLabel: {
    color: colors.textMuted,
    fontSize: 11,
    letterSpacing: 1.1,
    textTransform: 'uppercase',
    fontWeight: '700',
    marginBottom: 10,
  },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  chipActive: { backgroundColor: '#101F38', borderColor: 'rgba(90, 168, 255, 0.26)' },
  chipText: { color: colors.textSoft, fontSize: 12, fontWeight: '600' },
  chipTextActive: { color: colors.text },
  alertCard: {
    backgroundColor: colors.surface,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 16,
    marginBottom: 12,
  },
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  severityMark: { width: 10, height: 10, borderRadius: 999, marginRight: 10 },
  alertTitle: { color: colors.text, fontWeight: '700', fontSize: 16 },
  alertSource: { color: colors.textMuted, fontSize: 12, marginTop: 3 },
  severityLabel: { fontSize: 11, fontWeight: '800', letterSpacing: 0.8 },
  alertMessage: { color: colors.textSoft, lineHeight: 20, fontSize: 14 },
  time: { color: colors.textMuted, fontSize: 11, marginTop: 10 },
  loaderWrap: { paddingVertical: 24, alignItems: 'center' },
  emptyState: {
    backgroundColor: colors.surface,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 20,
    marginTop: 8,
  },
  emptyTitle: { color: colors.text, fontSize: 18, fontWeight: '700' },
  emptyText: { color: colors.textMuted, marginTop: 6, lineHeight: 20 },
});
