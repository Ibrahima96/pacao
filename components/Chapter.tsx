import React, { useState, useRef, useEffect } from 'react';
import { StoryChapter } from '../types';
import { ArrowRight, MessageCircle, Tag } from 'lucide-react';
import { WHATSAPP_NUMBER } from '../constants';

interface ChapterProps {
  chapter: StoryChapter;
  index: number;
}

const Chapter: React.FC<ChapterProps> = ({ chapter, index }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const parallaxRef = useRef<HTMLDivElement>(null);

  // Intersection Observer for Reveal Animation
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { 
        threshold: 0.15, // Slightly higher threshold to ensure element is actually entering
        rootMargin: '0px 0px -50px 0px' // Trigger slightly before bottom of screen
      }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Parallax Image Effect
  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current || !parallaxRef.current) return;
      
      const rect = containerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      // Only animate if in view to save resources
      if (rect.top < windowHeight && rect.bottom > 0) {
        // Calculate relative position: -1 (top) to 1 (bottom) roughly
        const relativePos = (rect.top + rect.height / 2 - windowHeight / 2) / (windowHeight / 2);
        
        // Parallax intensity (pixels to move)
        // Reverse direction or speed based on alignment to create depth variety
        const speedFactor = chapter.alignment === 'center' ? 1.2 : 0.8;
        const parallaxAmount = relativePos * 25 * speedFactor; 
        
        parallaxRef.current.style.transform = `translateY(${parallaxAmount}px)`;
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial calculation
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, [chapter.alignment]);

  const handleWhatsAppClick = () => {
    const message = `Bonjour Pacao, je suis intéressé par votre service : ${chapter.title}. Pouvons-nous en discuter ?`;
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  // Calculate staggered delay using modulo to create a recurring wave effect
  // This prevents excessive delays for items further down the list (e.g., item 20 won't wait 3 seconds)
  // The grid goes up to 3 columns, so a modulo of 3 syncs perfectly with the visual rows.
  const transitionDelay = `${(index % 3) * 150}ms`;

  const isCentered = chapter.alignment === 'center';

  return (
    <div 
      ref={containerRef}
      className={`group relative flex flex-col h-full bg-white/[0.02] backdrop-blur-md border border-white/5 rounded-2xl overflow-hidden transition-all duration-1000 cubic-bezier(0.2, 0.8, 0.2, 1) hover:bg-white/[0.04] hover:border-white/20 hover:shadow-2xl hover:shadow-blue-900/20 
      ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-16'}
      `}
      style={{ transitionDelay }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Container with Parallax Wrapper */}
      <div className="relative w-full h-72 overflow-hidden">
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent z-10 opacity-80" />
        
        {/* Color Overlay on Hover */}
        <div 
          className="absolute inset-0 z-10 mix-blend-overlay opacity-0 group-hover:opacity-40 transition-opacity duration-700"
          style={{ backgroundColor: chapter.colorTheme }}
        />

        {/* Parallax Container Wrapper */}
        <div ref={parallaxRef} className="w-full h-[120%] -mt-[5%] will-change-transform">
          <img 
            src={chapter.image} 
            alt={chapter.title}
            className="w-full h-full object-cover transform transition-transform duration-[1.5s] ease-out group-hover:scale-110 group-hover:rotate-1"
          />
        </div>
        
        {/* Badges (Top Left) */}
        {chapter.badges && chapter.badges.length > 0 && (
          <div className="absolute top-4 left-4 z-20 flex gap-2 flex-wrap max-w-[70%]">
            {chapter.badges.map((badge, idx) => (
              <span 
                key={idx}
                className="px-2 py-1 text-[10px] font-bold tracking-wider uppercase rounded bg-white/90 text-black shadow-lg animate-in fade-in slide-in-from-top-2 duration-700"
                style={{ animationDelay: `${idx * 100 + 200}ms` }}
              >
                {badge}
              </span>
            ))}
          </div>
        )}
        
        {/* Floating Category Tag (Top Right) */}
        <div className="absolute top-4 right-4 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 transform translate-y-[-10px] group-hover:translate-y-0">
          <span 
            className="px-3 py-1 text-[10px] font-bold tracking-widest uppercase rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-white/90 shadow-lg"
            style={{ borderColor: `${chapter.colorTheme}60` }}
          >
            {chapter.id.replace('service-', '').replace(/[0-9-]/g, '')}
          </span>
        </div>
      </div>

      {/* Content Container */}
      <div className="flex flex-col flex-grow p-6 sm:p-8 relative">
        {/* Subtle glow effect behind text */}
        <div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full blur-[80px] opacity-0 group-hover:opacity-15 transition-opacity duration-700 pointer-events-none"
          style={{ backgroundColor: chapter.colorTheme }}
        />

        <div className={`space-y-3 mb-4 z-10 ${isCentered ? 'flex flex-col items-center text-center' : ''}`}>
          <span 
            className="text-xs font-mono uppercase tracking-widest opacity-50 transition-colors duration-300 group-hover:text-white group-hover:opacity-100"
            style={{ color: isHovered ? chapter.colorTheme : undefined }}
          >
            {chapter.subtitle.split('•')[0]} 
          </span>
          <h3 className="text-2xl font-serif text-white group-hover:text-white transition-colors duration-300">
            {chapter.title}
          </h3>
          <div 
            className={`h-0.5 w-8 bg-white/20 group-hover:w-16 transition-all duration-500 ease-out ${isCentered ? 'mx-auto' : ''}`}
            style={{ backgroundColor: isHovered ? chapter.colorTheme : '' }}
          />
        </div>

        <p className={`text-sm text-white/60 font-light mb-8 flex-grow z-10 group-hover:text-white/80 transition-colors duration-300 leading-7 ${isCentered ? 'text-center' : 'text-left'}`}>
          {chapter.content}
        </p>

        {/* Action Area */}
        <div className="mt-auto flex items-end justify-between pt-6 border-t border-white/5 group-hover:border-white/10 transition-colors z-10">
          
          <div className="flex flex-col gap-1">
             <span className="text-[10px] uppercase tracking-widest text-white/30 font-semibold group-hover:text-white/60 transition-colors duration-300">
                Tarif
             </span>
             {chapter.price ? (
               <span className="text-lg font-serif text-white/90 group-hover:text-white transition-colors" style={{ color: isHovered ? chapter.colorTheme : undefined }}>
                 {chapter.price}
               </span>
             ) : (
               <span className="text-sm italic text-white/40">Sur demande</span>
             )}
          </div>

          <button 
            onClick={handleWhatsAppClick}
            className="flex items-center justify-center w-10 h-10 rounded-full border border-white/10 bg-white/5 text-white group-hover:bg-[#25D366] group-hover:border-[#25D366] group-hover:text-white transition-all duration-300 group-hover:scale-110 shadow-lg"
            aria-label="Contacter sur WhatsApp"
          >
            {isHovered ? <MessageCircle className="w-5 h-5" /> : <ArrowRight className="w-4 h-4 transform group-hover:-rotate-45 transition-transform duration-300" />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chapter;