import React, { useState } from 'react';
import { Activity, ShieldAlert, HeartPulse, Stethoscope, ZoomIn } from 'lucide-react';
import ImageModal from '../../components/ImageModal';

export default function Injuries() {
  const [modalImage, setModalImage] = useState(null);

  const injuries = [
    {
      name: "ACL Tear",
      cause: "Sudden deceleration, pivoting, or hard landings that overstretch or tear the Anterior Cruciate Ligament in the knee.",
      recovery: "Often requires surgical reconstruction followed by 6-9 months of intensive physical therapy focusing on range of motion and strengthening.",
      icon: ShieldAlert,
      color: "red",
      img: "https://regenexx.com/wp-content/uploads/2025/02/mechanism-of-acl-injury-938x1024.jpg"
    },
    {
      name: "Meniscus Tear (Knee Injury)",
      cause: "Forceful twisting or rotating of the knee, especially when bearing full weight.",
      recovery: "Minor tears can heal with rest and physical therapy. Severe tears may require arthroscopic surgery to trim or repair the cartilage.",
      icon: Activity,
      color: "orange",
      img: "https://www.drbryantan.com/wp-content/uploads/2023/11/Meniscus-Root-Tear.png"
    },
    {
      name: "Muscle Strain",
      cause: "Overstretching or tearing a muscle, often due to lifting too heavy, poor form, or inadequate warm-up.",
      recovery: "R.I.C.E. method (Rest, Ice, Compression, Elevation), gentle stretching once pain subsides, and gradual return to activity.",
      icon: HeartPulse,
      color: "amber",
      img: "https://my.clevelandclinic.org/-/scassets/images/org/health/articles/calf-strain"
    },
    {
      name: "Tendonitis",
      cause: "Inflammation of a tendon caused by repetitive stress or overuse without adequate recovery time.",
      recovery: "Resting the affected area, anti-inflammatory measures, eccentric strengthening exercises, and modifying the movement pattern.",
      icon: Activity,
      color: "red",
      img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRfy9-opvYYeC2EnwJtisnMcsDMfDAJ7Hwpeg&s"
    }
  ];

  return (
    <>
      <div className="max-w-4xl mx-auto space-y-12 px-4 sm:px-6 pt-6 pb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
        
        {/* Header Section */}
        <div 
          className="relative rounded-3xl overflow-hidden h-80 flex items-center justify-center cursor-pointer group"
          onClick={() => setModalImage("https://images.unsplash.com/photo-1576678927484-cc907957088c?auto=format&fit=crop&w=1200&q=80")}
        >
          <img 
            src="https://images.unsplash.com/photo-1576678927484-cc907957088c?auto=format&fit=crop&w=1200&q=80" 
            alt="Injury Recovery" 
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 to-slate-900/40"></div>
          
          <div className="absolute top-4 right-4 bg-black/50 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity text-white">
            <ZoomIn className="w-5 h-5" />
          </div>

          <div className="relative z-10 text-center text-white px-6">
            <div className="inline-flex items-center justify-center p-3 bg-red-500 rounded-full mb-4 shadow-lg shadow-red-500/30">
              <Stethoscope className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">Injury Recovery</h1>
            <p className="text-lg md:text-xl text-red-50 max-w-2xl mx-auto font-medium">
              Understand common gym injuries, why they happen, and the best practices for a safe and effective recovery.
            </p>
          </div>
        </div>

        {/* Intro */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 text-center">
          <h2 className="text-2xl font-bold text-slate-900 mb-3">Listen to Your Body</h2>
          <p className="text-slate-600 leading-relaxed max-w-2xl mx-auto">
            Injuries are setbacks, but they are also learning opportunities. Recognizing the difference between muscle soreness and sharp pain is crucial. Always consult a healthcare professional for an accurate diagnosis.
          </p>
        </div>

        {/* Common Injuries List */}
        <div className="space-y-8">
          <h2 className="text-3xl font-extrabold text-slate-900 px-2">Common Injuries</h2>
          <div className="grid gap-8">
            {injuries.map((injury, idx) => (
              <div key={idx} className="bg-white rounded-3xl overflow-hidden flex flex-col md:flex-row border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                
                <div 
                  className="md:w-1/3 h-48 md:h-auto relative overflow-hidden cursor-pointer group"
                  onClick={() => setModalImage(injury.img)}
                >
                  <img 
                    src={injury.img} 
                    alt={injury.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors"></div>
                  <div className="absolute top-3 right-3 bg-black/50 p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity text-white">
                    <ZoomIn className="w-4 h-4" />
                  </div>
                </div>

                <div className="p-6 md:p-8 flex-1 space-y-4">
                  <div className="flex items-center gap-4 mb-2">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-lg bg-${injury.color}-500 shadow-${injury.color}-500/30`}>
                      <injury.icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900">{injury.name}</h3>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className={`font-bold text-sm uppercase tracking-wider text-${injury.color}-600`}>How it happens</h4>
                    <p className="text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-xl">
                      {injury.cause}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-bold text-sm uppercase tracking-wider text-green-600">Recovery</h4>
                    <p className="text-slate-600 leading-relaxed bg-green-50 p-4 rounded-xl">
                      {injury.recovery}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      <ImageModal 
        isOpen={!!modalImage} 
        onClose={() => setModalImage(null)} 
        imageSrc={modalImage} 
      />
    </>
  );
}
