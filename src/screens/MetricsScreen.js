import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AppHeader from '../components/AppHeader';
import BottomNavigation from '../components/BottomNavigation';
import SideDrawer from '../components/SideDrawer';
import { colors } from '../theme';

const ranges = ['1H', '6H', '24H', '7D'];

export default function MetricsScreen({ navigation }) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [range, setRange] = useState('24H');

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
            <MetricCard label="CPU" value="42%" detail="Avg 31%" accent={colors.blue} />
            <MetricCard label="Memory" value="68%" detail="2.6 GB" accent={colors.violet} />
            <MetricCard label="Network" value="5.2 MB/s" detail="+12%" accent={colors.green} />
            <MetricCard label="Disk" value="61%" detail="39 GB" accent={colors.amber} />
          </View>

          <View style={styles.chartCard}>
            <View style={styles.chartHeader}>
              <Text style={styles.chartTitle}>CPU Usage</Text>
              <Text style={styles.chartValue}>42%</Text>
            </View>
            <View style={styles.chartMock}>
              <View style={styles.chartLine} />
            </View>
            <View style={styles.chartMetaRow}>
              <Text style={styles.chartMeta}>Average 31%</Text>
              <Text style={styles.chartMeta}>Peak 68%</Text>
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
