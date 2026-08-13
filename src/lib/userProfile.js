import { supabase } from './supabase';

export async function fetchCurrentProfile() {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { user: null, profile: null, error: userError || new Error('No user signed in.') };
  }

  const { data: profile, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .maybeSingle();

  if (error && error.code !== 'PGRST116') {
    return { user, profile: null, error };
  }

  return {
    user,
    profile: profile || null,
    error: null,
  };
}

export function getDisplayProfile(user, profile) {
  const fullName =
    profile?.full_name ||
    profile?.name ||
    user?.user_metadata?.full_name ||
    user?.user_metadata?.name ||
    'User';

  return {
    fullName,
    email: user?.email || profile?.email || 'No email available',
    avatarUrl: profile?.avatar_url || user?.user_metadata?.avatar_url || null,
    userId: user?.id || profile?.id || 'N/A',
  };
}
