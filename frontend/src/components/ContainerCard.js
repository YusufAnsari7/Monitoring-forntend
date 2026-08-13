// src/components/ContainerCard.js
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';

const STATE_COLORS = {
  running: '#16A34A',
  exited: '#6B7280',
  paused: '#D97706',
  restarting: '#2563EB',
  dead: '#DC2626',
};

export default function ContainerCard({ container, onAction }) {
  const [busyAction, setBusyAction] = useState(null);
  const color = STATE_COLORS[container.state] || '#6B7280';
  const isRunning = container.state === 'running';

  const runAction = async (action) => {
    setBusyAction(action);
    try {
      await onAction(container.id, action);
    } catch (e) {
      Alert.alert('Action failed', e.message || `Could not ${action} container`);
    } finally {
      setBusyAction(null);
    }
  };

  const confirmAndRun = (action, verb) => {
    Alert.alert(
      `${verb} container?`,
      `${verb} "${container.names[0] || container.shortId}"`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: verb, style: action === 'stop' ? 'destructive' : 'default', onPress: () => runAction(action) },
      ]
    );
  };

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <View style={{ flex: 1 }}>
          <Text style={styles.name} numberOfLines={1}>
            {container.names[0] || container.shortId}
          </Text>
          <Text style={styles.image} numberOfLines={1}>{container.image}</Text>
        </View>
        <View style={[styles.stateBadge, { backgroundColor: `${color}1A`, borderColor: color }]}>
          <Text style={[styles.stateText, { color }]}>{container.state.toUpperCase()}</Text>
        </View>
      </View>

      <Text style={styles.status}>{container.status}</Text>

      <View style={styles.actionRow}>
        {isRunning ? (
          <>
            <ActionButton
              label="Restart"
              busy={busyAction === 'restart'}
              onPress={() => confirmAndRun('restart', 'Restart')}
            />
            <ActionButton
              label="Stop"
              danger
              busy={busyAction === 'stop'}
              onPress={() => confirmAndRun('stop', 'Stop')}
            />
          </>
        ) : (
          <ActionButton
            label="Start"
            primary
            busy={busyAction === 'start'}
            onPress={() => runAction('start')}
          />
        )}
      </View>
    </View>
  );
}

function ActionButton({ label, onPress, busy, danger, primary }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={busy}
      style={[
        styles.actionBtn,
        danger && styles.actionBtnDanger,
        primary && styles.actionBtnPrimary,
      ]}
      activeOpacity={0.7}
    >
      {busy ? (
        <ActivityIndicator size="small" color={danger || primary ? '#FFFFFF' : '#111827'} />
      ) : (
        <Text
          style={[
            styles.actionBtnText,
            (danger || primary) && styles.actionBtnTextLight,
          ]}
        >
          {label}
        </Text>
      )}
    </TouchableOpacity>
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
  headerRow: { flexDirection: 'row', alignItems: 'flex-start' },
  name: { fontSize: 15, fontWeight: '700', color: '#111827' },
  image: { fontSize: 12, color: '#9CA3AF', marginTop: 1 },
  stateBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    borderWidth: 1,
    marginLeft: 8,
  },
  stateText: { fontSize: 11, fontWeight: '700' },
  status: { fontSize: 12, color: '#6B7280', marginTop: 6 },
  actionRow: { flexDirection: 'row', gap: 8, marginTop: 10 },
  actionBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    minWidth: 72,
    alignItems: 'center',
  },
  actionBtnDanger: { backgroundColor: '#DC2626', borderColor: '#DC2626' },
  actionBtnPrimary: { backgroundColor: '#16A34A', borderColor: '#16A34A' },
  actionBtnText: { fontSize: 13, fontWeight: '700', color: '#374151' },
  actionBtnTextLight: { color: '#FFFFFF' },
});
