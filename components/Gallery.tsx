
import React, { useRef, useEffect, useState } from 'react';
import { GALLERY_DATA } from '../constants';
import { GalleryItem } from '../types';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { Loader2 } from 'lucide-react';

const GalleryCard: React.FC<{ item: GalleryItem }> = ({ item }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotate, setRotate] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Calculate rotation (-10 to 10 degrees)
    const xRotation = ((y / rect.height) - 0.5) * -15; // Slightly reduced for elegance
    const yRotation = ((x / rect.width) - 0.5) * 15;
    
    setRotate({ x: xRotation, y: yRotation });
  };

  const handleMouseLeave = () => {
    setRotate({ x: 0, y: 0 });
    setIsHovered(false);
  };

  return (
    <div 
      ref={cardRef}
      className={`relative rounded-xl overflow-hidden mb-6 cursor-pointer transform transition-all duration-300 ease-out ${item.size === 'large' ? 'h-96' : item.size === 'medium' ? 'h-72' : 'h-48'}`}
      style={{
        perspective: '1000px',
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
    >
      <div 
        className="w-full h-full transition-transform duration-200 ease-out"
        style={{
          transform: isHovered 
            ? `rotateX(${rotate.x}deg) rotateY(${rotate.y}deg) scale(1.02)` 
            : 'rotateX(0deg) rotateY(0deg) scale(1)',
        }}
      >
        <img 
          src={item.image} 
          alt={item.alt}
          className="w-full h-full object-cover"
        />
        <div className={`absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 transition-opacity duration-300 flex flex-col justify-end p-6 ${isHovered ? 'opacity-100' : ''}`}>
          <span className="text-blue-400 text-xs font-mono uppercase tracking-widest mb-1">{item.category}</span>
          <p className="text-white font-serif text-lg">{item.alt}</p>
        </div>
      </div>
    </div>
  );
};

export const Gallery: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [parallaxY, setParallaxY] = useState(0);
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>(GALLERY_DATA);
  const [loading, setLoading] = useState(true);

  // Fetch gallery items from Supabase
  useEffect(() => {
    const fetchGallery = async () => {
      if (!isSupabaseConfigured()) {
        setLoading(false);
        return;
      }
      
      const { data, error } = await supabase
        .from('gallery')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data && data.length > 0) {
        setGalleryItems(data);
      }
      setLoading(false);
    };

    fetchGallery();
  }, []);

  // Enhanced Parallax Logic
  useEffect(() => {
    const handleScroll = () => {
      if (sectionRef.current) {
        const rect = sectionRef.current.getBoundingClientRect();
        const viewportCenter = window.innerHeight / 2;
        const sectionCenter = rect.top + rect.height / 2;
        
        // Distance from center of viewport to center of section
        const distance = sectionCenter - viewportCenter;
        
        // Only animate when near/in viewport
        if (rect.top < window.innerHeight && rect.bottom > 0) {
           setParallaxY(distance * 0.15); // Adjust sensitivity
        }
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Use the fetched items or fallback
  const items = galleryItems.length > 0 ? galleryItems : GALLERY_DATA;
  const col1 = items.filter((_, i) => i % 3 === 0);
  const col2 = items.filter((_, i) => i % 3 === 1);
  const col3 = items.filter((_, i) => i % 3 === 2);

  if (loading) {
    return (
      <div className="py-24 flex justify-center">
        <Loader2 className="w-8 h-8 text-white/20 animate-spin" />
      </div>
    );
  }

  return (
    <section ref={sectionRef} className="py-24 relative overflow-hidden bg-black/20">
      <div className="text-center mb-16 relative z-10 px-4">
        <h2 className="text-3xl md:text-5xl font-serif text-white mb-4">Réalisations</h2>
        <div className="w-16 h-0.5 bg-blue-500/30 mx-auto mb-6"></div>
        <p className="text-white/40 max-w-xl mx-auto font-light">
          Un aperçu de notre savoir-faire en action, du pixel à la matière.
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Column 1 - Slight Reverse Parallax */}
        <div className="flex flex-col" style={{ transform: `translateY(${parallaxY * -0.2}px)` }}>
          {col1.map(item => <GalleryCard key={item.id} item={item} />)}
        </div>

        {/* Column 2 - Main Enhanced Parallax with Scale */}
        <div 
            className="flex flex-col" 
            style={{ 
                transform: `translateY(${parallaxY}px) scale(${1 + Math.abs(parallaxY * 0.0005)})`,
                opacity: Math.max(0.5, 1 - Math.abs(parallaxY * 0.001)) // Fade slightly at extremes
            }}
        >
          {col2.map(item => <GalleryCard key={item.id} item={item} />)}
        </div>

        {/* Column 3 - Slight Reverse Parallax */}
        <div className="flex flex-col md:hidden lg:flex" style={{ transform: `translateY(${parallaxY * -0.2}px)` }}>
          {col3.map(item => <GalleryCard key={item.id} item={item} />)}
        </div>
      </div>
    </section>
  );
};
