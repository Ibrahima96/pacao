# Documentation SQL - Projet Pacao

## Vue d'ensemble
Cette documentation répertorie toutes les requêtes SQL utilisées dans le projet Pacao, incluant les scripts de création de schéma et toutes les opérations de base de données effectuées via Supabase.

---

## Table des matières
1. [Scripts SQL de Configuration](#scripts-sql-de-configuration)
   - [Schema Principal](#schema-principal)
   - [Configuration Supabase](#configuration-supabase)
   - [Configuration Storage](#configuration-storage)
   - [Mise à jour WhatsApp](#mise-à-jour-whatsapp)
2. [Requêtes SQL dans le Code](#requêtes-sql-dans-le-code)
   - [Services](#services)
   - [Gallery](#gallery)
   - [Testimonials](#testimonials)
   - [Site Content](#site-content)
   - [Authentification](#authentification)
   - [Storage](#storage)

---

## Scripts SQL de Configuration

### Schema Principal
**Fichier:** `schema.sql`

#### Création de la table Services
```sql
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
```

#### Création de la table Gallery
```sql
CREATE TABLE IF NOT EXISTS gallery (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  image TEXT NOT NULL,
  alt VARCHAR(255),
  category VARCHAR(100),
  size VARCHAR(50) DEFAULT 'medium',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### Création de la table Testimonials
```sql
CREATE TABLE IF NOT EXISTS testimonials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quote TEXT NOT NULL,
  author VARCHAR(255) NOT NULL,
  role VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### Création de la table Site Content
```sql
CREATE TABLE IF NOT EXISTS site_content (
  key VARCHAR(255) PRIMARY KEY,
  value TEXT NOT NULL,
  description TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### Insertion des témoignages par défaut
```sql
INSERT INTO testimonials (quote, author, role) VALUES
  ('Pacao a transformé notre identité visuelle. Des cartes de visite aux supports publicitaires, tout reflète désormais notre professionnalisme.', 'Amadou Diallo', 'CEO, StartupHub'),
  ('Un service rapide et des impressions de qualité exceptionnelle. Je recommande vivement pour tous vos besoins graphiques.', 'Fatou Sow', 'Directrice Marketing'),
  ('De la conception à la livraison, l''équipe Pacao nous a accompagnés avec excellence. Nos supports visuels sont impeccables.', 'Mohamed Kane', 'Responsable Communication')
ON CONFLICT DO NOTHING;
```

#### Insertion du contenu du site par défaut
```sql
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
```

---

### Configuration Supabase
**Fichier:** `supabase_setup.sql`

#### Activation de Row Level Security
```sql
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_content ENABLE ROW LEVEL SECURITY;
```

#### Politiques RLS - Services
```sql
-- Accès complet pour utilisateurs authentifiés
CREATE POLICY "services_all_authenticated" 
ON services 
FOR ALL 
TO authenticated 
USING (true) 
WITH CHECK (true);

-- Lecture publique
CREATE POLICY "services_select_public" 
ON services 
FOR SELECT 
TO anon 
USING (true);
```

#### Politiques RLS - Gallery
```sql
-- Accès complet pour utilisateurs authentifiés
CREATE POLICY "gallery_all_authenticated" 
ON gallery 
FOR ALL 
TO authenticated 
USING (true) 
WITH CHECK (true);

-- Lecture publique
CREATE POLICY "gallery_select_public" 
ON gallery 
FOR SELECT 
TO anon 
USING (true);
```

#### Politiques RLS - Testimonials
```sql
-- Accès complet pour utilisateurs authentifiés
CREATE POLICY "testimonials_all_authenticated" 
ON testimonials 
FOR ALL 
TO authenticated 
USING (true) 
WITH CHECK (true);

-- Lecture publique
CREATE POLICY "testimonials_select_public" 
ON testimonials 
FOR SELECT 
TO anon 
USING (true);
```

#### Politiques RLS - Site Content
```sql
-- Accès complet pour utilisateurs authentifiés
CREATE POLICY "site_content_all_authenticated" 
ON site_content 
FOR ALL 
TO authenticated 
USING (true) 
WITH CHECK (true);

-- Lecture publique
CREATE POLICY "site_content_select_public" 
ON site_content 
FOR SELECT 
TO anon 
USING (true);
```

#### Données d'exemple - Services
```sql
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
```

#### Données d'exemple - Gallery
```sql
INSERT INTO gallery (image, alt, category, size) VALUES
  ('https://images.unsplash.com/photo-1557682250-33bd709cbe85?w=800', 'Cartes de visite design moderne', 'Cartes de Visite', 'medium'),
  ('https://images.unsplash.com/photo-1557682224-5b8590cd9ec5?w=800', 'Brochures commerciales', 'Brochures', 'large'),
  ('https://images.unsplash.com/photo-1557682260-96773eb01377?w=800', 'Packaging produit premium', 'Packaging', 'small'),
  ('https://images.unsplash.com/photo-1542744173-05336fcc7ad4?w=800', 'Stand publicitaire professionnel', 'Stands', 'large'),
  ('https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=800', 'Enseigne lumineuse boutique', 'Enseignes', 'medium')
ON CONFLICT DO NOTHING;
```

---

### Configuration Storage
**Fichier:** `setup_storage.sql`

#### Création du bucket images
```sql
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'images', 
  'images', 
  true,
  5242880, -- 5MB en bytes
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
)
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 5242880,
  allowed_mime_types = ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
```

#### Politiques Storage - Lecture publique
```sql
DROP POLICY IF EXISTS "Public read access" ON storage.objects;
CREATE POLICY "Public read access"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'images');
```

#### Politiques Storage - Upload utilisateurs authentifiés
```sql
DROP POLICY IF EXISTS "Authenticated users can upload" ON storage.objects;
CREATE POLICY "Authenticated users can upload"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'images');
```

#### Politiques Storage - Mise à jour utilisateurs authentifiés
```sql
DROP POLICY IF EXISTS "Authenticated users can update" ON storage.objects;
CREATE POLICY "Authenticated users can update"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'images')
WITH CHECK (bucket_id = 'images');
```

#### Politiques Storage - Suppression utilisateurs authentifiés
```sql
DROP POLICY IF EXISTS "Authenticated users can delete" ON storage.objects;
CREATE POLICY "Authenticated users can delete"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'images');
```

---

### Mise à jour WhatsApp
**Fichier:** `update_whatsapp.sql`

```sql
UPDATE site_content 
SET value = '221779883924' 
WHERE key = 'whatsapp_number';
```

---

## Requêtes SQL dans le Code

### Services

#### Sélection de tous les services
**Fichier:** [`App.tsx`](file:///c:/Users/UBS/Desktop/PDS/pacao/App.tsx#L44-L46)
```typescript
const { data } = await supabase
  .from('services')
  .select('*');
```

#### Sélection avec tri (AdminDashboard)
**Fichier:** [`AdminDashboard.tsx`](file:///c:/Users/UBS/Desktop/PDS/pacao/components/AdminDashboard.tsx#L72)
```typescript
const { data } = await supabase
  .from('services')
  .select('*')
  .order('created_at', { ascending: true });
```

#### Insertion d'un nouveau service
**Fichier:** [`App.tsx`](file:///c:/Users/UBS/Desktop/PDS/pacao/App.tsx#L134)
```typescript
await supabase
  .from('services')
  .insert([dataToInsert]);
```

**Fichier:** [`AdminDashboard.tsx`](file:///c:/Users/UBS/Desktop/PDS/pacao/components/AdminDashboard.tsx#L117)
```typescript
await supabase
  .from('services')
  .insert([dataToSave]);
```

#### Mise à jour d'un service
**Fichier:** [`App.tsx`](file:///c:/Users/UBS/Desktop/PDS/pacao/App.tsx#L136)
```typescript
await supabase
  .from('services')
  .update(editingService)
  .eq('id', editingService.id);
```

**Fichier:** [`AdminDashboard.tsx`](file:///c:/Users/UBS/Desktop/PDS/pacao/components/AdminDashboard.tsx#L119)
```typescript
await supabase
  .from('services')
  .update(dataToSave)
  .eq('id', editingId);
```

#### Suppression d'un service
**Fichier:** [`App.tsx`](file:///c:/Users/UBS/Desktop/PDS/pacao/App.tsx#L111)
```typescript
await supabase
  .from('services')
  .delete()
  .eq('id', chapter.id);
```

**Fichier:** [`AdminDashboard.tsx`](file:///c:/Users/UBS/Desktop/PDS/pacao/components/AdminDashboard.tsx#L135)
```typescript
await supabase
  .from('services')
  .delete()
  .eq('id', id);
```

---

### Gallery

#### Sélection de toutes les images avec tri
**Fichier:** [`Gallery.tsx`](file:///c:/Users/UBS/Desktop/PDS/pacao/components/Gallery.tsx#L79)
```typescript
const { data } = await supabase
  .from('gallery')
  .select('*');
```

**Fichier:** [`AdminDashboard.tsx`](file:///c:/Users/UBS/Desktop/PDS/pacao/components/AdminDashboard.tsx#L77)
```typescript
const { data } = await supabase
  .from('gallery')
  .select('*')
  .order('created_at', { ascending: false });
```

#### Insertion d'une nouvelle image
**Fichier:** [`AdminDashboard.tsx`](file:///c:/Users/UBS/Desktop/PDS/pacao/components/AdminDashboard.tsx#L174)
```typescript
await supabase
  .from('gallery')
  .insert([dataToSave]);
```

#### Mise à jour d'une image
**Fichier:** [`AdminDashboard.tsx`](file:///c:/Users/UBS/Desktop/PDS/pacao/components/AdminDashboard.tsx#L176)
```typescript
await supabase
  .from('gallery')
  .update(dataToSave)
  .eq('id', editingGalleryId);
```

#### Suppression d'une image
**Fichier:** [`AdminDashboard.tsx`](file:///c:/Users/UBS/Desktop/PDS/pacao/components/AdminDashboard.tsx#L191)
```typescript
await supabase
  .from('gallery')
  .delete()
  .eq('id', id);
```

---

### Testimonials

#### Sélection de tous les témoignages
**Fichier:** [`Testimonials.tsx`](file:///c:/Users/UBS/Desktop/PDS/pacao/components/Testimonials.tsx#L16)
```typescript
const { data } = await supabase
  .from('testimonials')
  .select('*');
```

**Fichier:** [`AdminDashboard.tsx`](file:///c:/Users/UBS/Desktop/PDS/pacao/components/AdminDashboard.tsx#L82)
```typescript
const { data } = await supabase
  .from('testimonials')
  .select('*')
  .order('created_at', { ascending: false });
```

#### Insertion d'un nouveau témoignage
**Fichier:** [`AdminDashboard.tsx`](file:///c:/Users/UBS/Desktop/PDS/pacao/components/AdminDashboard.tsx#L223)
```typescript
await supabase
  .from('testimonials')
  .insert([dataToSave]);
```

#### Mise à jour d'un témoignage
**Fichier:** [`AdminDashboard.tsx`](file:///c:/Users/UBS/Desktop/PDS/pacao/components/AdminDashboard.tsx#L225)
```typescript
await supabase
  .from('testimonials')
  .update(dataToSave)
  .eq('id', editingTestimonialId);
```

#### Suppression d'un témoignage
**Fichier:** [`AdminDashboard.tsx`](file:///c:/Users/UBS/Desktop/PDS/pacao/components/AdminDashboard.tsx#L240)
```typescript
await supabase
  .from('testimonials')
  .delete()
  .eq('id', id);
```

---

### Site Content

#### Sélection de tout le contenu du site
**Fichier:** [`App.tsx`](file:///c:/Users/UBS/Desktop/PDS/pacao/App.tsx#L66)
```typescript
const { data, error } = await supabase
  .from('site_content')
  .select('*');
```

**Fichier:** [`AdminDashboard.tsx`](file:///c:/Users/UBS/Desktop/PDS/pacao/components/AdminDashboard.tsx#L87)
```typescript
const { data } = await supabase
  .from('site_content')
  .select('*')
  .order('key', { ascending: true });
```

#### Mise à jour du contenu du site (Upsert)
**Fichier:** [`AdminDashboard.tsx`](file:///c:/Users/UBS/Desktop/PDS/pacao/components/AdminDashboard.tsx#L261-L263)
```typescript
await supabase
  .from('site_content')
  .upsert({ key: contentKey, value: contentValue })
  .select();
```

---

### Authentification

#### Récupération de la session
**Fichier:** [`AdminContext.tsx`](file:///c:/Users/UBS/Desktop/PDS/pacao/contexts/AdminContext.tsx#L26)
```typescript
supabase.auth.getSession().then(({ data: { session } }) => {
  setSession(session);
  setInitialized(true);
});
```

**Fichier:** [`AdminDashboard.tsx`](file:///c:/Users/UBS/Desktop/PDS/pacao/components/AdminDashboard.tsx#L46)
```typescript
supabase.auth.getSession().then(({ data: { session } }) => {
  setSession(session);
});
```

#### Écoute des changements d'état d'authentification
**Fichier:** [`AdminContext.tsx`](file:///c:/Users/UBS/Desktop/PDS/pacao/contexts/AdminContext.tsx#L34)
```typescript
const {
  data: { subscription },
} = supabase.auth.onAuthStateChange((_event, session) => {
  setSession(session);
});
```

**Fichier:** [`AdminDashboard.tsx`](file:///c:/Users/UBS/Desktop/PDS/pacao/components/AdminDashboard.tsx#L58)
```typescript
const {
  data: { subscription },
} = supabase.auth.onAuthStateChange((_event, session) => {
  setSession(session);
});
```

#### Connexion avec mot de passe
**Fichier:** [`AdminDashboard.tsx`](file:///c:/Users/UBS/Desktop/PDS/pacao/components/AdminDashboard.tsx#L98)
```typescript
const { error } = await supabase.auth.signInWithPassword({ 
  email, 
  password 
});
```

#### Déconnexion
**Fichier:** [`AdminDashboard.tsx`](file:///c:/Users/UBS/Desktop/PDS/pacao/components/AdminDashboard.tsx#L307)
```typescript
await supabase.auth.signOut();
```

---

### Storage

#### Upload d'un fichier
**Fichier:** [`imageUpload.ts`](file:///c:/Users/UBS/Desktop/PDS/pacao/lib/imageUpload.ts#L22-L24)
```typescript
const { data, error } = await supabase.storage
  .from(bucket)
  .upload(fileName, file, {
    cacheControl: '3600',
    upsert: false
  });
```

#### Récupération de l'URL publique
**Fichier:** [`imageUpload.ts`](file:///c:/Users/UBS/Desktop/PDS/pacao/lib/imageUpload.ts#L35-L37)
```typescript
const { data: { publicUrl } } = supabase.storage
  .from(bucket)
  .getPublicUrl(fileName);
```

#### Suppression d'un fichier
**Fichier:** [`imageUpload.ts`](file:///c:/Users/UBS/Desktop/PDS/pacao/lib/imageUpload.ts#L61-L63)
```typescript
const { error } = await supabase.storage
  .from(bucket)
  .remove([fileName]);
```

---

## Statistiques

### Tables
- **4 tables principales** : `services`, `gallery`, `testimonials`, `site_content`
- **1 bucket storage** : `images`

### Opérations CRUD
| Table | SELECT | INSERT | UPDATE | DELETE |
|-------|--------|--------|--------|--------|
| services | ✅ | ✅ | ✅ | ✅ |
| gallery | ✅ | ✅ | ✅ | ✅ |
| testimonials | ✅ | ✅ | ✅ | ✅ |
| site_content | ✅ | ❌ | ✅ (upsert) | ❌ |

### Authentification
- Connexion par email/mot de passe
- Gestion de session
- Déconnexion

### Storage
- Upload d'images (max 5MB)
- Formats supportés : JPEG, JPG, PNG, GIF, WEBP
- Accès public en lecture
- Modification/suppression pour utilisateurs authentifiés

---

## Notes Importantes

1. **Row Level Security (RLS)** : Toutes les tables ont RLS activé
2. **Accès public** : Lecture autorisée pour les utilisateurs anonymes
3. **Accès authentifié** : CRUD complet pour les utilisateurs authentifiés
4. **Timestamps** : Toutes les tables (sauf `site_content`) ont un `created_at`
5. **UUID** : Utilisation de `gen_random_uuid()` pour les clés primaires
6. **Site Content** : Fonctionne comme un key-value store pour les paramètres globaux
