// src/screens/ContainersScreen.js
import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { fetchContainers, controlContainer } from '../api/dockerClient';
import ContainerCard from '../components/ContainerCard';

export default function ContainersScreen({ route, navigation }) {
  const { host } = route.params;
  const [containers, setContainers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    navigation.setOptions({ title: host.name });
  }, [host, navigation]);

  const load = useCallback(async () => {
    try {
      setError(null);
      const data = await fetchContainers(host.id);
      setContainers(data.containers || []);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [host.id]);

  useEffect(() => {
    load();
  }, [load]);

  const onRefresh = () => {
    setRefreshing(true);
    load();
  };

  const handleAction = async (containerId, action) => {
    await controlContainer(host.id, containerId, action);
    load();
  };

  if (loading) {
    return <ActivityIndicator style={{ marginTop: 40 }} size="large" />;
  }

  if (error) {
    return (
      <View style={styles.centerBox}>
        <Text style={styles.errorText}>{error}</Text>
        <Text style={styles.errorHint}>
          Couldn't reach this host. Check it's online and, for remote hosts, that TLS is
          configured correctly.
        </Text>
      </View>
    );
  }

  if (containers.length === 0) {
    return (
      <View style={styles.centerBox}>
        <Text style={styles.emptyText}>No containers found on this host.</Text>
      </View>
    );
  }

  return (
    <FlatList
      style={styles.container}
      data={containers}
      keyExtractor={(c) => c.id}
      contentContainerStyle={{ paddingVertical: 8 }}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      renderItem={({ item }) => <ContainerCard container={item} onAction={handleAction} />}
    />
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F3F4F6' },
  centerBox: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 32 },
  errorText: { color: '#DC2626', fontWeight: '700', textAlign: 'center' },
  errorHint: { color: '#6B7280', fontSize: 12, textAlign: 'center', marginTop: 6 },
  emptyText: { color: '#9CA3AF', fontSize: 14 },
});
