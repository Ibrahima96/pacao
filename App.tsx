import React, { useEffect, useState } from 'react';
import Atmosphere from './components/Atmosphere';
import Chapter from './components/Chapter';
import Testimonials from './components/Testimonials';
import { Gallery } from './components/Gallery';
import { LoreOracle } from './components/LoreOracle';
import { AdminDashboard } from './components/AdminDashboard';
import { DEFAULT_SERVICES_DATA, WHATSAPP_NUMBER } from './constants';
import { supabase, isSupabaseConfigured } from './lib/supabase';
import { StoryChapter } from './types';
import { ChevronDown, Printer, Lock } from 'lucide-react';

const App: React.FC = () => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showAdmin, setShowAdmin] = useState(false);
  const [services, setServices] = useState<StoryChapter[]>(DEFAULT_SERVICES_DATA);
  const [loadingServices, setLoadingServices] = useState(true);

  const fetchServices = async () => {
    if (!isSupabaseConfigured()) {
      setServices(DEFAULT_SERVICES_DATA);
      setLoadingServices(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .order('created_at', { ascending: true });
      
      if (!error && data && data.length > 0) {
        setServices(data);
      } else {
        // Fallback if table is empty or doesn't exist yet
        setServices(DEFAULT_SERVICES_DATA);
      }
    } catch (err) {
      console.warn("Supabase fetch error, using fallback data", err);
      setServices(DEFAULT_SERVICES_DATA);
    } finally {
      setLoadingServices(false);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollTop;
      const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scroll = totalScroll / windowHeight;
      setScrollProgress(scroll);
    };

    window.addEventListener('scroll', handleScroll);
    fetchServices();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="relative min-h-screen text-white selection:bg-blue-500/30 bg-[#050505]">
      {showAdmin && (
        <AdminDashboard 
            onClose={() => setShowAdmin(false)} 
            onUpdate={fetchServices}
        />
      )}

      {/* Background Atmosphere */}
      <Atmosphere />

      {/* Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-1 z-50 bg-white/5">
        <div 
          className="h-full bg-gradient-to-r from-amber-500 via-pink-500 to-blue-500 transition-all duration-100 ease-out"
          style={{ width: `${scrollProgress * 100}%` }}
        />
      </div>

      {/* Main Navigation / Header (Minimal) */}
      <nav className="fixed top-0 left-0 w-full px-8 py-6 z-40 flex justify-between items-center mix-blend-difference pointer-events-none">
        <div className="flex items-center gap-3">
           <div className="p-2 border border-white/20 rounded-full backdrop-blur-md bg-black/20">
             <Printer className="w-5 h-5 text-white" />
           </div>
           <span className="font-serif text-xl tracking-widest font-bold text-white/90">PACAO</span>
        </div>
        <div className="flex items-center gap-6">
            <span className="text-[10px] md:text-xs font-mono tracking-[0.2em] opacity-60 hidden md:block uppercase border-l border-white/20 pl-4">
            Solutions d'impression & digitales
            </span>
            <button 
                onClick={() => setShowAdmin(true)}
                className="pointer-events-auto opacity-30 hover:opacity-100 transition-opacity"
            >
                <Lock className="w-4 h-4" />
            </button>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="relative h-[85vh] flex flex-col items-center justify-center z-10 overflow-hidden">
        {/* Abstract Hero Background Element */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-tr from-blue-900/10 via-purple-900/5 to-amber-900/10 rounded-full blur-[120px] animate-pulse-glow" />

        <div className="z-10 text-center space-y-8 px-4 animate-in fade-in zoom-in duration-1000 max-w-4xl mx-auto">
          <div className="inline-block border border-white/10 bg-white/5 backdrop-blur-sm px-4 py-1.5 rounded-full mb-2">
            <p className="text-[10px] md:text-xs tracking-[0.3em] text-blue-100/70 uppercase font-medium">
              L'excellence au service de l'image
            </p>
          </div>
          
          <h1 className="display-font text-6xl md:text-8xl lg:text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-white/30 drop-shadow-2xl tracking-tight">
            PACAO
          </h1>
          
          <p className="max-w-xl mx-auto text-white/60 font-light leading-relaxed text-lg md:text-xl">
            Nous transformons vos idées en supports tangibles. <br className="hidden md:block"/>
            <span className="text-white/80">Design, Impression & Matériel Professionnel.</span>
          </p>

          <div className="pt-8">
            <a href="#services" className="px-8 py-3 bg-white text-black font-semibold tracking-widest text-xs uppercase hover:bg-gray-200 transition-colors rounded-sm shadow-[0_0_20px_rgba(255,255,255,0.3)] pointer-events-auto">
              Découvrir nos services
            </a>
          </div>
        </div>
        
        <div className="absolute bottom-12 animate-bounce opacity-30">
          <ChevronDown className="w-6 h-6" />
        </div>
      </header>

      {/* Services Grid Section */}
      <main id="services" className="relative z-10 py-24 px-4 md:px-8 max-w-7xl mx-auto">
        
        <div className="mb-20 text-center space-y-4">
          <h2 className="text-4xl md:text-5xl font-serif text-white">Nos Expertises</h2>
          <div className="w-24 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent mx-auto"></div>
          <p className="text-white/40 max-w-lg mx-auto font-light">
            Une gamme complète de solutions pour accompagner la croissance et l'image de votre entreprise.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mb-8">
          {loadingServices ? (
             // Loading Skeletons
             Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-96 rounded-2xl bg-white/5 animate-pulse border border-white/5"></div>
             ))
          ) : (
            services.map((chapter, index) => (
                <Chapter key={chapter.id} chapter={chapter} index={index} />
            ))
          )}
        </div>

        {/* Gallery Section */}
        <Gallery />

        {/* Testimonials Section */}
        <Testimonials />
        
        {/* Footer / Contact */}
        <section className="mt-32 pt-24 pb-12 border-t border-white/5 flex flex-col items-center justify-center relative bg-gradient-to-b from-transparent to-black/80">
          <div className="text-center space-y-8 p-8 max-w-2xl relative z-10">
            <h2 className="text-4xl md:text-5xl font-serif text-white/90">Prêt à collaborer ?</h2>
            <p className="text-white/50 font-light text-lg">
              Chaque projet commence par une discussion. Parlons de vos besoins.
            </p>
            <button 
                onClick={() => {
                   window.open(`https://wa.me/${WHATSAPP_NUMBER}`, '_blank');
                }}
                className="group relative px-8 py-4 bg-transparent border border-white/30 text-white font-medium tracking-widest text-xs uppercase hover:bg-white hover:text-black transition-all duration-500 overflow-hidden"
            >
              <span className="relative z-10">Contacter Pacao</span>
              <div className="absolute inset-0 bg-white transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500 z-0"></div>
            </button>
          </div>
          
          <div className="mt-16 flex flex-col items-center gap-4 text-white/20 text-sm">
             <div className="flex gap-6">
               <span className="hover:text-white/60 cursor-pointer transition-colors">Instagram</span>
               <span className="hover:text-white/60 cursor-pointer transition-colors">LinkedIn</span>
               <span className="hover:text-white/60 cursor-pointer transition-colors">Email</span>
             </div>
             <p>© {new Date().getFullYear()} Pacao (PDS). Tous droits réservés.</p>
          </div>
        </section>
      </main>

      {/* Gemini Assistant */}
      <LoreOracle />
    </div>
  );
};

export default App;