// src/components/Badge.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const COLORS = {
  firing: '#DC2626',
  resolved: '#16A34A',
  critical: '#DC2626',
  warning: '#D97706',
  info: '#2563EB',
  default: '#6B7280',
};

export default function Badge({ label }) {
  const key = (label || '').toLowerCase();
  const color = COLORS[key] || COLORS.default;

  return (
    <View style={[styles.badge, { backgroundColor: `${color}1A`, borderColor: color }]}>
      <Text style={[styles.text, { color }]}>{label ? label.toUpperCase() : 'UNKNOWN'}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  text: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});
