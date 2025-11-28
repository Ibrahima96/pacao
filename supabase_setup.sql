-- ============================================
-- PACAO - Complete Database Schema
-- ============================================
-- This file contains all tables and RLS policies
-- Execute this in Supabase SQL Editor
-- ============================================

-- ============================================
-- TABLES
-- ============================================

-- Services Table (Nos Expertises)
CREATE TABLE IF NOT EXISTS services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  subtitle TEXT,
  content TEXT NOT NULL,
  image TEXT NOT NULL,
  "colorTheme" VARCHAR(50) DEFAULT '#ffffff',
  alignment VARCHAR(50) DEFAULT 'center',
  price VARCHAR(100),
  badges TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Gallery Table (Réalisations)
CREATE TABLE IF NOT EXISTS gallery (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  image TEXT NOT NULL,
  alt VARCHAR(255),
  category VARCHAR(100),
  size VARCHAR(50) DEFAULT 'medium',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Testimonials Table
CREATE TABLE IF NOT EXISTS testimonials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quote TEXT NOT NULL,
  author VARCHAR(255) NOT NULL,
  role VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Site Content Table (Key-Value store for global settings)
CREATE TABLE IF NOT EXISTS site_content (
  key VARCHAR(255) PRIMARY KEY,
  value TEXT NOT NULL,
  description TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- ROW LEVEL SECURITY POLICIES
-- ============================================

-- Enable RLS on all tables
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_content ENABLE ROW LEVEL SECURITY;

-- Services Policies
-- Allow authenticated users (admins) to do everything
CREATE POLICY "services_all_authenticated" 
ON services 
FOR ALL 
TO authenticated 
USING (true) 
WITH CHECK (true);

-- Allow public read access
CREATE POLICY "services_select_public" 
ON services 
FOR SELECT 
TO anon 
USING (true);

-- Gallery Policies
-- Allow authenticated users (admins) to do everything
CREATE POLICY "gallery_all_authenticated" 
ON gallery 
FOR ALL 
TO authenticated 
USING (true) 
WITH CHECK (true);

-- Allow public read access
CREATE POLICY "gallery_select_public" 
ON gallery 
FOR SELECT 
TO anon 
USING (true);

-- Testimonials Policies
-- Allow authenticated users (admins) to do everything
CREATE POLICY "testimonials_all_authenticated" 
ON testimonials 
FOR ALL 
TO authenticated 
USING (true) 
WITH CHECK (true);

-- Allow public read access
CREATE POLICY "testimonials_select_public" 
ON testimonials 
FOR SELECT 
TO anon 
USING (true);

-- Site Content Policies
-- Allow authenticated users (admins) to do everything
CREATE POLICY "site_content_all_authenticated" 
ON site_content 
FOR ALL 
TO authenticated 
USING (true) 
WITH CHECK (true);

-- Allow public read access
CREATE POLICY "site_content_select_public" 
ON site_content 
FOR SELECT 
TO anon 
USING (true);

-- ============================================
-- DEFAULT DATA
-- ============================================

-- Insert Default Testimonials
INSERT INTO testimonials (quote, author, role) VALUES
  ('Pacao a transformé notre identité visuelle. Des cartes de visite aux supports publicitaires, tout reflète désormais notre professionnalisme.', 'Amadou Diallo', 'CEO, StartupHub'),
  ('Un service rapide et des impressions de qualité exceptionnelle. Je recommande vivement pour tous vos besoins graphiques.', 'Fatou Sow', 'Directrice Marketing'),
  ('De la conception à la livraison, l''équipe Pacao nous a accompagnés avec excellence. Nos supports visuels sont impeccables.', 'Mohamed Kane', 'Responsable Communication')
ON CONFLICT DO NOTHING;

-- Insert Default Site Content
INSERT INTO site_content (key, value, description) VALUES
  ('hero_title', 'PACAO', 'Main hero title'),
  ('hero_tagline', 'L''excellence au service de l''image', 'Hero tagline above title'),
  ('hero_subtitle', 'Nous transformons vos idées en supports tangibles. Design, Impression & Matériel Professionnel.', 'Hero subtitle/description'),
  ('whatsapp_number', '221779883924', 'WhatsApp contact number with country code'),
  ('site_name', 'Pacao (PDS)', 'Site/company name'),
  ('site_description', 'Solutions d''impression & digitales', 'Site description/tagline'),
  ('footer_cta_title', 'Prêt à collaborer ?', 'Footer call-to-action title'),
  ('footer_cta_text', 'Chaque projet commence par une discussion. Parlons de vos besoins.', 'Footer CTA description')
ON CONFLICT (key) DO NOTHING;

-- Insert Sample Services (Optional - for testing)
INSERT INTO services (title, subtitle, content, image, "colorTheme", alignment, price, badges) VALUES
  (
    'Cartes de Visite Premium', 
    'Votre première impression compte', 
    'Cartes de visite professionnelles sur papier haute qualité avec finitions variées : mat, brillant, vernis sélectif.', 
    'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=800', 
    '#3b82f6', 
    'center', 
    '5.000 FCFA', 
    ARRAY['Populaire', 'Rapide']
  ),
  (
    'Flyers & Brochures', 
    'Communiquez avec impact', 
    'Flyers publicitaires et brochures pliées, impression recto-verso, formats A5, A4, formats personnalisés.', 
    'https://images.unsplash.com/photo-1557683316-973673baf926?w=800', 
    '#10b981', 
    'left', 
    'À partir de 15.000 FCFA', 
    ARRAY['Promo']
  ),
  (
    'Enseignes & Banderoles', 
    'Visibilité garantie', 
    'Banderoles publicitaires extérieures, enseignes lumineuses, panneaux PVC, impression grand format.', 
    'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=800', 
    '#f59e0b', 
    'right', 
    'Sur devis', 
    ARRAY['Sur mesure']
  )
ON CONFLICT DO NOTHING;

-- Insert Sample Gallery Items (Optional - for testing)
INSERT INTO gallery (image, alt, category, size) VALUES
  ('https://images.unsplash.com/photo-1557682250-33bd709cbe85?w=800', 'Cartes de visite design moderne', 'Cartes de Visite', 'medium'),
  ('https://images.unsplash.com/photo-1557682224-5b8590cd9ec5?w=800', 'Brochures commerciales', 'Brochures', 'large'),
  ('https://images.unsplash.com/photo-1557682260-96773eb01377?w=800', 'Packaging produit premium', 'Packaging', 'small'),
  ('https://images.unsplash.com/photo-1542744173-05336fcc7ad4?w=800', 'Stand publicitaire professionnel', 'Stands', 'large'),
  ('https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=800', 'Enseigne lumineuse boutique', 'Enseignes', 'medium')
ON CONFLICT DO NOTHING;