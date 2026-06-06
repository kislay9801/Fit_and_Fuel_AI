/**
 * API client for the FastAPI backend.
 * Base URL from VITE_API_URL env var, defaults to localhost:8000.
 */

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

async function request(path, options = {}, userId = null) {
  const url = `${BASE_URL}${path}`
  const headers = { 'Content-Type': 'application/json', ...options.headers }
  if (userId) {
    headers['X-User-Id'] = userId
  }
  const res = await fetch(url, { ...options, headers })
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: res.statusText }))
    throw new Error(err.detail || `Request failed: ${res.status}`)
  }
  return res.json()
}

// ─── Sessions ────────────────────────────────────────────────────────────────

export async function saveSession(userId, sessionData) {
  return request(
    '/api/sessions/',
    {
      method: 'POST',
      body: JSON.stringify({ user_id: userId, ...sessionData }),
    },
    userId,
  )
}

export async function getSessions(userId) {
  return request(`/api/sessions/${userId}`, {}, userId)
}

export async function deleteSession(sessionId, userId) {
  return request(
    `/api/sessions/${sessionId}?user_id=${encodeURIComponent(userId)}`,
    { method: 'DELETE' },
    userId,
  )
}

// ─── Coaching ────────────────────────────────────────────────────────────────

export async function getCoachingSummary(sessionData) {
  return request('/api/coaching/summary', {
    method: 'POST',
    body: JSON.stringify(sessionData),
  })
}
