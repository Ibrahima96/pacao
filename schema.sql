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
  ('whatsapp_number', '221123456789', 'WhatsApp contact number with country code'),
  ('site_name', 'Pacao (PDS)', 'Site/company name'),
  ('site_description', 'Solutions d''impression & digitales', 'Site description/tagline'),
  ('footer_cta_title', 'Prêt à collaborer ?', 'Footer call-to-action title'),
  ('footer_cta_text', 'Chaque projet commence par une discussion. Parlons de vos besoins.', 'Footer CTA description')
ON CONFLICT (key) DO NOTHING;
