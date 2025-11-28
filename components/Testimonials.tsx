import React from 'react';
import { TESTIMONIALS_DATA } from '../constants';
import { Quote } from 'lucide-react';

const Testimonials: React.FC = () => {
  return (
    <section className="py-32 relative">
      {/* Background Separator */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      
      <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-3xl md:text-4xl font-serif text-white/90">Ce qu'ils disent de nous</h2>
          <div className="w-12 h-0.5 bg-blue-500/50 mx-auto rounded-full" />
          <p className="text-white/40 font-light max-w-lg mx-auto">
            La confiance de nos clients est notre plus belle réussite.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {TESTIMONIALS_DATA.map((item, index) => (
            <div 
              key={item.id}
              className="group relative p-8 rounded-2xl bg-white/[0.02] border border-white/5 backdrop-blur-sm hover:bg-white/[0.04] hover:border-white/10 transition-all duration-500 hover:-translate-y-1"
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              {/* Quote Icon */}
              <div className="absolute top-6 right-6 opacity-10 group-hover:opacity-30 transition-opacity duration-500 text-blue-400">
                <Quote className="w-10 h-10" />
              </div>
              
              <div className="relative z-10 flex flex-col h-full">
                <div className="mb-6 flex-grow">
                  <p className="text-lg text-white/70 font-serif italic leading-relaxed">
                    "{item.quote}"
                  </p>
                </div>

                <div className="flex items-center gap-4 pt-6 border-t border-white/5 group-hover:border-white/10 transition-colors">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-white/10 to-white/5 flex items-center justify-center border border-white/10 text-sm font-bold text-white/80 shadow-inner">
                    {item.author.charAt(0)}
                  </div>
                  <div>
                    <div className="text-sm font-medium text-white/90">{item.author}</div>
                    <div className="text-[10px] text-white/40 uppercase tracking-wider">{item.role}</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;