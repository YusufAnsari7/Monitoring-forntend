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
import { colors } from '../theme';
import { formatFirebaseAuthError, signUpWithEmail } from '../lib/firebaseAuth';

export default function CreateAccountScreen({ navigation }) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const validateFields = () => {
    const trimmedName = fullName.trim();
    const trimmedEmail = email.trim();

    if (!trimmedName || !trimmedEmail || !password || !confirmPassword) {
      Alert.alert('Missing details', 'Please complete every field before creating your account.');
      return null;
    }

    if (password !== confirmPassword) {
      Alert.alert('Password mismatch', 'The password and confirm password fields must match.');
      return null;
    }

    if (password.length < 8) {
      Alert.alert('Weak password', 'Use at least 8 characters for a stronger password.');
      return null;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(trimmedEmail)) {
      Alert.alert('Invalid email', 'Please enter a valid email address.');
      return null;
    }

    return { trimmedName, trimmedEmail };
  };

  const handleCreateAccount = async () => {
    const fields = validateFields();
    if (!fields) {
      return;
    }

    setLoading(true);
    try {
      const { error } = await signUpWithEmail({
        email: fields.trimmedEmail,
        password,
        fullName: fields.trimmedName,
      });

      if (error) {
        Alert.alert('Signup failed', formatFirebaseAuthError(error));
        return;
      }

      Alert.alert(
        'Account created',
        'A verification email was sent. Please verify your email, then sign in.',
        [{ text: 'Continue', onPress: () => navigation.navigate('Login') }],
      );
    } catch (err) {
      Alert.alert('Signup error', 'Unable to create account. Please try again.');
      console.warn('Signup error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.page} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
      <Text style={styles.eyebrow}>Create account</Text>
      <Text style={styles.title}>Start monitoring</Text>
      <Text style={styles.subtitle}>Welcome to a smarter way to track Docker health, performance, and alerts.</Text>

      <View style={styles.formCard}>
        <Text style={styles.label}>Full name</Text>
        <TextInput
          value={fullName}
          onChangeText={setFullName}
          placeholder="Jane Cooper"
          placeholderTextColor={colors.textMuted}
          style={styles.input}
        />

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
          placeholder="At least 8 characters"
          placeholderTextColor={colors.textMuted}
          secureTextEntry
          style={styles.input}
        />

        <Text style={styles.label}>Confirm password</Text>
        <TextInput
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          placeholder="Repeat your password"
          placeholderTextColor={colors.textMuted}
          secureTextEntry
          style={styles.input}
        />

        <Pressable
          disabled={loading}
          onPress={handleCreateAccount}
          style={[styles.primaryButton, loading && styles.primaryButtonDisabled]}
        >
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.primaryButtonText}>Create account</Text>}
        </Pressable>

        <Pressable onPress={() => navigation.goBack()} style={styles.secondaryLink}>
          <Text style={styles.secondaryLinkText}>Back to login</Text>
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
