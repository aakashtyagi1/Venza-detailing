// API Client for BRING IT DIRTY Atelier Backend

const BASE_URL = '/api';

export async function fetchHealth() {
  const res = await fetch(`${BASE_URL}/health`);
  return res.json();
}

export async function fetchLeads(filters = {}) {
  const params = new URLSearchParams();
  if (filters.status && filters.status !== 'ALL') {
    params.append('status', filters.status);
  }
  if (filters.search) {
    params.append('search', filters.search);
  }
  const res = await fetch(`${BASE_URL}/leads?${params.toString()}`);
  if (!res.ok) throw new Error('Failed to fetch leads');
  return res.json();
}

export async function createBooking(bookingPayload) {
  const res = await fetch(`${BASE_URL}/leads`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(bookingPayload)
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to submit booking');
  }
  return res.json();
}

export async function updateLeadStatus(id, status, notes) {
  const res = await fetch(`${BASE_URL}/leads/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status, notes })
  });
  if (!res.ok) throw new Error('Failed to update lead');
  return res.json();
}

export async function deleteLead(id) {
  const res = await fetch(`${BASE_URL}/leads/${id}`, {
    method: 'DELETE'
  });
  if (!res.ok) throw new Error('Failed to delete lead');
  return res.json();
}

export async function fetchStats() {
  const res = await fetch(`${BASE_URL}/stats`);
  if (!res.ok) throw new Error('Failed to fetch stats');
  return res.json();
}

export async function adminLogin(username, password) {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || 'Authentication failed');
  }
  return res.json();
}

export async function resetSeeds() {
  const res = await fetch(`${BASE_URL}/leads/seed`, { method: 'POST' });
  return res.json();
}
