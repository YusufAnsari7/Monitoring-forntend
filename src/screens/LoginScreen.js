import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  ActivityIndicator,
  Alert,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { signInWithEmail, sendEmailVerificationToCurrent } from '../lib/firebaseAuth';
import { colors } from '../theme';
import { formatFirebaseAuthError } from '../lib/firebaseAuth';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    const trimmedEmail = email.trim();

    if (!trimmedEmail || !password) {
      Alert.alert('Missing details', 'Enter both your email and password.');
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(trimmedEmail)) {
      Alert.alert('Invalid email', 'Please enter a valid email address.');
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await signInWithEmail({ email: trimmedEmail, password });
      if (error) {
        throw error;
      }

      const user = data?.user;
      if (user && !user.emailVerified) {
        Alert.alert('Email not verified', 'Please verify your email before logging in.', [
          {
            text: 'Resend email',
            onPress: async () => {
              try {
                await sendEmailVerificationToCurrent();
                Alert.alert('Verification email sent', 'Please check your inbox and spam folder.');
              } catch (error) {
                console.warn('Verification email error:', error);
                Alert.alert('Error', 'Could not send verification email. Please try again later.');
              }
            },
          },
          { text: 'OK' },
        ]);
        setLoading(false);
        return;
      }
    } catch (error) {
      console.warn('Firebase login error:', error);
      Alert.alert('Login failed', formatFirebaseAuthError(error));
      setLoading(false);
      return;
    }

    setLoading(false);
  };

  return (
    <ScrollView style={styles.page} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
      <Text style={styles.eyebrow}>Welcome back</Text>
      <Text style={styles.title}>Sign in to Monitor</Text>
      <Text style={styles.subtitle}>Access your Docker, metrics, and alert overview.</Text>

      <View style={styles.formCard}>
        <Text style={styles.label}>Email</Text>
        <TextInput
          value={email}
          onChangeText={setEmail}
          placeholder="name@example.com"
          placeholderTextColor={colors.textMuted}
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType="email-address"
          style={styles.input}
        />

        <Text style={styles.label}>Password</Text>
        <TextInput
          value={password}
          onChangeText={setPassword}
          placeholder="Enter your password"
          placeholderTextColor={colors.textMuted}
          secureTextEntry
          style={styles.input}
        />

        <Pressable disabled={loading} onPress={handleLogin} style={[styles.primaryButton, loading && styles.primaryButtonDisabled]}>
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.primaryButtonText}>Log in</Text>}
        </Pressable>

        <Pressable onPress={() => navigation.navigate('CreateAccount')} style={styles.secondaryLink}>
          <Text style={styles.secondaryLinkText}>Create account</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 32,
  },
  eyebrow: {
    color: colors.blue,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  title: {
    color: colors.text,
    fontSize: 32,
    fontWeight: '700',
    letterSpacing: -0.7,
  },
  subtitle: {
    color: colors.textMuted,
    fontSize: 14,
    marginTop: 8,
    marginBottom: 24,
  },
  formCard: {
    backgroundColor: colors.surface,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 20,
  },
  label: {
    color: colors.textSoft,
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#0D1524',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: colors.text,
    fontSize: 15,
    marginBottom: 16,
  },
  primaryButton: {
    backgroundColor: colors.blueStrong,
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 8,
  },
  primaryButtonDisabled: {
    opacity: 0.7,
  },
  primaryButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 15,
  },
  secondaryLink: {
    alignItems: 'center',
    marginTop: 16,
  },
  secondaryLinkText: {
    color: colors.blue,
    fontWeight: '700',
    fontSize: 15,
  },
});
