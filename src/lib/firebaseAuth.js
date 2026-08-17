import { initializeApp, getApps } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, sendEmailVerification, signOut as firebaseSignOut, onAuthStateChanged } from 'firebase/auth';
import { FIREBASE_CONFIG } from '../config';

const firebaseApp = getApps().length > 0 ? getApps()[0] : initializeApp(FIREBASE_CONFIG);
export const firebaseAuth = getAuth(firebaseApp);

function normalizeError(err) {
  if (!err) return null;
  const message = err.message || err.code || String(err);
  return { message };
}

export function formatFirebaseAuthError(error) {
  if (!error) {
    return 'Something went wrong. Please try again.';
  }

  const message = error.message || error.toString() || 'Something went wrong. Please try again.';

  if (message.includes('auth/invalid-credential') || message.includes('Invalid login credentials')) {
    return 'Incorrect email or password.';
  }

  if (message.includes('auth/email-not-verified') || message.includes('Email not confirmed')) {
    return 'Please verify your email before signing in.';
  }

  if (message.includes('auth/email-already-in-use') || message.includes('User already registered')) {
    return 'An account with that email already exists.';
  }

  if (message.includes('auth/weak-password') || message.includes('weak password')) {
    return 'Your password is too weak. Use at least 8 characters.';
  }

  if (message.includes('auth/invalid-email') || message.includes('invalid email')) {
    return 'Please enter a valid email address.';
  }

  if (message.includes('network')) {
    return 'Network error. Please check your connection and try again.';
  }

  return message || 'Something went wrong. Please try again.';
}

export async function signInWithEmail({ email, password }) {
  try {
    const userCredential = await signInWithEmailAndPassword(firebaseAuth, email, password);
    const user = userCredential.user;
    return { data: { user }, error: null };
  } catch (err) {
    return { data: null, error: normalizeError(err) };
  }
}

export async function signUpWithEmail({ email, password, fullName }) {
  try {
    const userCredential = await createUserWithEmailAndPassword(firebaseAuth, email, password);
    const user = userCredential.user;

    try {
      await sendEmailVerification(user);
    } catch (verificationError) {
      return { data: null, error: normalizeError(verificationError) };
    }

    return { data: { user }, error: null };
  } catch (err) {
    return { data: null, error: normalizeError(err) };
  }
}

export async function signInWithGoogle() {
  return { data: null, error: { message: 'Google sign-in is not configured for this app. Set up native Google sign-in or use email/password.' } };
}

export async function signOut() {
  try {
    await firebaseSignOut(firebaseAuth);
    return { error: null };
  } catch (err) {
    return { error: normalizeError(err) };
  }
}

export function onAuthStateChangedListener(cb) {
  return onAuthStateChanged(firebaseAuth, cb);
}

export function getCurrentUser() {
  return firebaseAuth.currentUser;
}
