// src/components/AlertCard.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Badge from './Badge';

function formatTime(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  return d.toLocaleString();
}

export default function AlertCard({ alert }) {
  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <Text style={styles.name} numberOfLines={1}>
          {alert.name || 'Unnamed alert'}
        </Text>
        <Badge label={alert.status} />
      </View>

      <View style={styles.badgeRow}>
        {!!alert.severity && <Badge label={alert.severity} />}
        {!!alert.job && <Text style={styles.meta}>job: {alert.job}</Text>}
        {!!alert.instance && <Text style={styles.meta}>{alert.instance}</Text>}
      </View>

      {!!alert.summary && <Text style={styles.summary}>{alert.summary}</Text>}
      {!!alert.description && <Text style={styles.description}>{alert.description}</Text>}

      <Text style={styles.timestamp}>
        {alert.status === 'resolved' && alert.endsAt
          ? `Resolved ${formatTime(alert.endsAt)}`
          : `Started ${formatTime(alert.startsAt)}`}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 14,
    marginHorizontal: 16,
    marginVertical: 6,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  name: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
    flex: 1,
    marginRight: 8,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
    flexWrap: 'wrap',
  },
  meta: {
    fontSize: 12,
    color: '#6B7280',
  },
  summary: {
    fontSize: 13,
    fontWeight: '600',
    color: '#374151',
    marginTop: 2,
  },
  description: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 2,
  },
  timestamp: {
    fontSize: 11,
    color: '#9CA3AF',
    marginTop: 8,
  },
});
