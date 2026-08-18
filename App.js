import React, { useEffect, useState } from 'react';
import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { onAuthStateChangedListener } from './src/lib/firebaseAuth';
import AuthLoadingScreen from './src/screens/AuthLoadingScreen';
import LoginScreen from './src/screens/LoginScreen';
import CreateAccountScreen from './src/screens/CreateAccountScreen';
import DashboardScreen from './src/screens/DashboardScreen';
import ContainersScreen from './src/screens/ContainersScreen';
import AlertsScreen from './src/screens/AlertsScreen';
import MetricsScreen from './src/screens/MetricsScreen';
import LogsScreen from './src/screens/LogsScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import AddContainerScreen from './src/screens/AddContainerScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import AboutScreen from './src/screens/AboutScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  const [initializing, setInitializing] = useState(true);
  const [session, setSession] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const unsubscribe = onAuthStateChangedListener((user) => {
      if (!isMounted) return;
      setSession(user ?? null);
      setInitializing(false);
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, []);

  if (initializing) {
    return <AuthLoadingScreen />;
  }

  return (
    <SafeAreaProvider>
      <StatusBar barStyle="light-content" backgroundColor="#050914" />
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName={session ? 'Dashboard' : 'Login'}
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: '#050914' },
          }}
        >
          {!session ? (
            <>
              <Stack.Screen name="Login" component={LoginScreen} />
              <Stack.Screen name="CreateAccount" component={CreateAccountScreen} />
            </>
          ) : (
            <>
              <Stack.Screen name="Dashboard" component={DashboardScreen} />
              <Stack.Screen name="Containers" component={ContainersScreen} />
              <Stack.Screen name="Alerts" component={AlertsScreen} />
              <Stack.Screen name="Metrics" component={MetricsScreen} />
              <Stack.Screen name="Logs" component={LogsScreen} />
              <Stack.Screen name="Profile" component={ProfileScreen} />
              <Stack.Screen name="AddContainer" component={AddContainerScreen} />
              <Stack.Screen name="Settings" component={SettingsScreen} />
              <Stack.Screen name="About" component={AboutScreen} />
            </>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
