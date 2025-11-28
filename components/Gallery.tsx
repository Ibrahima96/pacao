import React, { useRef, useEffect, useState } from 'react';
import { GALLERY_DATA } from '../constants';
import { GalleryItem } from '../types';

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
    const xRotation = ((y / rect.height) - 0.5) * -20;
    const yRotation = ((x / rect.width) - 0.5) * 20;
    
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
        className="w-full h-full transition-transform duration-100 ease-out"
        style={{
          transform: isHovered 
            ? `rotateX(${rotate.x}deg) rotateY(${rotate.y}deg) scale(1.05)` 
            : 'rotateX(0deg) rotateY(0deg) scale(1)',
        }}
      >
        <img 
          src={item.image} 
          alt={item.alt}
          className="w-full h-full object-cover"
        />
        <div className={`absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 transition-opacity duration-300 flex flex-col justify-end p-6 ${isHovered ? 'opacity-100' : ''}`}>
          <span className="text-blue-400 text-xs font-mono uppercase tracking-widest mb-1">{item.category}</span>
          <p className="text-white font-serif text-lg">{item.alt}</p>
        </div>
      </div>
    </div>
  );
};

export const Gallery: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [offsetY, setOffsetY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (sectionRef.current) {
        const rect = sectionRef.current.getBoundingClientRect();
        // Calculate offset based on scroll position relative to section
        const speed = 0.1;
        setOffsetY(window.scrollY * speed);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Split data into columns for masonry layout
  const col1 = GALLERY_DATA.filter((_, i) => i % 3 === 0);
  const col2 = GALLERY_DATA.filter((_, i) => i % 3 === 1);
  const col3 = GALLERY_DATA.filter((_, i) => i % 3 === 2);

  return (
    <section ref={sectionRef} className="py-24 relative overflow-hidden">
      <div className="text-center mb-16 relative z-10 px-4">
        <h2 className="text-3xl md:text-5xl font-serif text-white mb-4">Réalisations</h2>
        <p className="text-white/40 max-w-xl mx-auto font-light">
          Un aperçu de notre savoir-faire en action, du pixel à la matière.
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Column 1 - Normal Speed */}
        <div className="flex flex-col">
          {col1.map(item => <GalleryCard key={item.id} item={item} />)}
        </div>

        {/* Column 2 - Parallax Effect (Moves slightly differently) */}
        <div className="flex flex-col" style={{ transform: `translateY(-${offsetY * 0.5}px)` }}>
          {col2.map(item => <GalleryCard key={item.id} item={item} />)}
        </div>

        {/* Column 3 - Normal Speed */}
        <div className="flex flex-col md:hidden lg:flex">
          {col3.map(item => <GalleryCard key={item.id} item={item} />)}
        </div>
      </div>
    </section>
  );
};