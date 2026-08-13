import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../theme';

export default function ProfileAvatar({ size = 42, showRing = true }) {
  return (
    <View
      style={[
        styles.avatarWrap,
        showRing && styles.avatarRing,
        { width: size, height: size, borderRadius: size / 2 },
      ]}
    >
      <View style={[styles.avatar, { width: size - 7, height: size - 7, borderRadius: (size - 7) / 2 }]}>
        <Text style={[styles.avatarLabel, { fontSize: Math.max(12, size * 0.34) }]}>MJ</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  avatarWrap: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  avatarRing: {
    padding: 2,
    backgroundColor: colors.blue,
    borderWidth: 1,
    borderColor: 'rgba(138, 124, 255, 0.55)',
  },
  avatar: {
    backgroundColor: '#101C32',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.14)',
  },
  avatarLabel: {
    color: colors.text,
    fontWeight: '700',
    letterSpacing: 0.4,
  },
});
