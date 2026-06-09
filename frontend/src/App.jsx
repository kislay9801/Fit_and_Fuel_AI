import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { lazy, Suspense, useState, useEffect } from 'react'
import { onAuthChange } from './firebase/auth'
import Layout from './components/Layout'

const Landing      = lazy(() => import('./pages/Landing'))
const Auth         = lazy(() => import('./pages/Auth'))
const Dashboard    = lazy(() => import('./pages/Dashboard'))
const ExerciseSelect = lazy(() => import('./pages/ExerciseSelect'))
const Session      = lazy(() => import('./pages/Session'))
const History      = lazy(() => import('./pages/History'))

const Nutrition    = lazy(() => import('./pages/services/Nutrition'))
const Injuries     = lazy(() => import('./pages/services/Injuries'))
const Warmups      = lazy(() => import('./pages/services/Warmups'))
const Athletes     = lazy(() => import('./pages/services/Athletes'))

function AppLoading() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8f9ff' }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
        <div style={{ width: '40px', height: '40px', borderRadius: '50%', border: '3px solid #0066ff', borderTopColor: 'transparent', animation: 'spin 0.8s linear infinite' }} />
        <p style={{ color: '#4b5563', fontFamily: 'Montserrat, sans-serif', fontSize: '14px', fontWeight: '500' }}>Loading...</p>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}

function ProtectedRoute({ children, user }) {
  if (!user) return <Navigate to="/auth" replace />
  return children
}

export default function App() {
  // undefined = still checking auth state (show loading)
  // null      = confirmed not logged in
  // object    = Firebase User object
  const [user, setUser] = useState(undefined)

  useEffect(() => {
    // onAuthChange returns the Firebase unsubscribe function
    const unsub = onAuthChange((firebaseUser) => {
      setUser(firebaseUser)   // null if signed out, User if signed in
    })
    return unsub  // cleanup on unmount
  }, [])

  // Show error if Firebase is not configured
  if (!import.meta.env.VITE_FIREBASE_API_KEY) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#f8f9ff', padding: '20px', textAlign: 'center' }}>
        <div style={{ background: '#ba1a1a', color: 'white', padding: '12px', borderRadius: '50%', marginBottom: '16px' }}>
          <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
        </div>
        <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#0b1c30', marginBottom: '8px'  }}>Firebase Configuration Missing</h1>
        <p style={{ color: '#424656', fontFamily: 'Inter, sans-serif', maxWidth: '500px', lineHeight: '1.6' }}>
          The app is waiting for Firebase credentials to start. <br/><br/>
          Please go to <b>frontend/.env</b> and fill in your Firebase configuration keys (API Key, Project ID, etc.) from the Firebase Console.
        </p>
      </div>
    )
  }

  // Show fullscreen loading until Firebase resolves auth state
  if (user === undefined) {
    return <AppLoading />
  }

  return (
    <BrowserRouter>
      <Suspense fallback={<AppLoading />}>
        <Routes>
          <Route path="/"   element={user ? <Navigate to="/dashboard" replace /> : <Landing />} />
          <Route path="/auth" element={user ? <Navigate to="/dashboard" replace /> : <Auth />} />

          <Route path="/dashboard" element={
            <ProtectedRoute user={user}>
              <Layout user={user}><Dashboard user={user} /></Layout>
            </ProtectedRoute>
          } />
          <Route path="/exercises" element={
            <ProtectedRoute user={user}>
              <Layout user={user}><ExerciseSelect /></Layout>
            </ProtectedRoute>
          } />
          <Route path="/session/:exercise" element={
            <ProtectedRoute user={user}>
              <Layout user={user}><Session user={user} /></Layout>
            </ProtectedRoute>
          } />
          <Route path="/history" element={
            <ProtectedRoute user={user}>
              <Layout user={user}><History user={user} /></Layout>
            </ProtectedRoute>
          } />
          
          <Route path="/services/nutrition" element={
            <ProtectedRoute user={user}>
              <Layout user={user}><Nutrition /></Layout>
            </ProtectedRoute>
          } />
          <Route path="/services/injuries" element={
            <ProtectedRoute user={user}>
              <Layout user={user}><Injuries /></Layout>
            </ProtectedRoute>
          } />
          <Route path="/services/warmups" element={
            <ProtectedRoute user={user}>
              <Layout user={user}><Warmups /></Layout>
            </ProtectedRoute>
          } />
          <Route path="/services/athletes" element={
            <ProtectedRoute user={user}>
              <Layout user={user}><Athletes /></Layout>
            </ProtectedRoute>
          } />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}
