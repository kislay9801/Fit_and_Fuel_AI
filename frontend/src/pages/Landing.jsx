import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Dumbbell, Activity, Target, TrendingUp, ShieldCheck, Play, ArrowRight } from 'lucide-react'

export default function Landing() {
  const navigate = useNavigate()

  // Smooth-scroll to an on-page section by id
  const scrollTo = (id) => (e) => {
    e.preventDefault()
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    // Simple intersection observer for fade-in animations
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('opacity-100', 'translate-y-0')
          entry.target.classList.remove('opacity-0', 'translate-y-10')
        }
      })
    }, { threshold: 0.1 })

    document.querySelectorAll('.animate-on-scroll').forEach(section => {
      section.classList.add('transition-all', 'duration-700', 'ease-out', 'opacity-0', 'translate-y-10')
      observer.observe(section)
    })

    return () => observer.disconnect()
  }, [])

  return (
    <div className="bg-slate-50 text-slate-900 min-h-screen">
      {/* ── NAV ── */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Dumbbell className="text-blue-600 w-6 h-6" />
            <span className="font-bold text-xl text-slate-900 tracking-tight">Fit &amp; Fuel AI</span>
          </div>
          
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
            <a href="#how-it-works" onClick={scrollTo('how-it-works')} className="hover:text-blue-600 transition-colors">How it Works</a>
            <a href="#features" onClick={scrollTo('features')} className="hover:text-blue-600 transition-colors">Features</a>
            <a href="#get-started" onClick={scrollTo('get-started')} className="hover:text-blue-600 transition-colors">Get Started</a>
          </nav>

          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/auth')}
              className="bg-blue-600 text-white px-5 py-2 rounded-lg font-semibold text-sm hover:bg-blue-700 active:scale-[0.98] transition-all shadow-sm"
            >
              Start Workout
            </button>
          </div>
        </div>
      </header>

      {/* ── HERO ── */}
      <section id="features" className="relative pt-24 pb-32 px-6 overflow-hidden">
        <div className="container mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
          <div className="lg:col-span-6 flex flex-col gap-6 animate-on-scroll">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full w-fit">
              <ShieldCheck className="w-4 h-4" />
              <span className="text-xs font-semibold uppercase tracking-wider">Clinical Precision AI</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-extrabold leading-tight tracking-tight text-slate-900">
              Perfect Your Form With <span className="text-blue-600 bg-blue-50 px-2 rounded-lg">Computer Vision</span>
            </h1>
            
            <p className="text-lg text-slate-600 max-w-xl leading-relaxed">
              Elite performance analysis for professional athletes. Our AI-powered pose estimation tracks 33 skeletal points in real-time to provide immediate corrective feedback.
            </p>
            
            <div className="flex flex-wrap gap-4 pt-4">
              <button
                onClick={() => navigate('/auth')}
                className="bg-blue-600 text-white px-8 py-4 rounded-xl font-bold text-lg flex items-center gap-2 hover:bg-blue-700 hover:shadow-lg hover:-translate-y-0.5 active:scale-[0.98] transition-all"
              >
                Start Your First Session
                <ArrowRight className="w-5 h-5" />
              </button>
              <button
                onClick={scrollTo('how-it-works')}
                className="bg-white border border-slate-300 text-slate-700 px-8 py-4 rounded-xl font-bold text-lg flex items-center gap-2 hover:bg-slate-50 hover:border-slate-400 active:scale-[0.98] transition-all shadow-sm"
              >
                <Play className="w-5 h-5 fill-slate-700" />
                See How It Works
              </button>
            </div>
            
            <div className="flex items-center gap-8 md:gap-12 mt-8 pt-8 border-t border-slate-200">
              {[
                { label: 'ACCURACY', value: '99.8%' },
                { label: 'LATENCY',  value: '<15ms' },
                { label: 'METRICS',  value: '50+'   },
              ].map(({ label, value }) => (
                <div key={label} className="flex flex-col">
                  <span className="text-xs font-bold text-slate-400 tracking-widest mb-1">{label}</span>
                  <span className="text-3xl font-extrabold text-slate-900 tracking-tight">{value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Hero visual */}
          <div className="lg:col-span-6 relative animate-on-scroll" style={{ transitionDelay: '200ms' }}>
            <div className="relative rounded-2xl overflow-hidden border border-slate-200 bg-slate-900 aspect-[4/3] shadow-2xl ring-1 ring-slate-900/5">
              <img
                className="w-full h-full object-cover opacity-90"
                src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&h=600&fit=crop&auto=format"
                alt="Athlete with pose tracking overlay"
              />
              {/* HUD overlays */}
              <div className="absolute inset-0 pointer-events-none p-6 flex flex-col justify-between">
                <div className="flex justify-between items-start">
                  <div className="bg-white/90 backdrop-blur-md px-4 py-2 rounded-lg flex items-center gap-3 shadow-lg border border-slate-200/50">
                    <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse" />
                    <span className="text-xs font-bold tracking-widest text-slate-800">LIVE TRACKING</span>
                  </div>
                  <div className="bg-white/90 backdrop-blur-md px-4 py-2 rounded-lg shadow-lg border border-slate-200/50">
                    <span className="text-xs font-bold tracking-widest text-blue-600">SQUAT DEPTH: 102°</span>
                  </div>
                </div>
                
                <div className="flex justify-center">
                  <div className="bg-white/95 backdrop-blur-md px-8 py-4 rounded-2xl flex gap-10 items-center shadow-xl border border-slate-200/50 border-b-4 border-b-emerald-500">
                    {[
                      { label: 'ALIGNMENT', value: 'OPTIMAL', color: 'text-emerald-600' },
                      { label: 'POWER',     value: '840W',    color: 'text-slate-900' },
                      { label: 'REP',       value: '12/15',   color: 'text-slate-900' },
                    ].map(({ label, value, color }) => (
                      <div key={label} className="flex flex-col items-center">
                        <span className="text-[10px] font-bold tracking-widest text-slate-500 mb-1">{label}</span>
                        <span className={`font-extrabold text-xl ${color}`}>{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Decorative background blobs */}
            <div className="absolute -top-12 -right-12 w-64 h-64 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70 -z-10" />
            <div className="absolute -bottom-12 -left-12 w-64 h-64 bg-emerald-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70 -z-10" />
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="how-it-works" className="py-24 px-6 bg-white border-y border-slate-200">
        <div className="container mx-auto animate-on-scroll">
          <div className="flex flex-col items-center text-center mb-16">
            <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-4">Precision Workflow</h2>
            <div className="w-16 h-1.5 bg-blue-600 rounded-full mb-6" />
            <p className="text-lg text-slate-600 max-w-2xl">
              Four sophisticated steps to anatomical perfection through our proprietary computer vision engine.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { step: '01', icon: Target,      title: 'Select Exercise',  desc: 'Choose from 10 strength, mobility, and cardio analysis modes.' },
              { step: '02', icon: Activity,    title: 'Setup Frame',      desc: 'Our guide ensures your full body is in the optimal analysis zone.' },
              { step: '03', icon: Dumbbell,    title: 'Real-time Data',   desc: 'AI calculates joint angles, alignment, and rep quality in real-time.' },
              { step: '04', icon: TrendingUp,  title: 'Refine Form',      desc: 'Receive coaching cues and review deep-dive session analytics.' },
            ].map(({ step, icon: Icon, title, desc }) => (
              <div key={step} className="group relative overflow-hidden p-8 rounded-2xl bg-slate-50 border border-slate-200 hover:border-blue-300 hover:bg-white hover:shadow-xl transition-all duration-300">
                <div className="flex items-center justify-between mb-6">
                  <div className="w-14 h-14 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600 group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-sm">
                    <Icon className="w-7 h-7" />
                  </div>
                  <span className="text-sm font-black tracking-[0.2em] text-slate-300 group-hover:text-blue-300 transition-colors">{step}</span>
                </div>
                <h3 className="font-bold text-xl text-slate-900 mb-3">{title}</h3>
                <p className="text-slate-600 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section id="get-started" className="py-24 px-6 animate-on-scroll">
        <div className="container mx-auto">
          <div className="rounded-3xl bg-slate-900 p-12 md:p-20 flex flex-col items-center text-center relative overflow-hidden shadow-2xl">
            {/* Decor */}
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/40 via-slate-900 to-slate-900 pointer-events-none" />
            
            <div className="relative z-10 max-w-3xl">
              <h2 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-6">
                Ready to train with <span className="text-blue-400">unmatched precision</span>?
              </h2>
              <p className="text-xl text-slate-300 mb-10">
                Join athletes who have eliminated training injuries and broken plateaus using Fit &amp; Fuel AI Coach.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => navigate('/auth')}
                  className="bg-blue-600 text-white px-10 py-4 rounded-xl font-bold text-lg hover:bg-blue-500 hover:shadow-[0_0_30px_rgba(37,99,235,0.4)] hover:-translate-y-1 active:translate-y-0 transition-all"
                >
                  Get Started for Free
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="bg-white border-t border-slate-200 py-12 px-6">
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <Dumbbell className="text-slate-400 w-5 h-5" />
            <span className="font-bold text-slate-900">Fit &amp; Fuel AI</span>
          </div>
          <div className="flex gap-8 text-sm font-medium text-slate-500">
            <a href="#how-it-works" onClick={scrollTo('how-it-works')} className="hover:text-blue-600 transition-colors">How it Works</a>
            <a href="#features" onClick={scrollTo('features')} className="hover:text-blue-600 transition-colors">Features</a>
            <a href="mailto:kaustubh.kislay@athenaeducation.co.in" className="hover:text-blue-600 transition-colors">Contact Support</a>
          </div>
          <div className="text-sm text-slate-400">
            &copy; {new Date().getFullYear()} Fit &amp; Fuel. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}