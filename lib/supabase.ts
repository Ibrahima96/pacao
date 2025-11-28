import { createClient } from '@supabase/supabase-js';

// Ces variables doivent être définies dans votre environnement (ex: fichier .env ou configuration Vercel/Netlify)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = () => {
  return !!supabaseUrl && !!supabaseAnonKey;
};

// Fallback to a dummy URL to prevent the app from crashing during initialization if keys are missing.
// The app logic should use isSupabaseConfigured() to avoid making actual requests when not configured.
export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder'
);