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
import { formatAuthError, sendOtpForEmail, verifyOtpCode } from '../lib/supabase';

export default function CreateAccountScreen({ navigation }) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [otpSent, setOtpSent] = useState(false);
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
    setOtpSent(false);
    try {
      const { data, error } = await sendOtpForEmail({
        email: fields.trimmedEmail,
        fullName: fields.trimmedName,
      });

      if (error) {
        const message = error.message || '';
        const friendlyText = message.toLowerCase().includes('disabled') || message.toLowerCase().includes('provider')
          ? 'Email authentication is not enabled in your Supabase project. Turn on Email in Authentication → Providers and confirm the redirect URL is monitoringdashboard://auth/callback.'
          : formatAuthError(error);

        Alert.alert('OTP request failed', friendlyText);
        return;
      }

      if (!data) {
        Alert.alert('No OTP sent', 'Supabase did not return an OTP response. Check the project URL, anon key, and Email provider configuration.');
        return;
      }

      setOtpSent(true);
      Alert.alert(
        'Your 10-minute OTP code is on the way',
        'We sent a one-time verification code to your email. Enter it below to complete setup.',
      );
    } catch (error) {
      Alert.alert('Account setup failed', 'Something unexpected happened while sending the OTP. Please check your Supabase Email provider and project settings.');
      console.warn('Create account OTP error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    const trimmedEmail = email.trim();
    const trimmedCode = otpCode.trim();

    if (!trimmedEmail || !trimmedCode) {
      Alert.alert('OTP required', 'Enter the 6-digit code sent to your email.');
      return;
    }

    setLoading(true);
    try {
      const { error } = await verifyOtpCode({
        email: trimmedEmail,
        token: trimmedCode,
        fullName: fullName.trim(),
      });

      if (error) {
        Alert.alert('Verification failed', formatAuthError(error));
        return;
      }

      Alert.alert(
        'Welcome aboard',
        'Your account is verified and ready. Thank you for choosing our app.',
        [{ text: 'Continue', onPress: () => navigation.navigate('Login') }],
      );
    } catch (error) {
      Alert.alert('Verification error', 'The OTP could not be verified. Please check the code and try again.');
      console.warn('OTP verification error:', error);
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

        {!otpSent ? (
          <Pressable
            disabled={loading}
            onPress={handleCreateAccount}
            style={[styles.primaryButton, loading && styles.primaryButtonDisabled]}
          >
            {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.primaryButtonText}>Send OTP</Text>}
          </Pressable>
        ) : (
          <>
            <Text style={styles.label}>Verification code</Text>
            <TextInput
              value={otpCode}
              onChangeText={setOtpCode}
              placeholder="Enter 6-digit code"
              placeholderTextColor={colors.textMuted}
              keyboardType="number-pad"
              maxLength={6}
              style={styles.input}
            />

            <Pressable
              disabled={loading}
              onPress={handleVerifyOtp}
              style={[styles.primaryButton, loading && styles.primaryButtonDisabled]}
            >
              {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.primaryButtonText}>Verify OTP</Text>}
            </Pressable>
          </>
        )}

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
