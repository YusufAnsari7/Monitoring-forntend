import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { colors } from '../theme';
import ProfileAvatar from './ProfileAvatar';

const items = [
  { id: 'Dashboard', label: 'Dashboard', icon: '◫' },
  { id: 'Containers', label: 'Containers', icon: '▣' },
  { id: 'Alerts', label: 'Alerts', icon: '⚑' },
  { id: 'Metrics', label: 'Metrics', icon: '◔' },
];

export default function BottomNavigation({ active, onNavigate }) {
  return (
    <View style={styles.shell}>
      <View style={styles.navBar}>
        {items.map((item) => (
          <Pressable
            key={item.id}
            onPress={() => onNavigate(item.id)}
            style={[styles.tabButton, active === item.id && styles.tabButtonActive]}
          >
            <Text style={[styles.tabIcon, active === item.id && styles.tabIconActive]}>{item.icon}</Text>
            <Text style={[styles.tabLabel, active === item.id && styles.tabLabelActive]}>{item.label}</Text>
          </Pressable>
        ))}

        <Pressable onPress={() => onNavigate('Profile')} style={styles.avatarButton}>
          <ProfileAvatar size={42} showRing />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  shell: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 16,
    paddingHorizontal: 16,
    pointerEvents: 'box-none',
  },
  navBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(11, 18, 32, 0.88)',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 22,
    paddingVertical: 10,
    paddingHorizontal: 10,
    shadowColor: '#000',
    shadowOpacity: 0.28,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 10 },
    elevation: 6,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    paddingVertical: 10,
    minHeight: 62,
  },
  tabButtonActive: {
    backgroundColor: 'rgba(90, 168, 255, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(90, 168, 255, 0.16)',
  },
  tabIcon: {
    fontSize: 16,
    color: colors.textMuted,
    marginBottom: 4,
  },
  tabIconActive: {
    color: colors.blue,
  },
  tabLabel: {
    fontSize: 10,
    color: colors.textMuted,
    fontWeight: '600',
  },
  tabLabelActive: {
    color: colors.text,
  },
  avatarButton: {
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
    paddingHorizontal: 6,
  },
});
