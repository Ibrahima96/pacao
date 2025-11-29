import React, { useState, useEffect, useRef } from 'react';
import { generateAIResponse, getActiveAIProvider } from '../services/aiService';
import { MessageSquareText, Send, Sparkles, Trash2 } from 'lucide-react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

export const LoreOracle: React.FC = () => {
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Charger l'historique depuis sessionStorage au chargement
  useEffect(() => {
    const savedMessages = sessionStorage.getItem('pacao_chat_history');
    if (savedMessages) {
      try {
        setMessages(JSON.parse(savedMessages));
      } catch (e) {
        console.error('Erreur chargement historique:', e);
      }
    }
  }, []);

  // Sauvegarder l'historique dans sessionStorage à chaque changement
  useEffect(() => {
    if (messages.length > 0) {
      sessionStorage.setItem('pacao_chat_history', JSON.stringify(messages));
    }
  }, [messages]);

  // Auto-scroll vers le bas
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleAsk = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim() || loading) return;

    const userMessage: Message = {
      role: 'user',
      content: query.trim(),
      timestamp: Date.now()
    };

    // Ajouter le message utilisateur
    setMessages(prev => [...prev, userMessage]);
    setQuery('');
    setLoading(true);

    try {
      // Construire le contexte avec les 5 derniers messages
      const recentMessages = messages.slice(-5);
      const context = recentMessages
        .map(m => `${m.role === 'user' ? 'Client' : 'Assistant'}: ${m.content}`)
        .join('\n');

      const fullQuery = context ? `${context}\nClient: ${userMessage.content}` : userMessage.content;
      const answer = await generateAIResponse(fullQuery);

      const assistantMessage: Message = {
        role: 'assistant',
        content: answer,
        timestamp: Date.now()
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Erreur génération réponse:', error);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Désolé, une erreur est survenue. Veuillez réessayer.',
        timestamp: Date.now()
      }]);
    } finally {
      setLoading(false);
    }
  };

  const clearHistory = () => {
    if (window.confirm('Effacer tout l\'historique de la conversation ?')) {
      setMessages([]);
      sessionStorage.removeItem('pacao_chat_history');
    }
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

  const aiProvider = getActiveAIProvider();

  return (
    <div className="fixed bottom-8 right-8 z-50 w-full max-w-md rounded-2xl bg-[#0a0a0a]/95 backdrop-blur-xl border border-white/10 shadow-2xl transition-all duration-500 fade-in-up flex flex-col" style={{ height: '500px' }}>
      {/* Header */}
      <div className="flex justify-between items-center p-4 border-b border-white/5">
        <div className="flex-1">
          <h3 className="text-lg font-serif text-white/90 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-blue-400" />
            Assistant Pacao
          </h3>
          <span className="text-xs text-white/30">{aiProvider}</span>
        </div>
        <div className="flex items-center gap-2">
          {messages.length > 0 && (
            <button
              onClick={clearHistory}
              className="text-white/40 hover:text-red-400 transition-colors p-1"
              title="Effacer l'historique"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={() => setIsOpen(false)}
            className="text-white/40 hover:text-white transition-colors text-sm px-2"
          >
            Fermer
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="text-white/40 italic text-sm text-center py-8">
            Bonjour ! Je peux vous renseigner sur nos services de flocage, d'impression, ou nos équipements informatiques. Comment puis-je vous aider ?
          </div>
        ) : (
          messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] rounded-lg p-3 ${msg.role === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white/5 text-white/90'
                }`}>
                <p className="text-sm leading-relaxed">{msg.content}</p>
                <span className="text-xs opacity-50 mt-1 block">
                  {new Date(msg.timestamp).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          ))
        )}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-white/5 rounded-lg p-3">
              <div className="flex items-center space-x-2 text-white/30">
                <span className="w-1.5 h-1.5 bg-current rounded-full animate-pulse"></span>
                <span className="w-1.5 h-1.5 bg-current rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></span>
                <span className="w-1.5 h-1.5 bg-current rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleAsk} className="p-4 border-t border-white/5">
        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Posez votre question..."
            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 pr-12 text-sm text-white placeholder-white/30 focus:outline-none focus:border-blue-500/50 focus:bg-white/10 transition-all"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading || !query.trim()}
            className="absolute right-2 top-2 p-1.5 text-white/50 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
};