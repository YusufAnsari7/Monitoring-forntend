import { getAuth } from 'firebase/auth';

export async function fetchCurrentProfile() {
  const auth = getAuth();
  const user = auth.currentUser;

  if (!user) {
    return { user: null, profile: null, error: new Error('No user signed in.') };
  }

  return {
    user,
    profile: {
      full_name: user.displayName || 'User',
      name: user.displayName || 'User',
      email: user.email || 'No email available',
      avatar_url: user.photoURL || null,
      id: user.uid || 'N/A',
    },
    error: null,
  };
}

export function getDisplayProfile(user, profile) {
  const fullName =
    profile?.full_name ||
    profile?.name ||
    user?.displayName ||
    'User';

  return {
    fullName,
    email: user?.email || profile?.email || 'No email available',
    avatarUrl: profile?.avatar_url || user?.photoURL || null,
    userId: user?.uid || profile?.id || 'N/A',
  };
}
