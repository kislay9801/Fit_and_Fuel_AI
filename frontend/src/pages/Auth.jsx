import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { signUpWithEmail, signInWithEmail } from '../firebase/auth'
import { createUserProfile } from '../firebase/firestore'
import { Dumbbell, Activity, ShieldCheck, BarChart3, AlertCircle, Loader2 } from 'lucide-react'

export default function Auth() {
  const navigate = useNavigate()
  const [mode, setMode]         = useState('login')
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [name, setName]         = useState('')
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    if (mode === 'signup') {
      const { user, error: signUpError } = await signUpWithEmail(email, password, name)
      if (signUpError) { setError(signUpError); setLoading(false); return }
      await createUserProfile(user.uid, { email: user.email, displayName: name || email.split('@')[0] })
      navigate('/dashboard', { replace: true })
    } else {
      const { user, error: signInError } = await signInWithEmail(email, password)
      if (signInError) { setError(signInError); setLoading(false); return }
      navigate('/dashboard', { replace: true })
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* LEFT: Branding panel (Strictly slate/blue theme, no arbitrary gradients) */}
      <div className="hidden lg:flex flex-col justify-between w-[480px] flex-shrink-0 p-12 bg-blue-600">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Dumbbell className="text-white w-8 h-8" />
            <h1 className="text-white font-bold text-2xl tracking-tight">
              Fit &amp; Fuel AI
            </h1>
          </div>
          <p className="text-blue-200 text-xs uppercase tracking-widest">Elite Coaching Platform</p>
        </div>

        <div>
          <div className="mb-8">
            <span className="bg-white/20 text-white text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full">
              Powered by MediaPipe
            </span>
          </div>
          <h2 className="text-white font-bold text-4xl leading-tight mb-4">
            Train Smarter.<br />Move Better.
          </h2>
          <p className="text-blue-100 text-base leading-relaxed">
            Real-time AI form analysis for squats, push-ups, and deadlifts.
            Get coaching-grade feedback without a coach.
          </p>

          <div className="mt-8 flex flex-col gap-4">
            {[
              { icon: Activity, label: 'Live form scoring — 0 to 100 per rep' },
              { icon: ShieldCheck, label: 'Injury risk detection in real-time' },
              { icon: BarChart3, label: 'Session history stored in your account' },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-3">
                <Icon className="text-blue-200 w-5 h-5" />
                <span className="text-blue-100 text-sm">{label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {[
            { value: '33', unit: 'landmarks', label: 'Tracked' },
            { value: '30', unit: 'fps', label: 'Real-time' },
            { value: '3', unit: 'exercises', label: 'Supported' },
          ].map(({ value, unit, label }) => (
            <div key={label} className="bg-white/10 rounded-xl p-3 text-center border border-white/5">
              <div className="text-white font-bold text-xl">{value}</div>
              <div className="text-blue-200 text-[10px] uppercase tracking-wider">{unit}</div>
              <div className="text-blue-300 text-[10px]">{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT: Auth form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden mb-8 text-center flex flex-col items-center">
            <Dumbbell className="text-blue-600 w-10 h-10 mb-2" />
            <h1 className="font-bold text-2xl text-slate-900">Fit &amp; Fuel AI</h1>
            <p className="text-slate-500 text-xs uppercase tracking-widest">Elite Coaching Platform</p>
          </div>

          <h2 className="font-bold text-slate-900 text-3xl mb-2">
            {mode === 'login' ? 'Welcome back' : 'Create your account'}
          </h2>
          <p className="text-slate-500 text-sm mb-8">
            {mode === 'login'
              ? 'Sign in to access your training dashboard.'
              : 'Start tracking your form today — free forever.'}
          </p>

          {/* Toggle */}
          <div className="flex bg-slate-100 rounded-lg p-1 mb-8 border border-slate-200">
            {['login', 'signup'].map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => { setMode(m); setError(null) }}
                className={`flex-1 py-2 rounded-md text-sm font-semibold transition-all duration-200 ${
                  mode === m
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                {m === 'login' ? 'Sign In' : 'Sign Up'}
              </button>
            ))}
          </div>

          {/* Error banner */}
          {error && (
            <div className="mb-6 flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-lg animate-in slide-in-from-top-2">
              <AlertCircle className="text-red-500 w-5 h-5 flex-shrink-0 mt-0.5" />
              <p className="text-red-700 text-sm font-medium leading-relaxed">{error}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {mode === 'signup' && (
              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">
                  Display Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Alex Rivera"
                  className="w-full border border-slate-300 rounded-lg px-4 py-3 text-sm text-slate-900 bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow"
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full border border-slate-300 rounded-lg px-4 py-3 text-sm text-slate-900 bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5 flex justify-between">
                <span>Password</span>
                {mode === 'signup' && <span className="text-slate-400 normal-case font-normal">(min. 6 characters)</span>}
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full border border-slate-300 rounded-lg px-4 py-3 text-sm text-slate-900 bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 mt-4 rounded-lg font-bold text-sm text-white transition-all duration-200 flex justify-center items-center ${
                loading 
                  ? 'bg-blue-400 cursor-not-allowed' 
                  : 'bg-blue-600 hover:bg-blue-700 active:scale-[0.98] shadow-[0_4px_14px_0_rgba(37,99,235,0.39)] hover:shadow-[0_6px_20px_rgba(37,99,235,0.23)]'
              }`}
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  {mode === 'login' ? 'Signing in...' : 'Creating account...'}
                </>
              ) : (
                mode === 'login' ? 'Sign In →' : 'Create Account →'
              )}
            </button>
          </form>

          {/* Switch mode link */}
          <p className="text-center text-sm text-slate-500 mt-8">
            {mode === 'login'
              ? "Don't have an account? "
              : 'Already have an account? '}
            <button
              type="button"
              onClick={() => { setMode(mode === 'login' ? 'signup' : 'login'); setError(null) }}
              className="text-blue-600 font-semibold hover:text-blue-700 hover:underline transition-colors"
            >
              {mode === 'login' ? 'Sign Up' : 'Sign In'}
            </button>
          </p>

          <p className="text-center text-xs text-slate-400 mt-8">
            By continuing, you agree to our Terms of Service and Privacy Policy.
          </p>
        </div>
      </div>
    </div>
  )
}
