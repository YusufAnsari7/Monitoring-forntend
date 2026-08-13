import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import { Alert } from 'react-native';
import {
  SUPABASE_URL,
  SUPABASE_ANON_KEY,
  APP_REDIRECT_SCHEME,
  IS_SUPABASE_CONFIGURED,
} from '../config';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: false,
    storage: AsyncStorage,
  },
});

export function hasSupabaseConfig() {
  return IS_SUPABASE_CONFIGURED;
}

export function getConfigError() {
  return {
    error: {
      message: 'Supabase is not configured yet. Add your project URL and publishable key in src/config.js.',
    },
  };
}

export const REDIRECT_URL = `${APP_REDIRECT_SCHEME}://auth/callback`;

export function formatAuthError(error) {
  if (!error) {
    return 'Something went wrong. Please try again.';
  }

  const message = error.message || '';

  if (message.includes('Invalid login credentials')) {
    return 'Incorrect email or password.';
  }

  if (message.includes('Email not confirmed')) {
    return 'Please confirm your email before signing in.';
  }

  if (message.includes('User already registered')) {
    return 'An account with that email already exists.';
  }

  if (message.includes('weak password')) {
    return 'Your password is too weak. Use at least 8 characters.';
  }

  if (message.includes('invalid email')) {
    return 'Please enter a valid email address.';
  }

  if (message.includes('network')) {
    return 'Network error. Please check your connection and try again.';
  }

  if (message.includes('OAuth')) {
    return 'Google sign-in could not be completed. Please try again.';
  }

  return message || 'Something went wrong. Please try again.';
}

export async function ensureProfileForUser(user, fallbackName) {
  if (!user || !hasSupabaseConfig()) {
    return { data: null, error: null };
  }

  const fullName = user.user_metadata?.full_name || user.user_metadata?.name || fallbackName || 'User';
  const profilePayload = {
    id: user.id,
    email: user.email,
    full_name: fullName,
    name: fullName,
    avatar_url: user.user_metadata?.avatar_url || null,
    updated_at: new Date().toISOString(),
  };

  const { data, error } = await supabase.from('profiles').upsert(profilePayload, {
    onConflict: 'id',
  }).select().single();

  return { data, error };
}

export async function signInWithEmail({ email, password }) {
  if (!hasSupabaseConfig()) {
    return getConfigError();
  }

  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (!error && data?.user) {
    await ensureProfileForUser(data.user, data.user.email);
  }

  return { data, error };
}

export async function signUpWithEmail({ email, password, fullName }) {
  if (!hasSupabaseConfig()) {
    return getConfigError();
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
        name: fullName,
      },
      emailRedirectTo: REDIRECT_URL,
    },
  });

  if (!error && data?.user) {
    await ensureProfileForUser(data.user, fullName);
  }

  return { data, error };
}

export async function sendOtpForEmail({ email, fullName }) {
  if (!hasSupabaseConfig()) {
    return getConfigError();
  }

  const { data, error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      data: {
        full_name: fullName,
        name: fullName,
      },
      shouldCreateUser: true,
      emailRedirectTo: REDIRECT_URL,
    },
  });

  return { data, error };
}

export async function verifyOtpCode({ email, token, fullName }) {
  if (!hasSupabaseConfig()) {
    return getConfigError();
  }

  const { data, error } = await supabase.auth.verifyOtp({
    email,
    token,
    type: 'email',
  });

  if (!error && data?.user) {
    await ensureProfileForUser(data.user, fullName || data.user.email);
  }

  return { data, error };
}

export async function signInWithGoogle() {
  if (!hasSupabaseConfig()) {
    return getConfigError();
  }

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: REDIRECT_URL,
      skipBrowserRedirect: false,
      queryParams: {
        access_type: 'offline',
        prompt: 'consent',
      },
    },
  });

  return { data, error };
}

export async function handleSupabaseOAuthRedirect(url) {
  if (!url) {
    return { data: null, error: null };
  }

  const { data, error } = await supabase.auth.getSessionFromUrl({ url });
  if (error) {
    return { data, error };
  }

  return { data, error: null };
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) {
    Alert.alert('Sign out failed', formatAuthError(error));
  }
  return { error };
}
