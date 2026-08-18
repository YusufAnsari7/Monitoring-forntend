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

// Import the functions you need from the SDKs you need
// Centralized API endpoints
export const API_ENDPOINTS = {
  home: 'https://playful-parasail-unworthy.ngrok-free.dev/',
  metrics: 'https://playful-parasail-unworthy.ngrok-free.dev/metrics',
  alerts: 'https://playful-parasail-unworthy.ngrok-free.dev/api/alerts',
  alertStats: 'https://playful-parasail-unworthy.ngrok-free.dev/api/alerts/stats',
  targets: 'https://playful-parasail-unworthy.ngrok-free.dev/api/metrics/targets',
};

// Convenience base used by internal API clients (no trailing slash)
export const API_BASE_URL = API_ENDPOINTS.home.replace(/\/+$/,'');

// Your web app's Firebase configuration (initialization is handled
// in src/lib/firebaseAuth.js and is environment-aware)
export const FIREBASE_CONFIG = {
  apiKey: 'AIzaSyCTb3y2l5I7RqEdthIeBT9n_EH7BXl9VlU',
  authDomain: 'monitoringdashboard-ad9f0.firebaseapp.com',
  projectId: 'monitoringdashboard-ad9f0',
  storageBucket: 'monitoringdashboard-ad9f0.firebasestorage.app',
  messagingSenderId: '345553288323',
  appId: '1:345553288323:web:1e70de396caf550ce0afb6',
  measurementId: 'G-HBZ9V64JZF',
};