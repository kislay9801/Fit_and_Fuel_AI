/**
 * firebase/firestore.js
 * Firestore helpers for sessions and users.
 *
 * Collections:
 *   users/{uid}           — user profile document
 *   sessions/{docId}      — session records (owned by userId)
 *
 * Security: Firestore rules should enforce that users can only
 * read/write their own data (see FIRESTORE_RULES.md).
 */

import {
  getFirestore,
  collection,
  doc,
  setDoc,
  addDoc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp,
  updateDoc,
  increment,
} from 'firebase/firestore'
import app from './firebase'

export const db = getFirestore(app)

// ── USERS ──────────────────────────────────────────────────────────────────────

/**
 * Create or update a user profile document in Firestore.
 * Called after successful sign-up.
 */
export async function createUserProfile(uid, { email, displayName = '' }) {
  try {
    const userRef = doc(db, 'users', uid)
    const snap = await getDoc(userRef)

    if (!snap.exists()) {
      await setDoc(userRef, {
        uid,
        email,
        displayName: displayName || email.split('@')[0],
        totalSessions: 0,
        avgFormScore: 0,
        bestScore: 0,
        createdAt: serverTimestamp(),
      })
    }
    return { error: null }
  } catch (err) {
    console.error('createUserProfile error:', err)
    return { error: err.message }
  }
}

/**
 * Fetch all user profile documents (admin view).
 * Returns { users: [...], error }. Sorted by most recently active first.
 */
export async function getAllUsers() {
  try {
    const snap = await getDocs(collection(db, 'users'))
    const users = snap.docs.map(d => {
      const data = d.data()
      return {
        id: d.id,
        ...data,
        createdAt: data.createdAt?.toDate?.() ?? null,
        lastSessionAt: data.lastSessionAt?.toDate?.() ?? null,
      }
    })
    users.sort((a, b) => {
      const at = a.lastSessionAt?.getTime?.() ?? a.createdAt?.getTime?.() ?? 0
      const bt = b.lastSessionAt?.getTime?.() ?? b.createdAt?.getTime?.() ?? 0
      return bt - at
    })
    return { users, error: null }
  } catch (err) {
    console.error('getAllUsers error:', err)
    return { users: [], error: err.message }
  }
}

/**
 * Fetch a user's profile document.
 * Returns { data, error }.
 */
export async function getUserProfile(uid) {
  try {
    const snap = await getDoc(doc(db, 'users', uid))
    if (!snap.exists()) return { data: null, error: 'User profile not found.' }
    return { data: { id: snap.id, ...snap.data() }, error: null }
  } catch (err) {
    return { data: null, error: err.message }
  }
}

// ── SESSIONS ───────────────────────────────────────────────────────────────────

/**
 * Save a session to Firestore.
 * Also updates user aggregate stats (totalSessions, avgFormScore, bestScore).
 *
 * @param {string} userId - Firebase Auth UID
 * @param {object} sessionData
 *   { exercise, score, reps, issues, riskFlags, coachingSummary }
 * Returns { id, error }.
 */
export async function saveSessionToFirestore(userId, sessionData) {
  try {
    const { exercise, score, reps = 0, issues = [], riskFlags = [], coachingSummary = '', bestScore = score, worstScore = score } = sessionData

    // Add session document
    const docRef = await addDoc(collection(db, 'sessions'), {
      userId,
      exercise,
      score,
      reps,
      issues,
      riskFlags,
      coachingSummary,
      bestScore,
      worstScore,
      createdAt: serverTimestamp(),
    })

    // Update user aggregate stats
    const userRef = doc(db, 'users', userId)
    const userSnap = await getDoc(userRef)

    if (userSnap.exists()) {
      const userData = userSnap.data()
      const prevTotal = userData.totalSessions || 0
      const prevAvg   = userData.avgFormScore || 0
      const prevBest  = userData.bestScore || 0

      const newTotal = prevTotal + 1
      const newAvg   = Math.round((prevAvg * prevTotal + score) / newTotal)
      const newBest  = Math.max(prevBest, bestScore)

      await updateDoc(userRef, {
        totalSessions: newTotal,
        avgFormScore:  newAvg,
        bestScore:     newBest,
        lastSessionAt: serverTimestamp(),
      })
    } else {
      // Profile doesn't exist yet — create it
      await setDoc(userRef, {
        uid:           userId,
        totalSessions: 1,
        avgFormScore:  score,
        bestScore:     score,
        lastSessionAt: serverTimestamp(),
        createdAt:     serverTimestamp(),
      }, { merge: true })
    }

    return { id: docRef.id, error: null }
  } catch (err) {
    console.error('saveSessionToFirestore error:', err)
    return { id: null, error: err.message }
  }
}

/**
 * Get all sessions for a user, ordered by most recent first.
 * @param {string} userId
 * @param {number} maxResults - limit (default 100)
 * Returns { sessions: [...], error }
 */
export async function getUserSessions(userId, maxResults = 100) {
  try {
    const q = query(
      collection(db, 'sessions'),
      where('userId', '==', userId),
      limit(maxResults)
    )
    const snap = await getDocs(q)
    let sessions = snap.docs.map(d => ({
      id: d.id,
      ...d.data(),
      // Convert Firestore Timestamp to JS Date
      createdAt: d.data().createdAt?.toDate?.() ?? new Date(),
    }))
    
    // Sort client-side to avoid needing a Firestore composite index
    sessions.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())

    return { sessions, error: null }
  } catch (err) {
    console.error('getUserSessions error:', err)
    return { sessions: [], error: err.message }
  }
}

/**
 * Get recent sessions (last N) for dashboard display.
 */
export async function getRecentSessions(userId, count = 5) {
  const { sessions, error } = await getUserSessions(userId, count)
  return { sessions, error }
}

/**
 * Get user dashboard stats from their profile document.
 */
export async function getDashboardStats(userId) {
  const { data, error } = await getUserProfile(userId)
  if (error) return { stats: null, error }

  return {
    stats: {
      totalSessions: data?.totalSessions ?? 0,
      avgFormScore:  data?.avgFormScore  ?? 0,
      bestScore:     data?.bestScore     ?? 0,
    },
    error: null,
  }
}
