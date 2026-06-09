import React, { useState } from 'react';
import { Timer, Zap, ArrowUpRight, ZoomIn } from 'lucide-react';
import ImageModal from '../../components/ImageModal';

export default function Warmups() {
  const [modalImage, setModalImage] = useState(null);

  const exercises = [
    {
      name: "Dynamic Hamstring Stretch",
      desc: "Swing one leg forward and backward, keeping your torso upright. This stretches the hamstrings dynamically without holding a static position, perfect before a run or leg day.",
      img: "https://i.barbend.com/274/303/636/0/hamstring-stretch-barbend.com_.webp"
    },
    {
      name: "Box Jumps / Plyometrics",
      desc: "Explosive jumps onto a sturdy box. They wake up the central nervous system, activate fast-twitch muscle fibers, and prime your body for heavy lifting or sprinting.",
      img: "https://experiencelife.lifetime.life/wp-content/uploads/2021/03/Box-Jump-e1745506954713.jpg"
    },
    {
      name: "High Knees",
      desc: "A cardiovascular warm-up that involves running in place while bringing your knees up to waist level. Great for getting the heart rate up quickly.",
      img: "https://media1.popsugar-assets.com/files/thumbor/KIq7wa75ZOHwkq2xKqIkpnpnSmM=/fit-in/1456x1456/filters:format_auto():extract_cover():upscale()/2019/02/26/720/n/1922729/11d22cab33f367ac_4.jpg"
    },
    {
      name: "Arm Circles & Shoulder Rolls",
      desc: "Small to large circles with your arms, both forwards and backwards. Crucial for warming up the rotator cuff before any upper body push or pull movements.",
      img: "https://i.ytimg.com/vi/140RTNMciH8/maxresdefault.jpg"
    },
    {
      name: "Glute Bridges",
      desc: "Lying on your back and thrusting your hips upwards. This activates the glutes and stabilizes the core, essential before squats or deadlifts.",
      img: "https://experiencelife.lifetime.life/wp-content/uploads/2021/03/Glute-Bridge-e1741625552599.jpg"
    },
    {
      name: "Walking Lunges",
      desc: "Stepping forward into a lunge and continuing to walk. Opens up the hips, stretches the hip flexors, and warms up the quads and glutes.",
      img: "https://hitmymacros.com/wp-content/uploads/2021/08/Walking-Lunges-1024x678.jpg"
    }
  ];

  return (
    <>
      <div className="max-w-5xl mx-auto space-y-12 pb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
        
        {/* Header Section */}
        <div 
          className="relative rounded-3xl overflow-hidden h-80 flex items-center justify-center cursor-pointer group"
          onClick={() => setModalImage("https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=1200&q=80")}
        >
          <img 
            src="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=1200&q=80" 
            alt="Warm Up" 
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 to-slate-900/40"></div>
          
          <div className="absolute top-4 right-4 bg-black/50 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity text-white">
            <ZoomIn className="w-5 h-5" />
          </div>

          <div className="relative z-10 text-center text-white px-6">
            <div className="inline-flex items-center justify-center p-3 bg-amber-500 rounded-full mb-4 shadow-lg shadow-amber-500/30">
              <Timer className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">Warm-Up Exercises</h1>
            <p className="text-lg md:text-xl text-amber-50 max-w-2xl mx-auto font-medium">
              Prime your body for peak performance and protect yourself from unnecessary injuries.
            </p>
          </div>
        </div>

        {/* Why Necessary */}
        <div className="bg-gradient-to-br from-amber-500 to-orange-600 p-8 md:p-10 rounded-3xl shadow-lg text-white">
          <div className="flex items-center gap-3 mb-4">
            <Zap className="w-8 h-8 text-amber-100" />
            <h2 className="text-2xl font-bold">Why Are Warm-ups Necessary?</h2>
          </div>
          <ul className="grid md:grid-cols-2 gap-4 text-amber-50 text-lg">
            <li className="flex items-start gap-2">
              <ArrowUpRight className="w-6 h-6 shrink-0 mt-0.5 text-amber-200" />
              <span>Increases blood flow and muscle temperature.</span>
            </li>
            <li className="flex items-start gap-2">
              <ArrowUpRight className="w-6 h-6 shrink-0 mt-0.5 text-amber-200" />
              <span>Improves joint mobility and range of motion.</span>
            </li>
            <li className="flex items-start gap-2">
              <ArrowUpRight className="w-6 h-6 shrink-0 mt-0.5 text-amber-200" />
              <span>Activates the central nervous system.</span>
            </li>
            <li className="flex items-start gap-2">
              <ArrowUpRight className="w-6 h-6 shrink-0 mt-0.5 text-amber-200" />
              <span>Reduces the risk of muscle strains and tears.</span>
            </li>
          </ul>
        </div>

        {/* How to do it */}
        <div className="space-y-6">
          <h2 className="text-3xl font-extrabold text-slate-900 px-2">Essential Warm-Up Movements</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {exercises.map((ex, idx) => (
              <div key={idx} className="bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-100 flex flex-col group">
                <div 
                  className="h-48 overflow-hidden relative cursor-pointer"
                  onClick={() => setModalImage(ex.img)}
                >
                  <img 
                    src={ex.img} 
                    alt={ex.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors"></div>
                  <div className="absolute top-3 right-3 bg-black/50 p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity text-white">
                    <ZoomIn className="w-4 h-4" />
                  </div>
                </div>
                <div className="p-6 flex-1 flex flex-col">
                  <h3 className="text-xl font-bold text-slate-900 mb-3">{ex.name}</h3>
                  <p className="text-slate-600 text-sm leading-relaxed flex-1">
                    {ex.desc}
                  </p>
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
