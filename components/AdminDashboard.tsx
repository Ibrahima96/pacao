import React, { useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { StoryChapter } from '../types';
import { X, Plus, Trash2, Save, Upload, LogOut, Loader2, AlertTriangle, Tag } from 'lucide-react';

interface AdminDashboardProps {
  onClose: () => void;
  onUpdate: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onClose, onUpdate }) => {
  const [session, setSession] = useState<any>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [services, setServices] = useState<StoryChapter[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Form states for adding/editing
  const [formData, setFormData] = useState<Partial<StoryChapter>>({});
  // Helper state for badges text input
  const [badgesInput, setBadgesInput] = useState('');

  useEffect(() => {
    if (!isSupabaseConfigured()) return;

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) fetchServices();
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) fetchServices();
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchServices = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .order('created_at', { ascending: true });
    
    if (error) {
      console.error('Error fetching services:', error);
    } else {
      setServices(data || []);
    }
    setLoading(false);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isSupabaseConfigured()) {
        setError("Supabase n'est pas configuré. Veuillez vérifier les variables d'environnement.");
        return;
    }
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) setError(error.message);
    setLoading(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    onClose();
  };

  const handleSave = async () => {
    if (!formData.title || !formData.content) return;
    setLoading(true);

    // Process badges input into array
    const badgesArray = badgesInput.split(',').map(b => b.trim()).filter(b => b.length > 0);

    const dataToSave = {
        ...formData,
        badges: badgesArray,
        alignment: formData.alignment || 'center',
        colorTheme: formData.colorTheme || '#ffffff'
    };

    try {
        if (editingId === 'new') {
            const { error } = await supabase.from('services').insert([dataToSave]);
            if (error) throw error;
        } else {
            const { error } = await supabase.from('services').update(dataToSave).eq('id', editingId);
            if (error) throw error;
        }
        
        await fetchServices();
        setEditingId(null);
        setFormData({});
        setBadgesInput('');
        onUpdate(); // Notify App to refresh data
    } catch (err: any) {
        setError(err.message);
    } finally {
        setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce service ?')) return;
    
    setLoading(true);
    const { error } = await supabase.from('services').delete().eq('id', id);
    if (error) {
        console.error(error);
        setError("Erreur lors de la suppression");
    } else {
        await fetchServices();
        onUpdate();
    }
    setLoading(false);
  };

  const startEdit = (service: StoryChapter) => {
    setEditingId(service.id);
    setFormData(service);
    setBadgesInput(service.badges ? service.badges.join(', ') : '');
  };

  const startNew = () => {
    setEditingId('new');
    setFormData({
        title: '',
        subtitle: '',
        content: '',
        image: 'https://images.unsplash.com/photo-1557683316-973673baf926',
        colorTheme: '#3b82f6',
        alignment: 'center',
        price: '',
        badges: []
    });
    setBadgesInput('');
  };

  if (!session) {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-xl">
        <div className="w-full max-w-md p-8 bg-white/5 border border-white/10 rounded-2xl relative">
          <button onClick={onClose} className="absolute top-4 right-4 text-white/50 hover:text-white">
            <X className="w-6 h-6" />
          </button>
          <h2 className="text-2xl font-serif text-white mb-6 text-center">Connexion Admin</h2>
          
          {!isSupabaseConfigured() && (
            <div className="mb-6 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg flex gap-3">
               <AlertTriangle className="w-5 h-5 text-yellow-500 shrink-0" />
               <div className="text-sm text-yellow-200/80">
                 <p className="font-semibold mb-1">Base de données non connectée</p>
                 <p>Pour activer le dashboard, veuillez configurer <code>SUPABASE_URL</code> et <code>SUPABASE_ANON_KEY</code>.</p>
               </div>
            </div>
          )}

          {error && <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 text-red-200 text-sm rounded">{error}</div>}
          
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs uppercase tracking-widest text-white/50 mb-2">Email</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded p-3 text-white focus:border-blue-500 outline-none"
                disabled={!isSupabaseConfigured()}
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-widest text-white/50 mb-2">Mot de passe</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded p-3 text-white focus:border-blue-500 outline-none"
                disabled={!isSupabaseConfigured()}
              />
            </div>
            <button 
              type="submit" 
              disabled={loading || !isSupabaseConfigured()}
              className="w-full py-3 bg-white text-black font-bold uppercase tracking-widest hover:bg-gray-200 transition-colors mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Connexion...' : 'Se connecter'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[100] bg-[#050505] overflow-y-auto">
      <div className="sticky top-0 z-10 bg-[#0a0a0a] border-b border-white/10 px-6 py-4 flex justify-between items-center">
        <h2 className="text-xl font-serif text-white flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            Dashboard Pacao
        </h2>
        <div className="flex items-center gap-4">
            <button onClick={handleLogout} className="flex items-center gap-2 text-xs uppercase tracking-widest text-red-400 hover:text-red-300">
                <LogOut className="w-4 h-4" /> Déconnexion
            </button>
            <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full text-white">
                <X className="w-6 h-6" />
            </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto p-6 md:p-12">
        <div className="flex justify-between items-end mb-8">
            <div>
                <h1 className="text-3xl font-bold text-white mb-2">Gérer les services</h1>
                <p className="text-white/40 text-sm">Modifiez le contenu, les images et les descriptions.</p>
            </div>
            <button 
                onClick={startNew}
                className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors font-medium shadow-lg shadow-blue-900/20"
            >
                <Plus className="w-4 h-4" /> Nouveau Service
            </button>
        </div>

        {editingId && (
            <div className="mb-12 p-6 bg-white/5 border border-white/10 rounded-xl animate-in fade-in slide-in-from-top-4">
                <h3 className="text-lg font-medium text-white mb-6 border-b border-white/5 pb-4">
                    {editingId === 'new' ? 'Ajouter un service' : 'Modifier le service'}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                        <div>
                            <label className="text-xs uppercase text-white/40">Titre</label>
                            <input 
                                className="w-full bg-black/20 border border-white/10 rounded p-3 text-white mt-1 focus:border-blue-500 outline-none"
                                value={formData.title || ''}
                                onChange={e => setFormData({...formData, title: e.target.value})}
                            />
                        </div>
                        <div>
                            <label className="text-xs uppercase text-white/40">Sous-titre</label>
                            <input 
                                className="w-full bg-black/20 border border-white/10 rounded p-3 text-white mt-1 focus:border-blue-500 outline-none"
                                value={formData.subtitle || ''}
                                onChange={e => setFormData({...formData, subtitle: e.target.value})}
                            />
                        </div>
                        <div>
                            <label className="text-xs uppercase text-white/40">Prix (ex: 5000 FCFA)</label>
                            <input 
                                className="w-full bg-black/20 border border-white/10 rounded p-3 text-white mt-1 focus:border-blue-500 outline-none"
                                value={formData.price || ''}
                                onChange={e => setFormData({...formData, price: e.target.value})}
                                placeholder="Facultatif"
                            />
                        </div>
                        <div>
                            <label className="text-xs uppercase text-white/40 flex items-center gap-2">
                                <Tag className="w-3 h-3"/> Badges (séparés par virgules)
                            </label>
                            <input 
                                className="w-full bg-black/20 border border-white/10 rounded p-3 text-white mt-1 focus:border-blue-500 outline-none"
                                value={badgesInput}
                                onChange={e => setBadgesInput(e.target.value)}
                                placeholder="Ex: Promo, Nouveau, Populaire"
                            />
                        </div>
                        <div>
                            <label className="text-xs uppercase text-white/40">Couleur (Hex)</label>
                            <div className="flex items-center gap-2 mt-1">
                                <input 
                                    type="color"
                                    className="h-10 w-10 bg-transparent border-none"
                                    value={formData.colorTheme || '#ffffff'}
                                    onChange={e => setFormData({...formData, colorTheme: e.target.value})}
                                />
                                <input 
                                    className="flex-1 bg-black/20 border border-white/10 rounded p-3 text-white font-mono focus:border-blue-500 outline-none"
                                    value={formData.colorTheme || ''}
                                    onChange={e => setFormData({...formData, colorTheme: e.target.value})}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="space-y-4">
                        <div>
                            <label className="text-xs uppercase text-white/40">Image URL</label>
                            <div className="flex gap-2 mt-1">
                                <input 
                                    className="flex-1 bg-black/20 border border-white/10 rounded p-3 text-white focus:border-blue-500 outline-none"
                                    value={formData.image || ''}
                                    onChange={e => setFormData({...formData, image: e.target.value})}
                                    placeholder="https://..."
                                />
                                <div className="w-12 h-12 rounded bg-white/5 overflow-hidden border border-white/10 flex items-center justify-center">
                                    {formData.image ? <img src={formData.image} className="w-full h-full object-cover" /> : <Upload className="w-4 h-4 text-white/30"/>}
                                </div>
                            </div>
                        </div>
                        <div>
                            <label className="text-xs uppercase text-white/40">Description</label>
                            <textarea 
                                className="w-full h-32 bg-black/20 border border-white/10 rounded p-3 text-white mt-1 focus:border-blue-500 outline-none resize-none"
                                value={formData.content || ''}
                                onChange={e => setFormData({...formData, content: e.target.value})}
                            />
                        </div>
                    </div>
                </div>
                <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-white/5">
                    <button 
                        onClick={() => setEditingId(null)}
                        className="px-6 py-2 text-white/60 hover:text-white transition-colors"
                    >
                        Annuler
                    </button>
                    <button 
                        onClick={handleSave}
                        disabled={loading}
                        className="flex items-center gap-2 px-8 py-2 bg-white text-black font-medium rounded hover:bg-gray-200 transition-colors disabled:opacity-50"
                    >
                        {loading ? <Loader2 className="w-4 h-4 animate-spin"/> : <Save className="w-4 h-4" />} Enregistrer
                    </button>
                </div>
            </div>
        )}

        <div className="grid grid-cols-1 gap-4">
            {services.map(service => (
                <div key={service.id} className="group flex items-center justify-between p-4 bg-white/[0.03] border border-white/5 rounded-lg hover:border-white/20 transition-colors">
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded bg-black/50 overflow-hidden">
                            <img src={service.image} className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-opacity" />
                        </div>
                        <div>
                            <h4 className="text-white font-medium flex items-center gap-2">
                                {service.title} 
                                {service.price && <span className="text-xs bg-white/10 px-2 py-0.5 rounded text-white/60">{service.price}</span>}
                            </h4>
                            <p className="text-white/40 text-xs truncate max-w-xs">{service.subtitle}</p>
                            {service.badges && service.badges.length > 0 && (
                                <div className="flex gap-1 mt-1">
                                    {service.badges.map(b => (
                                        <span key={b} className="text-[10px] text-blue-300/70">#{b}</span>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                            onClick={() => startEdit(service)}
                            className="px-4 py-2 text-sm text-white/80 hover:text-white bg-white/5 hover:bg-white/10 rounded transition-colors"
                        >
                            Modifier
                        </button>
                        <button 
                            onClick={() => handleDelete(service.id)}
                            className="p-2 text-red-400 hover:text-red-300 hover:bg-red-900/20 rounded transition-colors"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            ))}
            {services.length === 0 && !loading && (
                <div className="text-center py-12 text-white/30 border border-dashed border-white/10 rounded-lg">
                    Aucun service trouvé. Ajoutez-en un !
                </div>
            )}
        </div>
      </div>
    </div>
  );
};