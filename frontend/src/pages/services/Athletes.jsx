import React, { useState } from 'react';
import { Quote, Trophy, ZoomIn } from 'lucide-react';
import ImageModal from '../../components/ImageModal';

export default function Athletes() {
  const [modalImage, setModalImage] = useState(null);

  const athletes = [
    {
      name: "Muhammad Ali",
      sport: "Boxing",
      quote: "I hated every minute of training, but I said, 'Don't quit. Suffer now and live the rest of your life as a champion.'",
      img: "https://media.gettyimages.com/id/136886431/photo/muhammad-ali-vs-sonny-liston-1965-world-heavyweight-title.webp?s=1024x1024&w=gi&k=20&c=g8JGqRz3i_agRt3s1d-OIy0AY879GRdCzsfWgPmfvvo="
    },
    {
      name: "Kobe Bryant",
      sport: "Basketball",
      quote: "Dedication sees dreams come true. I have nothing in common with lazy people who blame others for their lack of success. Great things come from hard work and perseverance.",
      img: "https://i.ytimg.com/vi/7EnBXabx5RY/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLAjK-MO1GVO64AkGr-VxdQCNOi3bQ"
    },
    {
      name: "Serena Williams",
      sport: "Tennis",
      quote: "I've grown most not from victories, but setbacks. If winning is God's reward, then losing is how he teaches us.",
      img: "https://assets.teenvogue.com/photos/57c03d8e9b60a7db09380d0e/16:9/w_2560%2Cc_limit/serena-williams.jpg"
    },
    {
      name: "Michael Jordan",
      sport: "Basketball",
      quote: "I've failed over and over and over again in my life. And that is why I succeed.",
      img: "https://coosociety.com/wp-content/uploads/2022/07/MJ-Blog-Visual.jpg"
    },
    {
      name: "Usain Bolt",
      sport: "Sprinter",
      quote: "Worrying gets you nowhere. If you turn up worrying about how you're going to perform, you've already lost. Train hard, turn up, run your best and the rest will take care of itself.",
      img: "https://img.olympics.com/images/image/private/t_s_16_9_g_auto/t_s_w2440/f_auto/primary/itgo4fceaazaicrrl7b2"
    },
    {
      name: "Cristiano Ronaldo",
      sport: "Soccer",
      quote: "Talent without working hard is nothing. I am not a perfectionist, but I like to feel that things are done well.",
      img: "https://c.ndtvimg.com/cristiano-ronaldo-reuters_625x300_1530764546324.jpg"
    }
  ];

  return (
    <>
      <div className="max-w-5xl mx-auto space-y-12 px-4 sm:px-6 pt-6 pb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
        
        {/* Header Section */}
        <div 
          className="relative rounded-3xl overflow-hidden h-80 flex items-center justify-center cursor-pointer group"
          onClick={() => setModalImage("https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=1200&q=80")}
        >
          <img 
            src="https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=1200&q=80" 
            alt="Athletes" 
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 to-slate-900/40"></div>
          
          <div className="absolute top-4 right-4 bg-black/50 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity text-white">
            <ZoomIn className="w-5 h-5" />
          </div>

          <div className="relative z-10 text-center text-white px-6">
            <div className="inline-flex items-center justify-center p-3 bg-blue-600 rounded-full mb-4 shadow-lg shadow-blue-600/30">
              <Trophy className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">Champion Mindset</h1>
            <p className="text-lg md:text-xl text-blue-50 max-w-2xl mx-auto font-medium">
              Draw inspiration from some of the greatest athletes in history. Their words reflect the dedication, resilience, and passion required to succeed.
            </p>
          </div>
        </div>

        {/* Quotes Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          {athletes.map((athlete, idx) => (
            <div key={idx} className="bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-100 flex flex-col group hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div 
                className="h-64 overflow-hidden relative cursor-pointer"
                onClick={() => setModalImage(athlete.img)}
              >
                <img 
                  src={athlete.img} 
                  alt={athlete.name} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-black/10 to-transparent group-hover:via-transparent transition-colors duration-500"></div>
                
                <div className="absolute top-4 right-4 bg-black/50 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity text-white">
                  <ZoomIn className="w-4 h-4" />
                </div>

                <div className="absolute bottom-4 left-6 right-6">
                  <h3 className="text-2xl font-bold text-white drop-shadow-md">{athlete.name}</h3>
                  <span className="text-blue-300 font-medium text-sm tracking-wider uppercase drop-shadow-md">{athlete.sport}</span>
                </div>
              </div>
              <div className="p-8 relative flex-1 flex flex-col justify-center">
                <Quote className="w-10 h-10 text-blue-100 absolute top-4 right-6 rotate-180" />
                <p className="text-slate-600 text-lg leading-relaxed italic relative z-10 font-medium">
                  "{athlete.quote}"
                </p>
              </div>
            </div>
          ))}
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
