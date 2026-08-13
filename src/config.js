// src/config.js
//
// Your Node backend (src/index.js) listens on port 3001.
//
// Pick the right base URL for where you're running the app:
//
//   Android emulator (Android Studio AVD): 10.0.2.2 maps to your host machine's
//   localhost, so this is the default and works out of the box if the backend
//   is running on the same machine as Android Studio.
//
//   Physical Android phone: use your computer's LAN IP, e.g. "http://192.168.1.42:3001"
//   (find it with `ipconfig` on Windows or `ifconfig`/`ip a` on Mac/Linux).
//   Your phone and computer must be on the same Wi-Fi network.
//
//   iOS simulator: "http://localhost:3001" works fine.

export const API_BASE_URL = 'http://10.0.2.2:3001';

// How often the Alerts screen auto-refreshes, in milliseconds.
export const ALERTS_POLL_INTERVAL_MS = 15000;

// Supabase configuration.
// Live project credentials for the monitoring app.
export const SUPABASE_URL = 'https://zavxpxkxllxvxjpzuxej.supabase.co';
export const SUPABASE_ANON_KEY = 'sb_publishable_4RqZu6LXr23ufZzwjoNT7A_VsW4-6RN';
export const APP_REDIRECT_SCHEME = 'monitoringdashboard';

// Placeholder values kept separately so the "is this configured" check
// doesn't compare live credentials against themselves.
const PLACEHOLDER_SUPABASE_URL = 'https://your-project.supabase.co';
const PLACEHOLDER_SUPABASE_ANON_KEY = 'your-anon-key';

export const IS_SUPABASE_CONFIGURED =
  SUPABASE_URL !== PLACEHOLDER_SUPABASE_URL &&
  SUPABASE_ANON_KEY !== PLACEHOLDER_SUPABASE_ANON_KEY;