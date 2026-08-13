// src/api/dockerClient.js
import { API_BASE_URL } from '../config';

async function request(path, options = {}) {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    ...options,
  });

  if (!res.ok) {
    let message = res.statusText;
    try {
      const body = await res.json();
      message = body.error || message;
    } catch {
      // ignore, keep statusText
    }
    throw new Error(message);
  }

  if (res.status === 204) return null;
  return res.json();
}

export function fetchHosts() {
  return request('/docker/hosts');
}

export function addHost(hostConfig) {
  return request('/docker/hosts', {
    method: 'POST',
    body: JSON.stringify(hostConfig),
  });
}

export function deleteHost(hostId) {
  return request(`/docker/hosts/${hostId}`, { method: 'DELETE' });
}

export function fetchContainers(hostId) {
  return request(`/docker/hosts/${hostId}/containers`);
}

export function fetchServices(hostId) {
  return request(`/docker/hosts/${hostId}/services`);
}

export function controlContainer(hostId, containerId, action) {
  return request(`/docker/hosts/${hostId}/containers/${containerId}/${action}`, {
    method: 'POST',
  });
}
