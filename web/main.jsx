import React from 'react';
import { createRoot } from 'react-dom/client';
import { AppRegistry } from 'react-native-web';
import App from '../App';

AppRegistry.registerComponent('MonitoringDashboard', () => App);

const root = createRoot(document.getElementById('root'));
root.render(<App />);
