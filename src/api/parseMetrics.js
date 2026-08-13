// src/api/parseMetrics.js
//
// Minimal Prometheus exposition-format parser. Not a general-purpose parser —
// just pulls out a handful of metric names we care about for the dashboard
// cards. Good enough for display purposes; for real querying/graphing you'd
// point at Prometheus itself (port 9090), not this raw text endpoint.

function sumMetricValues(rawText, metricName) {
  const lines = rawText.split('\n');
  let sum = 0;
  let found = false;

  for (const line of lines) {
    if (line.startsWith('#')) continue;
    if (!line.startsWith(metricName)) continue;

    const match = line.match(/\s([0-9.eE+-]+)\s*$/);
    if (match) {
      sum += parseFloat(match[1]);
      found = true;
    }
  }

  return found ? sum : null;
}

export function parseKeyMetrics(rawText) {
  return {
    httpRequestsTotal: sumMetricValues(rawText, 'http_requests_total'),
    processCpuSeconds: sumMetricValues(rawText, 'process_cpu_user_seconds_total'),
    heapUsedBytes: sumMetricValues(rawText, 'nodejs_heap_size_used_bytes'),
    heapTotalBytes: sumMetricValues(rawText, 'nodejs_heap_size_total_bytes'),
    eventLoopLagSeconds: sumMetricValues(rawText, 'nodejs_eventloop_lag_seconds'),
    processUptimeSeconds: sumMetricValues(rawText, 'process_start_time_seconds'),
  };
}

export function formatBytes(bytes) {
  if (bytes == null) return '—';
  const mb = bytes / (1024 * 1024);
  return `${mb.toFixed(1)} MB`;
}

export function formatNumber(n, decimals = 0) {
  if (n == null) return '—';
  return n.toFixed(decimals);
}
