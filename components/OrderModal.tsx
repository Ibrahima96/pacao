
import React, { useState } from 'react';
import { X, MessageCircle, Send, Package, User } from 'lucide-react';
import { WHATSAPP_NUMBER } from '../constants';

interface OrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  serviceTitle: string;
  whatsappNumber: string;
}

const OrderModal: React.FC<OrderModalProps> = ({ isOpen, onClose, serviceTitle, whatsappNumber }) => {
  const [name, setName] = useState('');
  const [details, setDetails] = useState('');
  const [quantity, setQuantity] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Construction du message WhatsApp soigné et professionnel
    const message = `*Nouvelle demande via le site web* 🚀\n\n` +
      `👤 *Nom / Entreprise :* ${name.trim()}\n` +
      `🛠 *Service concerné :* ${serviceTitle}\n` +
      (quantity.trim() ? `📊 *Quantité souhaitée :* ${quantity.trim()}\n` : '') +
      `\n📝 *Détails de la demande :*\n${details.trim()}`;

    const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative w-full max-w-md bg-[#111] border border-white/10 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">

        {/* Header */}
        <div className="bg-gradient-to-r from-blue-900/20 to-purple-900/20 p-6 border-b border-white/5">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/40 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <h3 className="text-xl font-serif text-white mb-1">Démarrer votre projet</h3>
          <p className="text-white/50 text-sm">Service : <span className="text-blue-400 font-medium">{serviceTitle}</span></p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">

          <div className="space-y-2">
            <label className="text-xs uppercase tracking-widest text-white/40 flex items-center gap-2">
              <User className="w-3 h-3" /> Nom complet
            </label>
            <input
              required
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Votre nom ou entreprise"
              className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white placeholder-white/20 focus:border-blue-500 focus:bg-white/10 outline-none transition-all"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs uppercase tracking-widest text-white/40 flex items-center gap-2">
              <Package className="w-3 h-3" /> Quantité (Optionnel)
            </label>
            <input
              type="text"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              placeholder="Ex: 100 cartes, 5 t-shirts..."
              className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white placeholder-white/20 focus:border-blue-500 focus:bg-white/10 outline-none transition-all"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs uppercase tracking-widest text-white/40 flex items-center gap-2">
              <MessageCircle className="w-3 h-3" /> Précisions
            </label>
            <textarea
              required
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              placeholder="Décrivez brièvement votre besoin..."
              className="w-full h-24 bg-white/5 border border-white/10 rounded-lg p-3 text-white placeholder-white/20 focus:border-blue-500 focus:bg-white/10 outline-none transition-all resize-none"
            />
          </div>

          <button
            type="submit"
            className="w-full py-4 mt-2 bg-white text-black font-bold uppercase tracking-widest hover:bg-gray-200 transition-all flex items-center justify-center gap-2 rounded-lg group"
          >
            <span>Continuer sur WhatsApp</span>
            <Send className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
          </button>

          <p className="text-center text-[10px] text-white/30">
            Vous serez redirigé vers l'application WhatsApp pour envoyer le message pré-rempli.
          </p>
        </form>
      </div>
    </div>
  );
};

export default OrderModal;
