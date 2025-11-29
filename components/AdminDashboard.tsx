import React, { useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { StoryChapter, GalleryItem, Testimonial, SiteContent } from '../types';
import { X, Plus, Trash2, Save, Upload, LogOut, Loader2, AlertTriangle, Tag, LayoutGrid, Image as ImageIcon, MessageSquare, Settings } from 'lucide-react';
import { ImageUpload } from './ImageUpload';

interface AdminDashboardProps {
    onClose: () => void;
    onUpdate: () => void;
}

type Tab = 'services' | 'gallery' | 'testimonials' | 'content';

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onClose, onUpdate }) => {
    const [session, setSession] = useState<any>(null);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<Tab>('services');

    // Service State
    const [services, setServices] = useState<StoryChapter[]>([]);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [serviceForm, setServiceForm] = useState<Partial<StoryChapter>>({});
    const [badgesInput, setBadgesInput] = useState('');

    // Gallery State
    const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
    const [galleryForm, setGalleryForm] = useState<Partial<GalleryItem>>({});
    const [editingGalleryId, setEditingGalleryId] = useState<string | null>(null);

    // Testimonials State
    const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
    const [testimonialForm, setTestimonialForm] = useState<Partial<Testimonial>>({});
    const [editingTestimonialId, setEditingTestimonialId] = useState<string | null>(null);

    // Site Content State
    const [siteContent, setSiteContent] = useState<SiteContent[]>([]);
    const [contentForm, setContentForm] = useState<Partial<SiteContent>>({});
    const [editingContentKey, setEditingContentKey] = useState<string | null>(null);

    useEffect(() => {
        if (!isSupabaseConfigured()) return;

        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            if (session) {
                fetchServices();
                fetchGallery();
                fetchTestimonials();
                fetchSiteContent();
            }
        });

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
            if (session) {
                fetchServices();
                fetchGallery();
                fetchTestimonials();
                fetchSiteContent();
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    const fetchServices = async () => {
        const { data } = await supabase.from('services').select('*').order('created_at', { ascending: true });
        setServices(data || []);
    };

    const fetchGallery = async () => {
        const { data } = await supabase.from('gallery').select('*').order('created_at', { ascending: false });
        setGalleryItems(data || []);
    };

    const fetchTestimonials = async () => {
        const { data } = await supabase.from('testimonials').select('*').order('created_at', { ascending: false });
        setTestimonials(data || []);
    };

    const fetchSiteContent = async () => {
        const { data } = await supabase.from('site_content').select('*').order('key', { ascending: true });
        setSiteContent(data || []);
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isSupabaseConfigured()) {
            setError("Supabase non configuré.");
            return;
        }
        setLoading(true);
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) setError(error.message);
        setLoading(false);
    };

    // --- SERVICE LOGIC ---
    const handleSaveService = async () => {
        if (!serviceForm.title) return;
        setLoading(true);
        const badgesArray = badgesInput.split(',').map(b => b.trim()).filter(b => b.length > 0);
        const dataToSave = {
            ...serviceForm,
            badges: badgesArray,
            alignment: serviceForm.alignment || 'center',
            colorTheme: serviceForm.colorTheme || '#ffffff'
        };

        try {
            if (editingId === 'new') {
                await supabase.from('services').insert([dataToSave]);
            } else {
                await supabase.from('services').update(dataToSave).eq('id', editingId);
            }
            await fetchServices();
            setEditingId(null);
            setServiceForm({});
            onUpdate();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteService = async (id: string) => {
        if (!window.confirm('Supprimer ce service ?')) return;
        setLoading(true);
        await supabase.from('services').delete().eq('id', id);
        await fetchServices();
        onUpdate();
        setLoading(false);
    };

    const startEditService = (service: StoryChapter) => {
        setEditingId(service.id);
        setServiceForm(service);
        setBadgesInput(service.badges ? service.badges.join(', ') : '');
    };

    const startNewService = () => {
        setEditingId('new');
        setServiceForm({
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

    // --- GALLERY LOGIC ---
    const handleSaveGallery = async () => {
        if (!galleryForm.image) return;
        setLoading(true);
        const dataToSave = {
            ...galleryForm,
            size: galleryForm.size || 'medium',
            category: galleryForm.category || 'Portfolio'
        };

        try {
            if (editingGalleryId === 'new') {
                await supabase.from('gallery').insert([dataToSave]);
            } else {
                await supabase.from('gallery').update(dataToSave).eq('id', editingGalleryId);
            }
            await fetchGallery();
            setEditingGalleryId(null);
            setGalleryForm({});
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteGallery = async (id: string) => {
        if (!window.confirm('Supprimer cette image ?')) return;
        setLoading(true);
        await supabase.from('gallery').delete().eq('id', id);
        await fetchGallery();
        setLoading(false);
    };

    const startNewGallery = () => {
        setEditingGalleryId('new');
        setGalleryForm({
            image: '',
            alt: '',
            category: '',
            size: 'medium'
        });
    };

    const startEditGallery = (item: GalleryItem) => {
        setEditingGalleryId(item.id);
        setGalleryForm(item);
    };

    // --- TESTIMONIALS LOGIC ---
    const handleSaveTestimonial = async () => {
        if (!testimonialForm.quote || !testimonialForm.author) return;
        setLoading(true);
        const dataToSave = {
            quote: testimonialForm.quote,
            author: testimonialForm.author,
            role: testimonialForm.role || ''
        };

        try {
            if (editingTestimonialId === 'new') {
                await supabase.from('testimonials').insert([dataToSave]);
            } else {
                await supabase.from('testimonials').update(dataToSave).eq('id', editingTestimonialId);
            }
            await fetchTestimonials();
            setEditingTestimonialId(null);
            setTestimonialForm({});
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteTestimonial = async (id: string) => {
        if (!window.confirm('Supprimer ce témoignage ?')) return;
        setLoading(true);
        await supabase.from('testimonials').delete().eq('id', id);
        await fetchTestimonials();
        setLoading(false);
    };

    const startNewTestimonial = () => {
        setEditingTestimonialId('new');
        setTestimonialForm({ quote: '', author: '', role: '' });
    };

    const startEditTestimonial = (item: Testimonial) => {
        setEditingTestimonialId(item.id);
        setTestimonialForm(item);
    };

    // --- SITE CONTENT LOGIC ---
    const handleSaveContent = async () => {
        if (!contentForm.key || !contentForm.value) return;
        setLoading(true);

        try {
            await supabase.from('site_content')
                .upsert({ key: contentForm.key, value: contentForm.value, description: contentForm.description || '' })
                .eq('key', contentForm.key);
            await fetchSiteContent();
            setEditingContentKey(null);
            setContentForm({});
            onUpdate(); // Trigger App.tsx to refetch
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const startEditContent = (item: SiteContent) => {
        setEditingContentKey(item.key);
        setContentForm(item);
    };

    // --- RENDER LOGIN ---
    if (!session) {
        return (
            <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-xl">
                <div className="w-full max-w-md p-8 bg-white/5 border border-white/10 rounded-2xl relative">
                    <button onClick={onClose} className="absolute top-4 right-4 text-white/50 hover:text-white"><X className="w-6 h-6" /></button>
                    <h2 className="text-2xl font-serif text-white mb-6 text-center">Connexion Admin</h2>
                    {!isSupabaseConfigured() && (
                        <div className="mb-4 text-yellow-500 text-sm">Base de données non configurée.</div>
                    )}
                    {error && <div className="mb-4 text-red-400 text-sm">{error}</div>}
                    <form onSubmit={handleLogin} className="space-y-4">
                        <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full bg-black/40 border border-white/10 rounded p-3 text-white" placeholder="Email" disabled={!isSupabaseConfigured()} />
                        <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full bg-black/40 border border-white/10 rounded p-3 text-white" placeholder="Mot de passe" disabled={!isSupabaseConfigured()} />
                        <button type="submit" disabled={loading || !isSupabaseConfigured()} className="w-full py-3 bg-white text-black font-bold uppercase hover:bg-gray-200 mt-4 disabled:opacity-50">Connexion</button>
                    </form>
                </div>
            </div>
        );
    }

    // --- RENDER DASHBOARD ---
    return (
        <div className="fixed inset-0 z-[100] bg-[#050505] overflow-y-auto">
            <div className="sticky top-0 z-50 bg-[#0a0a0a] border-b border-white/10 px-6 py-4 flex justify-between items-center">
                <h2 className="text-xl font-serif text-white flex items-center gap-2">Dashboard Pacao</h2>
                <div className="flex items-center gap-4">
                    <button onClick={async () => { await supabase.auth.signOut(); onClose(); }} className="text-xs text-red-400 hover:text-red-300 uppercase"><LogOut className="w-4 h-4" /></button>
                    <button onClick={onClose} className="text-white hover:bg-white/10 rounded-full p-2"><X className="w-6 h-6" /></button>
                </div>
            </div>

            <div className="max-w-6xl mx-auto p-6 md:p-12">
                {/* TABS */}
                <div className="flex gap-4 mb-8 border-b border-white/10 pb-4">
                    <button
                        onClick={() => setActiveTab('services')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${activeTab === 'services' ? 'bg-white text-black' : 'text-white/50 hover:text-white'}`}
                    >
                        <LayoutGrid className="w-4 h-4" /> Services
                    </button>
                    <button
                        onClick={() => setActiveTab('gallery')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${activeTab === 'gallery' ? 'bg-white text-black' : 'text-white/50 hover:text-white'}`}
                    >
                        <ImageIcon className="w-4 h-4" /> Galerie
                    </button>
                    <button
                        onClick={() => setActiveTab('testimonials')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${activeTab === 'testimonials' ? 'bg-white text-black' : 'text-white/50 hover:text-white'}`}
                    >
                        <MessageSquare className="w-4 h-4" /> Témoignages
                    </button>
                    <button
                        onClick={() => setActiveTab('content')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${activeTab === 'content' ? 'bg-white text-black' : 'text-white/50 hover:text-white'}`}
                    >
                        <Settings className="w-4 h-4" /> Contenu
                    </button>
                </div>

                {/* SERVICES TAB */}
                {activeTab === 'services' && (
                    <>
                        <div className="flex justify-between items-end mb-8">
                            <h1 className="text-3xl font-bold text-white">Services</h1>
                            <button onClick={startNewService} className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-lg"><Plus className="w-4 h-4" /> Ajouter</button>
                        </div>

                        {editingId && (
                            <div className="mb-12 p-6 bg-white/5 border border-white/10 rounded-xl">
                                <h3 className="text-white mb-4">{editingId === 'new' ? 'Nouveau Service' : 'Modifier Service'}</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-4">
                                        <input placeholder="Titre" className="w-full bg-black/20 border border-white/10 p-3 text-white rounded" value={serviceForm.title || ''} onChange={e => setServiceForm({ ...serviceForm, title: e.target.value })} />
                                        <input placeholder="Sous-titre" className="w-full bg-black/20 border border-white/10 p-3 text-white rounded" value={serviceForm.subtitle || ''} onChange={e => setServiceForm({ ...serviceForm, subtitle: e.target.value })} />
                                        <input placeholder="Prix (Optionnel, ex: 15.000 FCFA)" className="w-full bg-black/20 border border-white/10 p-3 text-white rounded" value={serviceForm.price || ''} onChange={e => setServiceForm({ ...serviceForm, price: e.target.value })} />
                                        <input placeholder="Badges (sep. virgules, ex: Promo, Nouveau)" className="w-full bg-black/20 border border-white/10 p-3 text-white rounded" value={badgesInput} onChange={e => setBadgesInput(e.target.value)} />
                                        <input type="color" className="h-10 w-full" value={serviceForm.colorTheme || '#ffffff'} onChange={e => setServiceForm({ ...serviceForm, colorTheme: e.target.value })} />
                                    </div>
                                    <div className="space-y-4">
                                        <ImageUpload
                                            currentImage={serviceForm.image}
                                            onImageChange={(url) => setServiceForm({ ...serviceForm, image: url })}
                                            label="Image du service"
                                        />
                                        <textarea placeholder="Description" className="w-full h-32 bg-black/20 border border-white/10 p-3 text-white rounded resize-none" value={serviceForm.content || ''} onChange={e => setServiceForm({ ...serviceForm, content: e.target.value })} />
                                    </div>
                                </div>
                                <div className="flex justify-end gap-3 mt-6">
                                    <button onClick={() => setEditingId(null)} className="px-4 py-2 text-white/60">Annuler</button>
                                    <button onClick={handleSaveService} disabled={loading} className="px-6 py-2 bg-white text-black rounded hover:bg-gray-200">{loading ? '...' : 'Enregistrer'}</button>
                                </div>
                            </div>
                        )}

                        <div className="grid gap-4">
                            {services.map(s => (
                                <div key={s.id} className="flex justify-between items-center p-4 bg-white/[0.03] border border-white/5 rounded-lg group hover:bg-white/[0.05] transition-colors">
                                    <div className="flex items-center gap-4">
                                        <div className="relative w-12 h-12 rounded overflow-hidden">
                                            <img src={s.image} className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-opacity" />
                                        </div>
                                        <div>
                                            <span className="text-white font-medium block">{s.title}</span>
                                            <span className="text-xs text-white/40">
                                                {s.price || 'Aucun prix'} {s.badges && s.badges.length > 0 && `• ${s.badges.length} badge(s)`}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <button onClick={() => startEditService(s)} className="px-3 py-1 bg-white/10 hover:bg-white/20 text-white rounded text-sm transition-colors">Modifier</button>
                                        <button onClick={() => handleDeleteService(s.id)} className="p-2 text-red-400 hover:bg-red-900/20 rounded transition-colors"><Trash2 className="w-4 h-4" /></button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}

                {/* GALLERY TAB */}
                {activeTab === 'gallery' && (
                    <>
                        <div className="flex justify-between items-end mb-8">
                            <h1 className="text-3xl font-bold text-white">Galerie</h1>
                            <button onClick={startNewGallery} className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-lg"><Plus className="w-4 h-4" /> Ajouter Image</button>
                        </div>

                        {editingGalleryId && (
                            <div className="mb-12 p-6 bg-white/5 border border-white/10 rounded-xl">
                                <h3 className="text-white mb-4">{editingGalleryId === 'new' ? 'Nouvelle Image' : 'Modifier Image'}</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-4">
                                        <input placeholder="Titre (Alt text)" className="w-full bg-black/20 border border-white/10 p-3 text-white rounded" value={galleryForm.alt || ''} onChange={e => setGalleryForm({ ...galleryForm, alt: e.target.value })} />
                                        <input placeholder="Catégorie" className="w-full bg-black/20 border border-white/10 p-3 text-white rounded" value={galleryForm.category || ''} onChange={e => setGalleryForm({ ...galleryForm, category: e.target.value })} />
                                        <select className="w-full bg-black/20 border border-white/10 p-3 text-white rounded" value={galleryForm.size || 'medium'} onChange={e => setGalleryForm({ ...galleryForm, size: e.target.value as any })}>
                                            <option value="small">Petit (Carré)</option>
                                            <option value="medium">Moyen (Portrait)</option>
                                            <option value="large">Grand (Paysage/Haut)</option>
                                        </select>
                                    </div>
                                    <div className="space-y-4">
                                        <ImageUpload
                                            currentImage={galleryForm.image}
                                            onImageChange={(url) => setGalleryForm({ ...galleryForm, image: url })}
                                            label="Image de la galerie"
                                        />
                                    </div>
                                </div>
                                <div className="flex justify-end gap-3 mt-6">
                                    <button onClick={() => setEditingGalleryId(null)} className="px-4 py-2 text-white/60">Annuler</button>
                                    <button onClick={handleSaveGallery} disabled={loading} className="px-6 py-2 bg-white text-black rounded hover:bg-gray-200">{loading ? '...' : 'Enregistrer'}</button>
                                </div>
                            </div>
                        )}

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {galleryItems.map(item => (
                                <div key={item.id} className="group relative aspect-square bg-white/5 rounded-lg overflow-hidden border border-white/5">
                                    <img src={item.image} className="w-full h-full object-cover" />
                                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                                        <span className="text-white text-xs">{item.alt}</span>
                                        <div className="flex gap-2">
                                            <button onClick={() => startEditGallery(item)} className="p-2 bg-white text-black rounded-full"><Tag className="w-3 h-3" /></button>
                                            <button onClick={() => handleDeleteGallery(item.id)} className="p-2 bg-red-500 text-white rounded-full"><Trash2 className="w-3 h-3" /></button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}

                {/* TESTIMONIALS TAB */}
                {activeTab === 'testimonials' && (
                    <>
                        <div className="flex justify-between items-end mb-8">
                            <h1 className="text-3xl font-bold text-white">Témoignages</h1>
                            <button onClick={startNewTestimonial} className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-lg"><Plus className="w-4 h-4" /> Ajouter</button>
                        </div>

                        {editingTestimonialId && (
                            <div className="mb-12 p-6 bg-white/5 border border-white/10 rounded-xl">
                                <h3 className="text-white mb-4">{editingTestimonialId === 'new' ? 'Nouveau Témoignage' : 'Modifier Témoignage'}</h3>
                                <div className="space-y-4">
                                    <textarea placeholder="Citation" className="w-full h-24 bg-black/20 border border-white/10 p-3 text-white rounded resize-none" value={testimonialForm.quote || ''} onChange={e => setTestimonialForm({ ...testimonialForm, quote: e.target.value })} />
                                    <input placeholder="Auteur" className="w-full bg-black/20 border border-white/10 p-3 text-white rounded" value={testimonialForm.author || ''} onChange={e => setTestimonialForm({ ...testimonialForm, author: e.target.value })} />
                                    <input placeholder="Rôle / Titre" className="w-full bg-black/20 border border-white/10 p-3 text-white rounded" value={testimonialForm.role || ''} onChange={e => setTestimonialForm({ ...testimonialForm, role: e.target.value })} />
                                </div>
                                <div className="flex justify-end gap-3 mt-6">
                                    <button onClick={() => setEditingTestimonialId(null)} className="px-4 py-2 text-white/60">Annuler</button>
                                    <button onClick={handleSaveTestimonial} disabled={loading} className="px-6 py-2 bg-white text-black rounded hover:bg-gray-200">{loading ? '...' : 'Enregistrer'}</button>
                                </div>
                            </div>
                        )}

                        <div className="grid gap-4">
                            {testimonials.map(t => (
                                <div key={t.id} className="flex justify-between items-start p-4 bg-white/[0.03] border border-white/5 rounded-lg group hover:bg-white/[0.05] transition-colors">
                                    <div className="flex-1">
                                        <p className="text-white/80 italic mb-2">"{t.quote}"</p>
                                        <span className="text-sm text-white/60">— {t.author}, {t.role}</span>
                                    </div>
                                    <div className="flex gap-2">
                                        <button onClick={() => startEditTestimonial(t)} className="px-3 py-1 bg-white/10 hover:bg-white/20 text-white rounded text-sm transition-colors">Modifier</button>
                                        <button onClick={() => handleDeleteTestimonial(t.id)} className="p-2 text-red-400 hover:bg-red-900/20 rounded transition-colors"><Trash2 className="w-4 h-4" /></button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}

                {/* CONTENT TAB */}
                {activeTab === 'content' && (
                    <>
                        <div className="mb-8">
                            <h1 className="text-3xl font-bold text-white">Contenu du Site</h1>
                            <p className="text-white/40 text-sm mt-2">Modifier les textes globaux du site (Hero, Footer, WhatsApp, etc.)</p>
                        </div>

                        {editingContentKey && (
                            <div className="mb-12 p-6 bg-white/5 border border-white/10 rounded-xl">
                                <h3 className="text-white mb-4">Modifier : {contentForm.description || contentForm.key}</h3>
                                <div className="space-y-4">
                                    <input placeholder="Clé (identifiant)" className="w-full bg-black/40 border border-white/10 p-3 text-white/50 rounded" value={contentForm.key || ''} disabled />
                                    <textarea placeholder="Valeur" className="w-full h-24 bg-black/20 border border-white/10 p-3 text-white rounded resize-none" value={contentForm.value || ''} onChange={e => setContentForm({ ...contentForm, value: e.target.value })} />
                                    <input placeholder="Description (optionnel)" className="w-full bg-black/20 border border-white/10 p-3 text-white rounded" value={contentForm.description || ''} onChange={e => setContentForm({ ...contentForm, description: e.target.value })} />
                                </div>
                                <div className="flex justify-end gap-3 mt-6">
                                    <button onClick={() => setEditingContentKey(null)} className="px-4 py-2 text-white/60">Annuler</button>
                                    <button onClick={handleSaveContent} disabled={loading} className="px-6 py-2 bg-white text-black rounded hover:bg-gray-200">{loading ? '...' : 'Enregistrer'}</button>
                                </div>
                            </div>
                        )}

                        <div className="grid gap-3">
                            {siteContent.map(item => (
                                <div key={item.key} className="flex justify-between items-center p-4 bg-white/[0.03] border border-white/5 rounded-lg group hover:bg-white/[0.05] transition-colors">
                                    <div className="flex-1">
                                        <div className="text-white font-medium">{item.description || item.key}</div>
                                        <div className="text-xs text-white/40 mt-1 font-mono">{item.key}</div>
                                        <div className="text-sm text-white/60 mt-2">{item.value}</div>
                                    </div>
                                    <button onClick={() => startEditContent(item)} className="px-3 py-1 bg-white/10 hover:bg-white/20 text-white rounded text-sm transition-colors">Modifier</button>
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};
