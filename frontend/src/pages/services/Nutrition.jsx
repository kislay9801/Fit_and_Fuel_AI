import { useState } from 'react'
import { Apple, Leaf, ChevronRight, Stethoscope } from 'lucide-react'
import Modal from '../../components/Modal'
import { NUTRITION_CATEGORIES, INJURY_NUTRIENTS, NUTRIENT_INFO } from '../../data/nutrition'

function NutrientList({ nutrients }) {
  return (
    <div className="flex flex-col gap-4">
      {nutrients.map(n => (
        <div key={n.name} className="border-b border-slate-100 last:border-0 pb-4 last:pb-0">
          <h4 className="font-bold text-slate-900 mb-1">{n.name}</h4>
          <p className="text-sm text-slate-600 leading-relaxed mb-2">{n.desc}</p>
          <div className="flex items-start gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-lg px-2.5 py-1.5 w-fit">
            <Leaf className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
            <span>{n.sources}</span>
          </div>
        </div>
      ))}
    </div>
  )
}

export default function Nutrition() {
  const [openCat, setOpenCat] = useState(null)      // category object
  const [openInjury, setOpenInjury] = useState(null) // injury object

  return (
    <div className="max-w-5xl mx-auto space-y-10 px-4 sm:px-6 pt-6 pb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Hero */}
      <div className="rounded-3xl bg-gradient-to-br from-green-600 to-emerald-500 text-white p-8 sm:p-10 shadow-md">
        <div className="inline-flex items-center justify-center p-3 bg-white/20 rounded-2xl mb-4">
          <Apple className="w-7 h-7" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-3">Nutrition</h1>
        <p className="text-green-50 max-w-2xl leading-relaxed">
          Fuel your body with the right nutrients to maximize performance, accelerate recovery, and stay healthy.
          Tap a function to see the nutrients behind it and where to get them.
        </p>
      </div>

      {/* Nutrients by function */}
      <section>
        <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight mb-1">Nutrients by Function</h2>
        <p className="text-slate-500 text-sm mb-6">What each system needs and why it matters for athletes.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {NUTRITION_CATEGORIES.map(cat => (
            <button
              key={cat.key}
              onClick={() => setOpenCat(cat)}
              className="text-left bg-white border border-slate-200 rounded-2xl p-5 hover:border-emerald-300 hover:shadow-lg hover:-translate-y-0.5 transition-all group"
            >
              <div className="text-3xl mb-3">{cat.emoji}</div>
              <h3 className="font-bold text-lg text-slate-900 tracking-tight mb-1">{cat.title}</h3>
              <p className="text-sm text-slate-500 leading-snug line-clamp-3 mb-3">{cat.why}</p>
              <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                {cat.nutrients.length} nutrients
                <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* Nutrients for injuries / conditions */}
      <section>
        <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight mb-1">Nutrients for Injuries & Conditions</h2>
        <p className="text-slate-500 text-sm mb-6">Dealing with something specific? Tap it to see the nutrients that support prevention and recovery.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {INJURY_NUTRIENTS.map(item => (
            <button
              key={item.condition}
              onClick={() => setOpenInjury(item)}
              className="text-left bg-white border border-slate-200 rounded-2xl p-5 hover:border-blue-300 hover:shadow-lg hover:-translate-y-0.5 transition-all group"
            >
              <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center mb-3">
                <Stethoscope className="w-5 h-5 text-blue-600" />
              </div>
              <h3 className="font-bold text-slate-900 tracking-tight mb-2">{item.condition}</h3>
              <div className="flex flex-wrap gap-1.5">
                {item.nutrients.map(n => (
                  <span key={n} className="text-[10px] px-2 py-0.5 bg-slate-100 text-slate-600 rounded-md font-bold">{n}</span>
                ))}
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Category modal */}
      {openCat && (
        <Modal
          title={`${openCat.emoji} ${openCat.title}`}
          subtitle={openCat.why}
          accent="text-slate-900"
          onClose={() => setOpenCat(null)}
        >
          <NutrientList nutrients={openCat.nutrients} />
        </Modal>
      )}

      {/* Injury → nutrient modal */}
      {openInjury && (
        <Modal
          title={openInjury.condition}
          subtitle={openInjury.note}
          accent="text-slate-900"
          onClose={() => setOpenInjury(null)}
        >
          <NutrientList nutrients={openInjury.nutrients.map(name => ({ name, ...NUTRIENT_INFO[name] }))} />
        </Modal>
      )}
    </div>
  )
}
