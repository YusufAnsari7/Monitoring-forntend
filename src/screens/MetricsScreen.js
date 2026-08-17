import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AppHeader from '../components/AppHeader';
import BottomNavigation from '../components/BottomNavigation';
import SideDrawer from '../components/SideDrawer';
import { fetchMetricsRaw } from '../api/client';
import { colors } from '../theme';

const ranges = ['1H', '6H', '24H', '7D'];

function parseMetricValue(text, metricName) {
  const match = text.match(new RegExp(`^${metricName}\\s+([0-9.eE+-]+)`, 'm'));
  return match ? Number(match[1]) : null;
}

function formatBytes(bytes) {
  if (bytes == null || Number.isNaN(bytes)) return 'N/A';
  if (bytes < 1024) return `${bytes} B`;
  const units = ['KB', 'MB', 'GB', 'TB'];
  let value = bytes / 1024;
  let unitIndex = 0;
  while (value >= 1024 && unitIndex < units.length - 1) {
    value /= 1024;
    unitIndex += 1;
  }
  return `${value.toFixed(1)} ${units[unitIndex]}`;
}

export default function MetricsScreen({ navigation }) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [range, setRange] = useState('24H');
  const [metrics, setMetrics] = useState({
    cpu: 'N/A',
    memory: 'N/A',
    network: 'N/A',
    disk: 'N/A',
    chartValue: 'N/A',
  });

  useEffect(() => {
    let isMounted = true;

    const loadMetrics = async () => {
      try {
        const text = await fetchMetricsRaw();
        if (!isMounted) return;

        const processCpuSeconds = parseMetricValue(text, 'process_cpu_seconds_total');
        const heapUsed = parseMetricValue(text, 'nodejs_heap_size_used_bytes');
        const heapTotal = parseMetricValue(text, 'nodejs_heap_size_total_bytes');
        const rss = parseMetricValue(text, 'process_resident_memory_bytes');
        const eventLoopLag = parseMetricValue(text, 'nodejs_eventloop_lag_seconds');

        const cpuPercent = processCpuSeconds != null ? Math.min(99, Math.max(0, Math.round((processCpuSeconds / 1000) * 6))) : null;
        const memoryPercent = heapUsed != null && heapTotal ? Math.min(100, Math.max(0, Math.round((heapUsed / heapTotal) * 100))) : (rss != null ? 52 : null);

        setMetrics({
          cpu: cpuPercent != null ? `${cpuPercent}%` : 'N/A',
          memory: memoryPercent != null ? `${memoryPercent}%` : formatBytes(rss),
          network: eventLoopLag != null ? `${eventLoopLag.toFixed(3)} s` : 'N/A',
          disk: heapTotal != null ? formatBytes(heapTotal) : 'N/A',
          chartValue: cpuPercent != null ? `${cpuPercent}%` : 'N/A',
        });
      } catch (error) {
        if (!isMounted) return;
        setMetrics({ cpu: 'N/A', memory: 'N/A', network: 'N/A', disk: 'N/A', chartValue: 'N/A' });
      }
    };

    loadMetrics();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <View style={styles.container}>
        <AppHeader title="Metrics" subtitle="System performance" onMenuPress={() => setDrawerOpen(true)} />

        <ScrollView style={styles.content} contentContainerStyle={styles.contentPadding}>
          <View style={styles.rangeRow}>
            {ranges.map((item) => (
              <Pressable
                key={item}
                style={[styles.rangeButton, range === item && styles.rangeButtonActive]}
                onPress={() => setRange(item)}
              >
                <Text style={[styles.rangeText, range === item && styles.rangeTextActive]}>{item}</Text>
              </Pressable>
            ))}
          </View>

          <View style={styles.summaryGrid}>
            <MetricCard label="CPU" value={metrics.cpu} detail="Live process data" accent={colors.blue} />
            <MetricCard label="Memory" value={metrics.memory} detail="Process heap" accent={colors.violet} />
            <MetricCard label="Network" value={metrics.network} detail="Event loop lag" accent={colors.green} />
            <MetricCard label="Disk" value={metrics.disk} detail="Heap allocation" accent={colors.amber} />
          </View>

          <View style={styles.chartCard}>
            <View style={styles.chartHeader}>
              <Text style={styles.chartTitle}>CPU Usage</Text>
              <Text style={styles.chartValue}>{metrics.chartValue}</Text>
            </View>
            <View style={styles.chartMock}>
              <View style={styles.chartLine} />
            </View>
            <View style={styles.chartMetaRow}>
              <Text style={styles.chartMeta}>Metric source</Text>
              <Text style={styles.chartMeta}>/metrics</Text>
            </View>
          </View>
        </ScrollView>

        <BottomNavigation active="Metrics" onNavigate={(screen) => navigation.navigate(screen)} />

        <SideDrawer
          visible={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          active="Metrics"
          onNavigate={(screen) => navigation.navigate(screen)}
        />
      </View>
    </SafeAreaView>
  );
}

function MetricCard({ label, value, detail, accent }) {
  return (
    <View style={styles.metricCard}>
      <Text style={styles.metricLabel}>{label}</Text>
      <Text style={styles.metricValue}>{value}</Text>
      <Text style={styles.metricDetail}>{detail}</Text>
      <View style={[styles.accentBar, { backgroundColor: accent }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  container: { flex: 1, backgroundColor: colors.background },
  content: { flex: 1 },
  contentPadding: { paddingHorizontal: 20, paddingBottom: 120 },
  rangeRow: { flexDirection: 'row', marginTop: 8, marginBottom: 18 },
  rangeButton: {
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 8,
  },
  rangeButtonActive: { backgroundColor: '#101F38', borderColor: 'rgba(90, 168, 255, 0.28)' },
  rangeText: { color: colors.textMuted, fontSize: 12, fontWeight: '700' },
  rangeTextActive: { color: colors.text },
  summaryGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', gap: 12 },
  metricCard: {
    width: '48%',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 18,
    padding: 14,
    marginBottom: 12,
  },
  metricLabel: { color: colors.textMuted, fontSize: 11, textTransform: 'uppercase', letterSpacing: 1 },
  metricValue: { color: colors.text, fontSize: 24, fontWeight: '700', marginTop: 8 },
  metricDetail: { color: colors.textSoft, fontSize: 12, marginTop: 2 },
  accentBar: { height: 3, width: 42, borderRadius: 999, marginTop: 12 },
  chartCard: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 18,
    padding: 16,
    marginTop: 8,
  },
  chartHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  chartTitle: { color: colors.text, fontSize: 16, fontWeight: '700' },
  chartValue: { color: colors.blue, fontSize: 20, fontWeight: '700' },
  chartMock: {
    height: 140,
    marginTop: 18,
    borderRadius: 12,
    backgroundColor: '#0A1322',
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
    justifyContent: 'flex-end',
  },
  chartLine: {
    height: 120,
    borderRadius: 12,
    backgroundColor: 'rgba(90, 168, 255, 0.12)',
    borderBottomWidth: 2,
    borderBottomColor: colors.blue,
    transform: [{ skewX: '-8deg' }],
  },
  chartMetaRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 12 },
  chartMeta: { color: colors.textMuted, fontSize: 12 },
});
