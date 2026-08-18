import { Platform } from 'react-native';
import { FIREBASE_CONFIG } from '../config';

// Provide a small cross-platform wrapper so the rest of the app can use
// the same helper functions on web and native.

function normalizeError(err) {
  if (!err) return null;
  const message = err.message || err.code || String(err);
  return { message };
}

export function formatFirebaseAuthError(error) {
  if (!error) return 'Something went wrong. Please try again.';
  const message = error.message || error.toString() || 'Something went wrong. Please try again.';

  if (message.includes('auth/invalid-credential') || message.includes('Invalid login credentials')) return 'Incorrect email or password.';
  if (message.includes('auth/email-not-verified') || message.includes('Email not confirmed')) return 'Please verify your email before signing in.';
  if (message.includes('auth/email-already-in-use') || message.includes('User already registered')) return 'An account with that email already exists.';
  if (message.includes('auth/weak-password') || message.includes('weak password')) return 'Your password is too weak. Use at least 8 characters.';
  if (message.includes('auth/invalid-email') || message.includes('invalid email')) return 'Please enter a valid email address.';
  if (message.includes('network')) return 'Network error. Please check your connection and try again.';

  return message || 'Something went wrong. Please try again.';
}

let impl = null;

if (Platform.OS === 'web') {
  // Web: use firebase JS SDK
  // Import lazily so native bundles don't pull web-only code
  // eslint-disable-next-line global-require
  const { initializeApp, getApps } = require('firebase/app');
  // eslint-disable-next-line global-require
  const { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, sendEmailVerification, signOut, onAuthStateChanged } = require('firebase/auth');

  const app = getApps().length > 0 ? getApps()[0] : initializeApp(FIREBASE_CONFIG);
  const auth = getAuth(app);

  impl = {
    async signInWithEmail({ email, password }) {
      try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        return { data: { user: userCredential.user }, error: null };
      } catch (err) {
        return { data: null, error: normalizeError(err) };
      }
    },
    async signUpWithEmail({ email, password }) {
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        try {
          await sendEmailVerification(userCredential.user);
        } catch (verificationError) {
          return { data: null, error: normalizeError(verificationError) };
        }
        return { data: { user: userCredential.user }, error: null };
      } catch (err) {
        return { data: null, error: normalizeError(err) };
      }
    },
    async sendEmailVerificationToCurrent() {
      try {
        const user = auth.currentUser;
        if (!user) return { error: { message: 'No user logged in' } };
        await sendEmailVerification(user);
        return { error: null };
      } catch (err) {
        return { error: normalizeError(err) };
      }
    },
    async signOut() {
      try {
        await signOut(auth);
        return { error: null };
      } catch (err) {
        return { error: normalizeError(err) };
      }
    },
    onAuthStateChangedListener(cb) {
      return onAuthStateChanged(auth, cb);
    },
    getCurrentUser() {
      return auth.currentUser;
    },
  };
} else {
  // Native: use @react-native-firebase/auth
  // eslint-disable-next-line global-require
  const auth = require('@react-native-firebase/auth').default();

  impl = {
    async signInWithEmail({ email, password }) {
      try {
        const userCredential = await auth.signInWithEmailAndPassword(email, password);
        return { data: { user: userCredential.user || auth.currentUser }, error: null };
      } catch (err) {
        return { data: null, error: normalizeError(err) };
      }
    },
    async signUpWithEmail({ email, password }) {
      try {
        const userCredential = await auth.createUserWithEmailAndPassword(email, password);
        try {
          const user = userCredential.user || auth.currentUser;
          if (user && user.sendEmailVerification) {
            await user.sendEmailVerification();
          }
        } catch (verificationError) {
          return { data: null, error: normalizeError(verificationError) };
        }
        return { data: { user: userCredential.user || auth.currentUser }, error: null };
      } catch (err) {
        return { data: null, error: normalizeError(err) };
      }
    },
    async sendEmailVerificationToCurrent() {
      try {
        const user = auth.currentUser;
        if (!user) return { error: { message: 'No user logged in' } };
        if (user.sendEmailVerification) {
          await user.sendEmailVerification();
        }
        return { error: null };
      } catch (err) {
        return { error: normalizeError(err) };
      }
    },
    async signOut() {
      try {
        await auth.signOut();
        return { error: null };
      } catch (err) {
        return { error: normalizeError(err) };
      }
    },
    onAuthStateChangedListener(cb) {
      return auth.onAuthStateChanged(cb);
    },
    getCurrentUser() {
      return auth.currentUser;
    },
  };
}

export const signInWithEmail = (opts) => impl.signInWithEmail(opts);
export const signUpWithEmail = (opts) => impl.signUpWithEmail(opts);
export const sendEmailVerificationToCurrent = () => impl.sendEmailVerificationToCurrent();
export const signOut = () => impl.signOut();
export const onAuthStateChangedListener = (cb) => impl.onAuthStateChangedListener(cb);
export const getCurrentUser = () => impl.getCurrentUser();

