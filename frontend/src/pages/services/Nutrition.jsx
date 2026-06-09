import React, { useState } from 'react';
import { Apple, Leaf, Droplet, Flame, ZoomIn } from 'lucide-react';
import ImageModal from '../../components/ImageModal';

export default function Nutrition() {
  const [modalImage, setModalImage] = useState(null);

  const nutrients = [
    {
      type: "Macronutrient",
      name: "Proteins",
      description: "Proteins are the building blocks of the body, crucial for repairing tissue, building muscle, and producing enzymes and hormones. They are made of amino acids.",
      sources: "Chicken breast, eggs, Greek yogurt, lentils, tofu.",
      icon: Flame,
      color: "blue",
      img: "https://images.unsplash.com/photo-1532550907401-a500c9a57435?auto=format&fit=crop&w=800&q=80"
    },
    {
      type: "Macronutrient",
      name: "Carbohydrates",
      description: "Carbohydrates are the body's primary energy source. They are broken down into glucose, which fuels your muscles and brain during workouts.",
      sources: "Oats, brown rice, sweet potatoes, bananas, quinoa.",
      icon: Flame,
      color: "blue",
      img: "https://images.unsplash.com/photo-1505253716362-afaea1d3d1af?auto=format&fit=crop&w=800&q=80"
    },
    {
      type: "Macronutrient",
      name: "Fats",
      description: "Dietary fats are essential for hormone production, protecting your organs, and nutrient absorption. They also provide sustained energy for long-duration activities.",
      sources: "Avocados, nuts, olive oil, salmon, chia seeds.",
      icon: Flame,
      color: "blue",
      img: "https://avicennacardiology.com/wp-content/uploads/2025/05/Healthy-Fats-and-Why-Do-They-Matter-for-Your-Health.jpg"
    },
    {
      type: "Micronutrient",
      name: "Vitamins",
      description: "Vitamins are organic compounds required in small quantities for various metabolic processes, immune function, and energy production (like B-complex vitamins).",
      sources: "Citrus fruits (Vitamin C), spinach (Vitamin K), sunlight/fortified milk (Vitamin D).",
      icon: Droplet,
      color: "purple",
      img: "https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&w=800&q=80"
    },
    {
      type: "Micronutrient",
      name: "Minerals",
      description: "Minerals are inorganic elements needed for bone health, muscle contraction (calcium, magnesium), and oxygen transport (iron).",
      sources: "Dairy (Calcium), red meat/spinach (Iron), bananas (Potassium).",
      icon: Droplet,
      color: "purple",
      img: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80"
    },
    {
      type: "Micronutrient",
      name: "Water",
      description: "Water makes up about 60% of body weight. It regulates body temperature, lubricates joints, and transports nutrients. Dehydration severely impacts performance.",
      sources: "Drinking water, watery fruits like watermelon and cucumbers.",
      icon: Droplet,
      color: "purple",
      img: "https://images.unsplash.com/photo-1523362628745-0c100150b504?auto=format&fit=crop&w=800&q=80"
    }
  ];

  return (
    <>
      <div className="max-w-5xl mx-auto space-y-12 pb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
        
        {/* Header Section */}
        <div 
          className="relative rounded-3xl overflow-hidden h-80 flex items-center justify-center cursor-pointer group"
          onClick={() => setModalImage("https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=1200&q=80")}
        >
          <img 
            src="https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=1200&q=80" 
            alt="Healthy Food" 
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 to-slate-900/40"></div>
          
          <div className="absolute top-4 right-4 bg-black/50 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity text-white">
            <ZoomIn className="w-5 h-5" />
          </div>

          <div className="relative z-10 text-center text-white px-6">
            <div className="inline-flex items-center justify-center p-3 bg-green-500 rounded-full mb-4 shadow-lg shadow-green-500/30">
              <Apple className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">Nutritional Information</h1>
            <p className="text-lg md:text-xl text-green-50 max-w-2xl mx-auto font-medium">
              Fuel your body with the right nutrients to maximize performance, accelerate recovery, and achieve your fitness goals.
            </p>
          </div>
        </div>

        {/* What is Nutrition? */}
        <section className="bg-white p-8 md:p-10 rounded-3xl shadow-sm border border-slate-100">
          <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-3">
            <Leaf className="w-6 h-6 text-green-500" />
            What is Nutrition?
          </h2>
          <p className="text-slate-600 leading-relaxed text-lg">
            Nutrition is the biochemical and physiological process by which an organism uses food to support its life. It includes ingestion, absorption, assimilation, biosynthesis, catabolism, and excretion. For athletes and fitness enthusiasts, proper nutrition is the foundation of peak performance and optimal recovery.
          </p>
        </section>

        {/* Detailed Nutrients Grid */}
        <div className="space-y-6">
          <h2 className="text-3xl font-extrabold text-slate-900 px-2">Essential Nutrients Breakdown</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {nutrients.map((nutrient, idx) => (
              <div key={idx} className="bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-sm flex flex-col group">
                <div 
                  className="h-48 overflow-hidden relative cursor-pointer"
                  onClick={() => setModalImage(nutrient.img)}
                >
                  <img 
                    src={nutrient.img} 
                    alt={nutrient.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors"></div>
                  <div className="absolute top-3 right-3 bg-black/50 p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity text-white">
                    <ZoomIn className="w-4 h-4" />
                  </div>
                </div>
                
                <div className="p-8 flex-1 relative">
                  <div className={`absolute -top-6 right-8 w-12 h-12 bg-${nutrient.color}-500 rounded-2xl flex items-center justify-center shadow-lg shadow-${nutrient.color}-500/30`}>
                    <nutrient.icon className="w-6 h-6 text-white" />
                  </div>
                  
                  <span className={`text-xs font-bold uppercase tracking-wider text-${nutrient.color}-600 mb-1 block`}>
                    {nutrient.type}
                  </span>
                  <h3 className="text-2xl font-bold text-slate-900 mb-3">{nutrient.name}</h3>
                  <p className="text-slate-600 leading-relaxed mb-4">
                    {nutrient.description}
                  </p>
                  
                  <div className="mt-auto pt-4 border-t border-slate-100">
                    <h4 className="font-bold text-sm text-slate-800 mb-1">Common Sources:</h4>
                    <p className="text-slate-600 text-sm">{nutrient.sources}</p>
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
