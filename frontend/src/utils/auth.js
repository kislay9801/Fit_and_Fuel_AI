/**
 * Mock authentication using localStorage.
 * No real auth — accepts any email/password.
 * Persists user session across page refreshes.
 */

const AUTH_KEY = 'fitfuel_auth'

export function mockSignUp(email, password) {
  if (!email || !password || password.length < 6) {
    return { error: 'Password must be at least 6 characters.' }
  }
  const user = {
    id: `user_${email.replace(/[^a-z0-9]/gi, '_')}`,
    email,
    created_at: new Date().toISOString(),
  }
  localStorage.setItem(AUTH_KEY, JSON.stringify({ user, token: 'mock_token' }))
  return { user, error: null }
}

export function mockSignIn(email, password) {
  if (!email || !password) {
    return { error: 'Email and password are required.' }
  }
  if (password.length < 6) {
    return { error: 'Invalid email or password.' }
  }
  const user = {
    id: `user_${email.replace(/[^a-z0-9]/gi, '_')}`,
    email,
    created_at: new Date().toISOString(),
  }
  localStorage.setItem(AUTH_KEY, JSON.stringify({ user, token: 'mock_token' }))
  return { user, error: null }
}

export function mockSignOut() {
  localStorage.removeItem(AUTH_KEY)
}

export function getSession() {
  try {
    const raw = localStorage.getItem(AUTH_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    return parsed?.user ? parsed : null
  } catch {
    return null
  }
}

export function getUser() {
  return getSession()?.user ?? null
}
