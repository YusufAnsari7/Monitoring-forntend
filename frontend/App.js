// App.js
import React from 'react';
import { StatusBar, Text } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import AlertsScreen from './src/screens/AlertsScreen';
import MetricsScreen from './src/screens/MetricsScreen';
import HostsScreen from './src/screens/HostsScreen';
import ContainersScreen from './src/screens/ContainersScreen';

const Tab = createBottomTabNavigator();
const DockerStack = createNativeStackNavigator();

// Simple emoji tab icons — avoids pulling in and linking a vector-icon
// package for a bare RN project. Swap for react-native-vector-icons later
// if you want.
function TabIcon({ emoji }) {
  return <Text style={{ fontSize: 18 }}>{emoji}</Text>;
}

function DockerStackNavigator() {
  return (
    <DockerStack.Navigator screenOptions={{ headerTitleStyle: { fontWeight: '800' } }}>
      <DockerStack.Screen name="Hosts" component={HostsScreen} options={{ title: 'Docker Hosts' }} />
      <DockerStack.Screen name="Containers" component={ContainersScreen} />
    </DockerStack.Navigator>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <StatusBar barStyle="dark-content" />
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={{
            headerTitleStyle: { fontWeight: '800' },
            tabBarActiveTintColor: '#111827',
            tabBarInactiveTintColor: '#9CA3AF',
          }}
        >
          <Tab.Screen
            name="Alerts"
            component={AlertsScreen}
            options={{ title: 'Alerts', tabBarIcon: () => <TabIcon emoji="🚨" /> }}
          />
          <Tab.Screen
            name="Metrics"
            component={MetricsScreen}
            options={{ title: 'Metrics', tabBarIcon: () => <TabIcon emoji="📊" /> }}
          />
          <Tab.Screen
            name="Docker"
            component={DockerStackNavigator}
            options={{ title: 'Docker', headerShown: false, tabBarIcon: () => <TabIcon emoji="🐳" /> }}
          />
        </Tab.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
