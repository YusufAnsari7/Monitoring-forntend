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
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

export const API_BASE_URL = 'https://playful-parasail-unworthy.ngrok-free.dev';

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
export const FIREBASE_CONFIG = {
  apiKey: 'AIzaSyCTb3y2l5I7RqEdthIeBT9n_EH7BXl9VlU',
  authDomain: 'monitoringdashboard-ad9f0.firebaseapp.com',
  projectId: 'monitoringdashboard-ad9f0',
  storageBucket: 'monitoringdashboard-ad9f0.firebasestorage.app',
  messagingSenderId: '345553288323',
  appId: '1:345553288323:web:1e70de396caf550ce0afb6',
  measurementId: 'G-HBZ9V64JZF',
};

// Initialize Firebase exactly once before any auth calls
export const firebaseApp = initializeApp(FIREBASE_CONFIG);
export const analytics = getAnalytics(firebaseApp);