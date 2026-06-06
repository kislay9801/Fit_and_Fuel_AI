/**
 * firebase/auth.js
 * Reusable Firebase Authentication helpers.
 *
 * Exports:
 *   auth              — Firebase Auth instance
 *   signUpWithEmail   — create account
 *   signInWithEmail   — log in
 *   signOutUser       — log out
 *   onAuthChange      — subscribe to auth state (returns unsubscribe fn)
 *   getCurrentUser    — synchronous current user (may be null before listener fires)
 */

import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged, updateProfile } from 'firebase/auth'
import app from './firebase'

export const auth = getAuth(app)

/**
 * Sign up with email + password.
 * Optionally sets displayName on the profile.
 * Returns { user, error }.
 */
export async function signUpWithEmail(email, password, displayName = '') {
  try {
    const credential = await createUserWithEmailAndPassword(auth, email, password)
    if (displayName) {
      await updateProfile(credential.user, { displayName })
    }
    return { user: credential.user, error: null }
  } catch (err) {
    console.error('SignUp Error:', err)
    return { user: null, error: _friendlyError(err.code) || err.message }
  }
}

/**
 * Sign in with email + password.
 * Returns { user, error }.
 */
export async function signInWithEmail(email, password) {
  try {
    const credential = await signInWithEmailAndPassword(auth, email, password)
    return { user: credential.user, error: null }
  } catch (err) {
    console.error('SignIn Error:', err)
    return { user: null, error: _friendlyError(err.code) || err.message }
  }
}

/**
 * Sign out the current user.
 */
export async function signOutUser() {
  try {
    await signOut(auth)
    return { error: null }
  } catch (err) {
    return { error: err.message }
  }
}

/**
 * Subscribe to auth state changes.
 * Returns unsubscribe function — call it in useEffect cleanup.
 *
 * Usage:
 *   useEffect(() => {
 *     const unsub = onAuthChange(setUser)
 *     return unsub
 *   }, [])
 */
export function onAuthChange(callback) {
  return onAuthStateChanged(auth, callback)
}

/**
 * Get current user synchronously (null if not logged in or before listener fires).
 */
export function getCurrentUser() {
  return auth.currentUser
}

// ── Friendly error messages ────────────────────────────────────────────────────
function _friendlyError(code) {
  const messages = {
    'auth/email-already-in-use':   'An account with this email already exists.',
    'auth/invalid-email':          'Please enter a valid email address.',
    'auth/weak-password':          'Password must be at least 6 characters.',
    'auth/user-not-found':         'No account found with this email.',
    'auth/wrong-password':         'Incorrect password. Please try again.',
    'auth/invalid-credential':     'Incorrect email or password.',
    'auth/too-many-requests':      'Too many failed attempts. Please wait and try again.',
    'auth/network-request-failed': 'Network error. Check your connection.',
    'auth/user-disabled':          'This account has been disabled.',
  }
  return messages[code] || null
}
