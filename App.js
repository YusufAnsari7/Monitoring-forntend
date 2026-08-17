import React, { useEffect, useState } from 'react';
import { StatusBar, Alert, Linking } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { supabase, hasSupabaseConfig, handleSupabaseOAuthRedirect } from './src/lib/supabase';
import { getAuth, onAuthStateChanged } from '@react-native-firebase/auth';
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

    const restoreSessionFromDeepLink = async (url) => {
      if (!url) {
        return;
      }

      try {
        const { data, error } = await handleSupabaseOAuthRedirect(url);
        if (!isMounted) {
          return;
        }

        if (error) {
          console.warn('Supabase callback handling failed:', error.message || error);
          return;
        }

        if (data?.session) {
          setSession(data.session);
        }
      } catch (error) {
        console.warn('Supabase OAuth callback error:', error);
      }
    };

    const bootstrapSession = async () => {
      if (!hasSupabaseConfig()) {
        setSession(null);
        setInitializing(false);
        return;
      }

      try {
        const initialUrl = await Linking.getInitialURL();
        if (initialUrl) {
          await restoreSessionFromDeepLink(initialUrl);
        }

        const { data: { session: currentSession }, error } = await supabase.auth.getSession();
        if (!isMounted) {
          return;
        }

        if (error) {
          console.warn('Session initialization error:', error.message || 'Unable to load your session.');
        }

        setSession(currentSession ?? null);
      } catch (error) {
        console.warn('Session bootstrap failed:', error);
        setSession(null);
      } finally {
        if (isMounted) {
          setInitializing(false);
        }
      }
    };

    bootstrapSession();

    if (!hasSupabaseConfig()) {
      return () => {
        isMounted = false;
      };
    }

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      if (isMounted) {
        setSession(nextSession ?? null);
        setInitializing(false);
      }
    });

    // Also listen for Firebase auth changes so Firebase-authenticated users
    // cause the navigator to re-evaluate which stacks to render.
    let firebaseUnsubscribe;
    try {
      const firebaseAuth = getAuth();
      firebaseUnsubscribe = onAuthStateChanged(firebaseAuth, (user) => {
        if (isMounted) {
          setSession(user ?? null);
          setInitializing(false);
        }
      });
    } catch (err) {
      console.warn('Firebase auth listener could not be attached:', err);
    }

    const deepLinkListener = Linking.addEventListener('url', ({ url }) => {
      restoreSessionFromDeepLink(url);
    });

    return () => {
      isMounted = false;
      authListener?.subscription?.unsubscribe?.();
      if (typeof firebaseUnsubscribe === 'function') {
        try {
          firebaseUnsubscribe();
        } catch (e) {
          // ignore
        }
      }
      deepLinkListener?.remove?.();
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
