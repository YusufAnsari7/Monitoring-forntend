import React from 'react';
import { View, Text, Pressable, StyleSheet, Modal, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../theme';
import ProfileAvatar from './ProfileAvatar';

const navItems = [
  'Dashboard',
  'Containers',
  'Alerts',
  'Metrics',
  'Logs',
  'Settings',
  'About',
];

export default function SideDrawer({ visible, onClose, active, onNavigate }) {
  const slideAnim = React.useRef(new Animated.Value(300)).current;

  React.useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: visible ? 0 : 300,
      duration: 220,
      useNativeDriver: true,
    }).start();
  }, [visible, slideAnim]);

  return (
    <Modal transparent visible={visible} animationType="none" onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose} />
      <Animated.View style={[styles.drawer, { transform: [{ translateX: slideAnim }] }]}>
        <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
          <View style={styles.header}>
            <View style={styles.logoWrap}>
              <View style={styles.logoDot} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.title}>Monitor</Text>
              <Text style={styles.subtitle}>Infrastructure at a glance</Text>
            </View>
          </View>

          <View style={styles.statusRow}>
            <View style={styles.statusDot} />
            <Text style={styles.statusText}>Connected</Text>
          </View>

          <View style={styles.navList}>
            {navItems.map((item) => (
              <Pressable
                key={item}
                onPress={() => {
                  onNavigate(item);
                  onClose();
                }}
                style={[styles.navItem, active === item && styles.navItemActive]}
              >
                <Text style={[styles.navText, active === item && styles.navTextActive]}>{item}</Text>
              </Pressable>
            ))}
          </View>

          <View style={styles.divider} />

          <View style={styles.footerGroup}>
            <Pressable onPress={() => { onNavigate('Settings'); onClose(); }}>
              <Text style={styles.footerLabel}>Settings</Text>
            </Pressable>
            <Pressable onPress={() => { onNavigate('About'); onClose(); }}>
              <Text style={styles.footerLabel}>About</Text>
            </Pressable>
          </View>

          <View style={styles.profileRow}>
            <ProfileAvatar size={34} />
            <View style={{ marginLeft: 10, flex: 1 }}>
              <Text style={styles.profileName}>Michael Jordan</Text>
              <Text style={styles.profileMeta}>Ops · Local Cluster</Text>
            </View>
          </View>

          <Text style={styles.version}>Version 1.0.0</Text>
        </SafeAreaView>
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(2, 6, 18, 0.5)',
  },
  drawer: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    width: '78%',
    backgroundColor: '#0B1220',
    borderLeftWidth: 1,
    borderLeftColor: colors.border,
  },
  safeArea: {
    flex: 1,
    paddingHorizontal: 18,
    paddingTop: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 18,
    paddingBottom: 12,
  },
  logoWrap: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: 'rgba(90, 168, 255, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(90, 168, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  logoDot: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: colors.blue,
    shadowColor: colors.blue,
    shadowOpacity: 0.6,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 0 },
  },
  title: {
    color: colors.text,
    fontSize: 22,
    fontWeight: '700',
    letterSpacing: -0.6,
  },
  subtitle: {
    color: colors.textMuted,
    fontSize: 12,
    marginTop: 4,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 10,
    backgroundColor: 'rgba(35, 198, 122, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(35, 198, 122, 0.18)',
    alignSelf: 'flex-start',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.green,
    marginRight: 8,
  },
  statusText: {
    color: colors.green,
    fontWeight: '700',
    fontSize: 12,
  },
  navList: {
    marginTop: 16,
  },
  navItem: {
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 12,
    marginBottom: 6,
  },
  navItemActive: {
    backgroundColor: 'rgba(90, 168, 255, 0.08)',
  },
  navText: {
    color: colors.textSoft,
    fontSize: 15,
    fontWeight: '600',
  },
  navTextActive: {
    color: colors.text,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 18,
  },
  footerGroup: {
    gap: 10,
  },
  footerLabel: {
    color: colors.textSoft,
    fontSize: 15,
    fontWeight: '600',
    paddingVertical: 2,
  },
  profileRow: {
    position: 'absolute',
    left: 18,
    right: 18,
    bottom: 72,
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  profileName: {
    color: colors.text,
    fontSize: 13,
    fontWeight: '700',
  },
  profileMeta: {
    color: colors.textMuted,
    fontSize: 11,
    marginTop: 2,
  },
  version: {
    position: 'absolute',
    left: 18,
    bottom: 22,
    color: colors.textMuted,
    fontSize: 11,
  },
});
