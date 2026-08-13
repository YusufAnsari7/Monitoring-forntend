// src/screens/HostsScreen.js
import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
  Modal,
  TextInput,
  ScrollView,
  Alert,
  Switch,
} from 'react-native';
import { fetchHosts, addHost, deleteHost } from '../api/dockerClient';

function HostRow({ host, onPress, onDelete }) {
  return (
    <TouchableOpacity style={styles.hostRow} onPress={onPress} activeOpacity={0.7}>
      <View style={{ flex: 1 }}>
        <View style={styles.hostNameRow}>
          <View
            style={[
              styles.dot,
              { backgroundColor: host.reachable ? '#16A34A' : '#DC2626' },
            ]}
          />
          <Text style={styles.hostName}>{host.name}</Text>
        </View>
        <Text style={styles.hostMeta}>
          {host.mode === 'socket' ? 'Local socket' : `${host.host}:${host.port}`}
          {!host.reachable && host.error ? ` · ${host.error}` : ''}
        </Text>
      </View>
      <TouchableOpacity onPress={onDelete} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
        <Text style={styles.removeText}>Remove</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );
}

function AddHostModal({ visible, onClose, onAdded }) {
  const [name, setName] = useState('');
  const [mode, setMode] = useState('socket'); // 'socket' | 'tcp'
  const [host, setHost] = useState('');
  const [port, setPort] = useState('2376');
  const [ca, setCa] = useState('');
  const [cert, setCert] = useState('');
  const [key, setKey] = useState('');
  const [saving, setSaving] = useState(false);

  const reset = () => {
    setName(''); setMode('socket'); setHost(''); setPort('2376');
    setCa(''); setCert(''); setKey('');
  };

  const submit = async () => {
    if (!name.trim()) {
      return Alert.alert('Name required', 'Give this host a label, e.g. "Home server".');
    }
    if (mode === 'tcp' && (!host.trim() || !ca.trim() || !cert.trim() || !key.trim())) {
      return Alert.alert(
        'Missing TLS config',
        'Remote hosts need an address plus CA, client cert, and client key (PEM text) — see README-DOCKER.md for how to generate these.'
      );
    }

    setSaving(true);
    try {
      const payload =
        mode === 'socket'
          ? { name, mode }
          : { name, mode, host, port: Number(port) || 2376, tls: { ca, cert, key } };

      await addHost(payload);
      reset();
      onAdded();
      onClose();
    } catch (e) {
      Alert.alert('Could not add host', e.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <ScrollView style={styles.modalContainer} contentContainerStyle={{ padding: 20 }}>
        <Text style={styles.modalTitle}>Add Docker host</Text>

        <Text style={styles.label}>Name</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="e.g. Home server"
        />

        <View style={styles.toggleRow}>
          <Text style={styles.label}>Remote host (TCP + TLS)</Text>
          <Switch value={mode === 'tcp'} onValueChange={(v) => setMode(v ? 'tcp' : 'socket')} />
        </View>

        {mode === 'socket' ? (
          <Text style={styles.helpText}>
            Connects to the backend's own local Docker daemon over the unix socket. Use this if
            the monitoring backend runs on the same machine as the containers you want to manage.
          </Text>
        ) : (
          <>
            <Text style={styles.helpText}>
              Requires the Docker daemon on that host to be configured for TLS-authenticated
              remote access. See README-DOCKER.md for the exact daemon config and cert generation
              steps — do not point this at a host without TLS enabled.
            </Text>

            <Text style={styles.label}>Host / IP</Text>
            <TextInput
              style={styles.input}
              value={host}
              onChangeText={setHost}
              placeholder="192.168.1.50"
              autoCapitalize="none"
            />

            <Text style={styles.label}>Port</Text>
            <TextInput
              style={styles.input}
              value={port}
              onChangeText={setPort}
              placeholder="2376"
              keyboardType="number-pad"
            />

            <Text style={styles.label}>CA certificate (PEM)</Text>
            <TextInput
              style={[styles.input, styles.multiline]}
              value={ca}
              onChangeText={setCa}
              placeholder="-----BEGIN CERTIFICATE-----..."
              multiline
              autoCapitalize="none"
            />

            <Text style={styles.label}>Client certificate (PEM)</Text>
            <TextInput
              style={[styles.input, styles.multiline]}
              value={cert}
              onChangeText={setCert}
              placeholder="-----BEGIN CERTIFICATE-----..."
              multiline
              autoCapitalize="none"
            />

            <Text style={styles.label}>Client key (PEM)</Text>
            <TextInput
              style={[styles.input, styles.multiline]}
              value={key}
              onChangeText={setKey}
              placeholder="-----BEGIN PRIVATE KEY-----..."
              multiline
              autoCapitalize="none"
            />
          </>
        )}

        <View style={styles.modalButtonRow}>
          <TouchableOpacity style={styles.cancelBtn} onPress={() => { reset(); onClose(); }}>
            <Text style={styles.cancelBtnText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.saveBtn} onPress={submit} disabled={saving}>
            {saving ? <ActivityIndicator color="#FFF" /> : <Text style={styles.saveBtnText}>Add host</Text>}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </Modal>
  );
}

export default function HostsScreen({ navigation }) {
  const [hosts, setHosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const load = useCallback(async () => {
    try {
      setError(null);
      const data = await fetchHosts();
      setHosts(data.hosts || []);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    load();
    const unsubscribe = navigation?.addListener?.('focus', load);
    return unsubscribe;
  }, [load, navigation]);

  const onRefresh = () => {
    setRefreshing(true);
    load();
  };

  const onDelete = (h) => {
    Alert.alert('Remove host?', `This only removes it from the app — "${h.name}" itself is untouched.`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Remove',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteHost(h.id);
            load();
          } catch (e) {
            Alert.alert('Could not remove host', e.message);
          }
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.addBtn} onPress={() => setModalVisible(true)}>
        <Text style={styles.addBtnText}>+ Add Docker host</Text>
      </TouchableOpacity>

      {loading ? (
        <ActivityIndicator style={{ marginTop: 40 }} size="large" />
      ) : error ? (
        <View style={styles.centerBox}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : hosts.length === 0 ? (
        <View style={styles.centerBox}>
          <Text style={styles.emptyText}>No Docker hosts added yet.</Text>
        </View>
      ) : (
        <FlatList
          data={hosts}
          keyExtractor={(h) => h.id}
          contentContainerStyle={{ paddingVertical: 8 }}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          renderItem={({ item }) => (
            <HostRow
              host={item}
              onPress={() => navigation.navigate('Containers', { host: item })}
              onDelete={() => onDelete(item)}
            />
          )}
        />
      )}

      <AddHostModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onAdded={load}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F3F4F6' },
  addBtn: {
    margin: 16,
    marginBottom: 8,
    backgroundColor: '#111827',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
  },
  addBtnText: { color: '#FFFFFF', fontWeight: '700', fontSize: 14 },
  hostRow: {
    flexDirection: 'row',
    alignItems: 'center',
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
  hostNameRow: { flexDirection: 'row', alignItems: 'center' },
  dot: { width: 8, height: 8, borderRadius: 4, marginRight: 8 },
  hostName: { fontSize: 15, fontWeight: '700', color: '#111827' },
  hostMeta: { fontSize: 12, color: '#6B7280', marginTop: 3, marginLeft: 16 },
  removeText: { color: '#DC2626', fontWeight: '600', fontSize: 13 },
  centerBox: { alignItems: 'center', marginTop: 60, paddingHorizontal: 32 },
  errorText: { color: '#DC2626', fontWeight: '700', textAlign: 'center' },
  emptyText: { color: '#9CA3AF', fontSize: 14 },
  modalContainer: { flex: 1, backgroundColor: '#FFFFFF' },
  modalTitle: { fontSize: 20, fontWeight: '800', color: '#111827', marginBottom: 16 },
  label: { fontSize: 12, fontWeight: '700', color: '#6B7280', marginTop: 12, marginBottom: 4 },
  helpText: { fontSize: 12, color: '#9CA3AF', lineHeight: 17, marginTop: 4 },
  input: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#111827',
  },
  multiline: { minHeight: 70, textAlignVertical: 'top', fontFamily: 'monospace', fontSize: 11 },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
  },
  modalButtonRow: { flexDirection: 'row', gap: 12, marginTop: 24, marginBottom: 40 },
  cancelBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  cancelBtnText: { color: '#374151', fontWeight: '700' },
  saveBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    backgroundColor: '#111827',
  },
  saveBtnText: { color: '#FFFFFF', fontWeight: '700' },
});
