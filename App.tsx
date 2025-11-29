
import React, { useEffect, useState } from 'react';
import Atmosphere from './components/Atmosphere';
import Chapter from './components/Chapter';
import Testimonials from './components/Testimonials';
import OrderModal from './components/OrderModal';
import { Gallery } from './components/Gallery';
import { LoreOracle } from './components/LoreOracle';
import { AdminDashboard } from './components/AdminDashboard';
import { DEFAULT_SERVICES_DATA, WHATSAPP_NUMBER } from './constants';
import { supabase, isSupabaseConfigured } from './lib/supabase';
import { StoryChapter, SiteContent } from './types';
import { ChevronDown, Lock, X, Save, Plus } from 'lucide-react';
import { AdminProvider, useAdmin } from './contexts/AdminContext';
import { AdminEditButton } from './components/AdminEditButton';

const AppContent: React.FC = () => {
  const { isAdmin } = useAdmin();
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);
  const [services, setServices] = useState<StoryChapter[]>(DEFAULT_SERVICES_DATA);
  const [loadingServices, setLoadingServices] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedServiceTitle, setSelectedServiceTitle] = useState('');

  // Site Content State
  const [siteContent, setSiteContent] = useState<Record<string, string>>({});
  const [whatsappNumber, setWhatsappNumber] = useState(WHATSAPP_NUMBER);

  // Inline Edit State
  const [editingService, setEditingService] = useState<StoryChapter | null>(null);

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
        setServices(DEFAULT_SERVICES_DATA);
      }
    } catch (err) {
      console.warn("Supabase fetch error, using fallback data", err);
      setServices(DEFAULT_SERVICES_DATA);
    } finally {
      setLoadingServices(false);
    }
  };

  const fetchSiteContent = async () => {
    if (!isSupabaseConfigured()) return;

    try {
      const { data, error } = await supabase.from('site_content').select('*');
      if (!error && data) {
        const contentMap: Record<string, string> = {};
        data.forEach((item: SiteContent) => {
          contentMap[item.key] = item.value;
        });
        setSiteContent(contentMap);
        if (contentMap.whatsapp_number) {
          setWhatsappNumber(contentMap.whatsapp_number);
        }
      }
    } catch (err) {
      console.warn('Failed to fetch site content', err);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollTop;
      const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scroll = totalScroll / windowHeight;
      setScrollProgress(scroll);
      setIsScrolled(totalScroll > 50);
    };

    window.addEventListener('scroll', handleScroll);
    fetchServices();
    fetchSiteContent();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleOrderClick = (chapter: StoryChapter) => {
    setSelectedServiceTitle(chapter.title);
    setIsModalOpen(true);
  };

  const handleEditService = (chapter: StoryChapter) => {
    setEditingService(chapter);
  };

  const handleDeleteService = async (chapter: StoryChapter) => {
    if (!window.confirm(`Supprimer le service "${chapter.title}" ?`)) return;
    if (!isSupabaseConfigured()) return;

    await supabase.from('services').delete().eq('id', chapter.id);
    fetchServices();
  };

  const handleAddService = () => {
    setEditingService({
      id: 'new',
      title: '',
      subtitle: '',
      content: '',
      image: 'https://images.unsplash.com/photo-1557683316-973673baf926',
      colorTheme: '#3b82f6',
      alignment: 'center',
      price: '',
      badges: []
    });
  };

  const handleSaveInlineEdit = async () => {
    if (!editingService || !isSupabaseConfigured()) return;

    if (editingService.id === 'new') {
      const { id, ...dataToInsert } = editingService;
      await supabase.from('services').insert([dataToInsert]);
    } else {
      await supabase.from('services').update(editingService).eq('id', editingService.id);
    }
    setEditingService(null);
    fetchServices();
  };

  return (
    <div className="relative min-h-screen text-white selection:bg-blue-500/30 bg-[#050505]">
      {showAdmin && (
        <AdminDashboard
          onClose={() => setShowAdmin(false)}
          onUpdate={() => {
            fetchServices();
            fetchSiteContent();
          }}
        />
      )}

      <OrderModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        serviceTitle={selectedServiceTitle}
        whatsappNumber={whatsappNumber}
      />

      {/* Background Atmosphere */}
      <Atmosphere />

      {/* Admin Mode Indicator */}
      {isAdmin && (
        <div className="fixed bottom-4 left-4 z-50 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg shadow-2xl flex items-center gap-2 animate-pulse">
          <Lock className="w-4 h-4" />
          <span className="text-xs font-bold uppercase tracking-wider">Mode Admin Actif</span>
        </div>
      )}

      {/* Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-1 z-50 bg-white/5">
        <div
          className="h-full bg-gradient-to-r from-amber-500 via-pink-500 to-blue-500 transition-all duration-100 ease-out"
          style={{ width: `${scrollProgress * 100}%` }}
        />
      </div>

      {/* Main Navigation */}
      <nav className={`fixed top-0 left-0 w-full px-8 py-6 z-40 flex justify-between items-center transition-all duration-500 ${isScrolled ? 'bg-black/50 backdrop-blur-md border-b border-white/5 py-4' : 'mix-blend-difference pointer-events-none'}`}>
        <div className="flex items-center gap-3">
          <span className="font-serif text-xl tracking-widest font-bold text-white/90">{siteContent.site_name || 'PACAO'}</span>
        </div>
        <div className="flex items-center gap-6">
          <span className={`text-[10px] md:text-xs font-mono tracking-[0.2em] opacity-60 hidden md:block uppercase border-l pl-4 ${isScrolled ? 'border-white/10' : 'border-white/20'}`}>
            {siteContent.site_description || "Solutions d'impression & digitales"}
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
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-tr from-blue-900/10 via-purple-900/5 to-amber-900/10 rounded-full blur-[120px] animate-pulse-glow" />

        <div className="z-10 text-center space-y-8 px-4 animate-in fade-in zoom-in duration-1000 max-w-4xl mx-auto">
          <div className="inline-block border border-white/10 bg-white/5 backdrop-blur-sm px-4 py-1.5 rounded-full mb-2">
            <p className="text-[10px] md:text-xs tracking-[0.3em] text-blue-100/70 uppercase font-medium">
              {siteContent.hero_tagline || "L'excellence au service de l'image"}
            </p>
          </div>

          <h1 className="display-font text-2xl md:text-4xl lg:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-white/30 drop-shadow-2xl tracking-tight">
            {siteContent.hero_title || 'PACAO'}
          </h1>

          <p className="max-w-xl mx-auto text-white/60 font-light leading-relaxed text-lg md:text-xl">
            {siteContent.hero_subtitle || 'Nous transformons vos idées en supports tangibles. Design, Impression & Matériel Professionnel.'}
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
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-96 rounded-2xl bg-white/5 animate-pulse border border-white/5"></div>
            ))
          ) : (
            <>
              {services.map((chapter, index) => (
                <Chapter
                  key={chapter.id}
                  chapter={chapter}
                  index={index}
                  onOrder={handleOrderClick}
                  onEdit={isAdmin ? handleEditService : undefined}
                  onDelete={isAdmin ? handleDeleteService : undefined}
                />
              ))}

              {/* Add Service Card (Admin Only) */}
              {isAdmin && (
                <div
                  onClick={handleAddService}
                  className="group relative flex flex-col items-center justify-center h-[500px] bg-white/[0.02] backdrop-blur-md border border-white/5 border-dashed rounded-2xl overflow-hidden cursor-pointer hover:bg-white/[0.05] hover:border-white/20 transition-all"
                >
                  <div className="p-4 rounded-full bg-white/5 group-hover:bg-blue-600/20 text-white/50 group-hover:text-blue-400 transition-colors mb-4">
                    <Plus className="w-8 h-8" />
                  </div>
                  <span className="text-white/60 font-serif text-lg group-hover:text-white transition-colors">Ajouter un service</span>
                </div>
              )}
            </>
          )}
        </div>

        <Gallery />

        <Testimonials />

        {/* Footer */}
        <section className="mt-32 pt-24 pb-12 border-t border-white/5 flex flex-col items-center justify-center relative bg-gradient-to-b from-transparent to-black/80">
          <div className="text-center space-y-8 p-8 max-w-2xl relative z-10">
            <h2 className="text-4xl md:text-5xl font-serif text-white/90">{siteContent.footer_cta_title || 'Prêt à collaborer ?'}</h2>
            <p className="text-white/50 font-light text-lg">
              {siteContent.footer_cta_text || 'Chaque projet commence par une discussion. Parlons de vos besoins.'}
            </p>
            <button
              onClick={() => {
                setSelectedServiceTitle('Projet Général');
                setIsModalOpen(true);
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
            <p className="text-white/30">Créé par Bicom Lab</p>
          </div>
        </section>
      </main>

      {/* Inline Edit Modal for Services */}
      {editingService && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-serif text-white">{editingService.id === 'new' ? 'Nouveau Service' : 'Modifier le service'}</h3>
              <button onClick={() => setEditingService(null)} className="text-white/50 hover:text-white">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-white/60 text-sm mb-2">Titre</label>
                <input
                  type="text"
                  value={editingService.title}
                  onChange={(e) => setEditingService({ ...editingService, title: e.target.value })}
                  className="w-full bg-black/40 border border-white/10 rounded p-3 text-white"
                />
              </div>
              <div>
                <label className="block text-white/60 text-sm mb-2">Sous-titre</label>
                <input
                  type="text"
                  value={editingService.subtitle}
                  onChange={(e) => setEditingService({ ...editingService, subtitle: e.target.value })}
                  className="w-full bg-black/40 border border-white/10 rounded p-3 text-white"
                />
              </div>
              <div>
                <label className="block text-white/60 text-sm mb-2">Description</label>
                <textarea
                  value={editingService.content}
                  onChange={(e) => setEditingService({ ...editingService, content: e.target.value })}
                  className="w-full h-32 bg-black/40 border border-white/10 rounded p-3 text-white resize-none"
                />
              </div>
              <div>
                <label className="block text-white/60 text-sm mb-2">Prix</label>
                <input
                  type="text"
                  value={editingService.price || ''}
                  onChange={(e) => setEditingService({ ...editingService, price: e.target.value })}
                  placeholder="Ex: 15.000 FCFA"
                  className="w-full bg-black/40 border border-white/10 rounded p-3 text-white"
                />
              </div>
              <div>
                <label className="block text-white/60 text-sm mb-2">URL de l'image</label>
                <input
                  type="text"
                  value={editingService.image}
                  onChange={(e) => setEditingService({ ...editingService, image: e.target.value })}
                  className="w-full bg-black/40 border border-white/10 rounded p-3 text-white"
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-8">
              <button
                onClick={() => setEditingService(null)}
                className="px-6 py-2 text-white/60 hover:text-white transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={handleSaveInlineEdit}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg flex items-center gap-2"
              >
                <Save className="w-4 h-4" /> Enregistrer
              </button>
            </div>
          </div>
        </div>
      )}

      <LoreOracle />
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AdminProvider>
      <AppContent />
    </AdminProvider>
  );
};

export default App;
