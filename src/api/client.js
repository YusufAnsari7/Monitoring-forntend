// src/api/client.js
import { API_BASE_URL } from '../config';

async function request(path, options = {}) {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    headers: { Accept: 'application/json', ...(options.headers || {}) },
    ...options,
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Request failed (${res.status}): ${text || res.statusText}`);
  }

  return res;
}

export async function fetchApiHealth() {
  const res = await request('/');
  return res.json();
}

export async function fetchAlerts({ status, severity } = {}) {
  const params = new URLSearchParams();
  if (status && status !== 'all') params.set('status', status);
  if (severity && severity !== 'all') params.set('severity', severity);

  const qs = params.toString();
  const res = await request(`/api/alerts${qs ? `?${qs}` : ''}`);
  return res.json();
}

export async function fetchAlertStats() {
  const res = await request('/api/alerts/stats');
  return res.json();
}

export async function fetchMetricsTargets() {
  const res = await request('/api/metrics/targets');
  return res.json();
}

export async function fetchMetricsRaw() {
  const res = await request('/metrics');
  return res.text();
}

