import React, { useState } from 'react';
import { generateLore } from '../services/gemini';
import { MessageSquareText, Send, Sparkles } from 'lucide-react';

export const LoreOracle: React.FC = () => {
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const handleAsk = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    
    setLoading(true);
    setResponse(null);
    // Le contexte est implicite dans le prompt système défini dans services/gemini.ts
    const answer = await generateLore(query, ""); 
    setResponse(answer);
    setLoading(false);
  };

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-8 right-8 z-50 p-4 rounded-full bg-blue-600/90 backdrop-blur-md border border-white/20 text-white hover:bg-blue-500 transition-all duration-300 shadow-2xl group animate-float"
      >
        <MessageSquareText className="w-6 h-6 group-hover:scale-110 transition-transform" />
      </button>
    );
  }

  return (
    <div className="fixed bottom-8 right-8 z-50 w-full max-w-md p-6 rounded-2xl bg-[#0a0a0a]/90 backdrop-blur-xl border border-white/10 shadow-2xl transition-all duration-500 fade-in-up">
      <div className="flex justify-between items-center mb-4 border-b border-white/5 pb-2">
        <h3 className="text-lg font-serif text-white/90 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-blue-400" />
          Assistant Pacao
        </h3>
        <button 
          onClick={() => setIsOpen(false)}
          className="text-white/40 hover:text-white transition-colors text-sm"
        >
          Fermer
        </button>
      </div>

      <div className="min-h-[100px] mb-4 text-sm text-white/80 leading-relaxed font-light">
        {loading ? (
          <div className="flex items-center justify-center h-24 space-x-2 text-white/30 animate-pulse">
            <span className="w-1.5 h-1.5 bg-current rounded-full"></span>
            <span className="w-1.5 h-1.5 bg-current rounded-full"></span>
            <span className="w-1.5 h-1.5 bg-current rounded-full"></span>
          </div>
        ) : response ? (
          <p className="animate-in fade-in slide-in-from-bottom-2 duration-500">{response}</p>
        ) : (
          <p className="text-white/40 italic">Bonjour. Je peux vous renseigner sur nos services de flocage, d'impression, ou nos équipements informatiques. Comment puis-je vous aider ?</p>
        )}
      </div>

      <form onSubmit={handleAsk} className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Ex: Faites-vous des cartes de visite ?"
          className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 pr-12 text-sm text-white placeholder-white/20 focus:outline-none focus:border-blue-500/50 focus:bg-white/10 transition-all"
        />
        <button 
          type="submit"
          disabled={loading || !query}
          className="absolute right-2 top-2 p-1.5 text-white/50 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};