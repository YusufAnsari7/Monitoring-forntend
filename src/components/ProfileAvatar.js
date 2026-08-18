import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { onAuthStateChangedListener, getCurrentUser } from '../lib/firebaseAuth';
import { colors } from '../theme';

function getInitialsFromName(nameOrEmail) {
  const raw = (nameOrEmail || '').trim();
  if (!raw) return 'U';

  const parts = raw.split(/\s+/).filter(Boolean);
  if (parts.length === 1) {
    const value = parts[0].replace(/[^a-zA-Z]/g, '');
    return value.slice(0, 2).toUpperCase() || 'U';
  }

  const first = parts[0].replace(/[^a-zA-Z]/g, '').charAt(0).toUpperCase();
  const second = parts[1].replace(/[^a-zA-Z]/g, '').charAt(0).toUpperCase();
  return `${first}${second}`;
}

export default function ProfileAvatar({ size = 42, showRing = true }) {
  const [initials, setInitials] = useState('U');

  useEffect(() => {
    const syncInitials = (user) => {
      const name = user?.displayName || user?.email || 'User';
      setInitials(getInitialsFromName(name));
    };

    syncInitials(getCurrentUser());
    const unsubscribe = onAuthStateChangedListener(syncInitials);
    return () => unsubscribe && unsubscribe();
  }, []);

  return (
    <View
      style={[
        styles.avatarWrap,
        showRing && styles.avatarRing,
        { width: size, height: size, borderRadius: size / 2 },
      ]}
    >
      <View style={[styles.avatar, { width: size - 7, height: size - 7, borderRadius: (size - 7) / 2 }]}> 
        <Text style={[styles.avatarLabel, { fontSize: Math.max(12, size * 0.34) }]}>{initials}</Text>
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
