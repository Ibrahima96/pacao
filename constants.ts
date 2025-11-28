import { StoryChapter, Testimonial, GalleryItem } from './types';

export const WHATSAPP_NUMBER = "221779883924"; 

// Données de repli (fallback) si Supabase n'est pas connecté
export const DEFAULT_SERVICES_DATA: StoryChapter[] = [
  {
    id: 'service-branding',
    title: 'Identité & Branding',
    subtitle: 'Création Unique • Design • Finitions',
    content: `Votre identité est votre signature. Chez Pacao, nous forgeons des logos mémorables et des supports d'exception (cartes de visite luxe, papeterie) qui incarnent l'essence de votre activité avec une précision d'orfèvre.`,
    image: 'https://images.unsplash.com/photo-1634152962476-4b8a00e1915c?q=80&w=1200&auto=format&fit=crop', 
    alignment: 'center',
    colorTheme: '#fbbf24',
    price: 'Sur devis',
    badges: ['Populaire']
  },
  {
    id: 'service-print',
    title: 'Print Grand Format',
    subtitle: 'Impact Visuel • Murales • Publicité',
    content: `Dominez l'espace. Nos impressions grand format, des fresques murales immersives aux campagnes publicitaires urbaines, sont conçues pour captiver le regard avec une colorimétrie et une définition irréprochables.`,
    image: 'https://images.unsplash.com/photo-1562654501-a0ccc0fc3fb1?q=80&w=1200&auto=format&fit=crop', 
    alignment: 'left',
    colorTheme: '#f472b6',
    price: 'Dès 15.000 FCFA'
  },
  {
    id: 'service-custom',
    title: 'Personnalisation',
    subtitle: 'Textile • Packaging • Objets',
    content: `Marquez les esprits et la matière. Du flocage textile haute tenue pour vos équipes aux emballages produits sur mesure, nous transformons chaque objet en vecteur de votre marque.`,
    image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=1200&auto=format&fit=crop', 
    alignment: 'right',
    colorTheme: '#34d399',
    badges: ['Nouveau', 'Promo']
  },
  {
    id: 'service-tech',
    title: 'Hardware & Tech',
    subtitle: 'Équipement • Réseaux • Performance',
    content: `La puissance au service de la créativité. Nous fournissons et installons le matériel informatique et les infrastructures électriques critiques pour garantir la continuité et la performance de vos opérations.`,
    image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=1200&auto=format&fit=crop', 
    alignment: 'center',
    colorTheme: '#60a5fa', 
  },
];

export const TESTIMONIALS_DATA: Testimonial[] = [
  {
    id: 't1',
    quote: "La qualité d'impression des affiches pour notre événement était spectaculaire. Un rendu des couleurs fidèle et percutant qui a fait toute la différence.",
    author: "Claire S.",
    role: "Directrice Marketing, EventFlow"
  },
  {
    id: 't2',
    quote: "Pacao a modernisé toute notre flotte informatique avec une efficacité redoutable. Enfin un partenaire qui comprend nos enjeux techniques.",
    author: "Thomas L.",
    role: "Gérant, TechSolutions"
  },
  {
    id: 't3',
    quote: "Le flocage de nos tenues professionnelles tient parfaitement dans le temps. C'est ce souci du détail et de la durabilité que nous recherchions.",
    author: "Sarah B.",
    role: "Restauratrice, Le Petit Chef"
  }
];

export const GALLERY_DATA: GalleryItem[] = [
  {
    id: 'g1',
    image: 'https://images.unsplash.com/photo-1626785774573-4b799314346d?q=80&w=800&auto=format&fit=crop',
    alt: 'Détail impression offset',
    size: 'large',
    category: 'Print'
  },
  {
    id: 'g2',
    image: 'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?q=80&w=800&auto=format&fit=crop',
    alt: 'Matériel informatique setup',
    size: 'medium',
    category: 'Tech'
  },
  {
    id: 'g3',
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=800&auto=format&fit=crop',
    alt: 'Design graphique luxe',
    size: 'small',
    category: 'Design'
  },
  {
    id: 'g4',
    image: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?q=80&w=800&auto=format&fit=crop',
    alt: 'Flocage T-shirt',
    size: 'large',
    category: 'Textile'
  },
  {
    id: 'g5',
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800&auto=format&fit=crop',
    alt: 'Enseigne lumineuse',
    size: 'medium',
    category: 'Branding'
  },
  {
    id: 'g6',
    image: 'https://images.unsplash.com/photo-1632924194098-b80c54152a55?q=80&w=800&auto=format&fit=crop',
    alt: 'Papeterie premium',
    size: 'small',
    category: 'Print'
  }
];