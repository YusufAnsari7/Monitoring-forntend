import React from 'react';
import { Pressable, Text, StyleSheet } from 'react-native';
import { colors, shadows } from '../theme';

export default function PrimaryButton({ label, onPress, style, textStyle, compact = false }) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        compact && styles.buttonCompact,
        pressed && styles.buttonPressed,
        style,
      ]}
      android_ripple={{ color: 'rgba(255,255,255,0.12)' }}
    >
      <Text style={[styles.text, textStyle]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#5AA8FF',
    borderRadius: 14,
    paddingVertical: 16,
    paddingHorizontal: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(90, 168, 255, 0.32)',
    ...shadows.subtle,
  },
  buttonCompact: {
    paddingVertical: 12,
    paddingHorizontal: 14,
  },
  buttonPressed: {
    transform: [{ scale: 0.988 }],
  },
  text: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
});
