export interface StoryChapter {
  id: string;
  title: string;
  subtitle: string;
  content: string;
  image: string;
  alignment: 'left' | 'right' | 'center';
  colorTheme: string; // Hex color for lighting accents
  price?: string; // Optional: "5000 FCFA"
  badges?: string[]; // Optional: ["Promo", "Nouveau"]
}

export interface ParallaxState {
  scrollY: number;
}

export interface Testimonial {
  id: string;
  quote: string;
  author: string;
  role: string;
}

export interface GalleryItem {
  id: string;
  image: string;
  alt: string;
  size: 'small' | 'medium' | 'large'; // Pour le layout masonry
  category: string;
}