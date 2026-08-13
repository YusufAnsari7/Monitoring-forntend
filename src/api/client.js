// src/api/client.js
import { API_BASE_URL } from '../config';

async function request(path, options = {}) {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    headers: { Accept: 'application/json' },
    ...options,
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Request failed (${res.status}): ${text || res.statusText}`);
  }

  return res;
}

/**
 * GET /alerts?status=&severity=
 * Matches the query params supported by src/index.js on the backend.
 */
export async function fetchAlerts({ status, severity } = {}) {
  const params = new URLSearchParams();
  if (status && status !== 'all') params.set('status', status);
  if (severity && severity !== 'all') params.set('severity', severity);

  const qs = params.toString();
  const res = await request(`/alerts${qs ? `?${qs}` : ''}`);
  return res.json(); // { total, alerts: [...] }
}

/**
 * GET /metrics
 * Returns raw Prometheus exposition-format text (not JSON).
 */
export async function fetchMetricsRaw() {
  const res = await request('/metrics');
  return res.text();
}

/**
 * GET /api/data
 * Simple health/sanity check hitting the sample instrumented route.
 */
export async function fetchApiData() {
  const res = await request('/api/data');
  return res.json();
}
