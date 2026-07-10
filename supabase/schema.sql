-- ============================================================
-- CONGO SOLES - Supabase Schema
-- ============================================================
-- Copiez-collez ce script dans l'éditeur SQL de votre projet Supabase
-- (Dashboard > SQL Editor > New query > Paste > Run)
-- ============================================================

-- 1. Table des profils (liée à auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  name TEXT NOT NULL DEFAULT '',
  email TEXT NOT NULL DEFAULT '',
  avatar_url TEXT,
  role TEXT NOT NULL DEFAULT 'vendor' CHECK (role IN ('admin', 'vendor')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- RLS: chaque utilisateur ne voit que son profil
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, name, email)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', ''),
    NEW.email
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();


-- 2. Table des boutiques / commerçants
CREATE TABLE IF NOT EXISTS public.stores (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL DEFAULT '',
  slug TEXT NOT NULL DEFAULT '',
  description TEXT NOT NULL DEFAULT '',
  address TEXT NOT NULL DEFAULT '',
  phone TEXT NOT NULL DEFAULT '',
  website TEXT NOT NULL DEFAULT '',
  image TEXT NOT NULL DEFAULT '',
  logo_initial TEXT NOT NULL DEFAULT '',
  logo_color TEXT NOT NULL DEFAULT '',
  logo_gradient TEXT NOT NULL DEFAULT '',
  category TEXT NOT NULL DEFAULT '',
  rating NUMERIC(2,1) DEFAULT 0,
  review_count INT DEFAULT 0,
  promo_count INT DEFAULT 0,
  featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id)
);

ALTER TABLE public.stores ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own store"
  ON public.stores FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own store"
  ON public.stores FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own store"
  ON public.stores FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Public can view all stores"
  ON public.stores FOR SELECT
  USING (true);


-- 3. Table des promotions
CREATE TABLE IF NOT EXISTS public.promotions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  store_id UUID REFERENCES public.stores(id) ON DELETE SET NULL,
  title TEXT NOT NULL DEFAULT '',
  description TEXT NOT NULL DEFAULT '',
  discount INT NOT NULL DEFAULT 0,
  original_price NUMERIC(10,2) DEFAULT 0,
  sale_price NUMERIC(10,2) DEFAULT 0,
  image TEXT NOT NULL DEFAULT '',
  category TEXT NOT NULL DEFAULT '',
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('active', 'draft', 'expired')),
  is_flash BOOLEAN DEFAULT FALSE,
  expires_at TIMESTAMPTZ,
  views INT DEFAULT 0,
  clicks INT DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.promotions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own promotions"
  ON public.promotions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own promotions"
  ON public.promotions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own promotions"
  ON public.promotions FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own promotions"
  ON public.promotions FOR DELETE
  USING (auth.uid() = user_id);

CREATE POLICY "Public can view active promotions"
  ON public.promotions FOR SELECT
  USING (status = 'active');


-- 4. Table des clics / analytics
CREATE TABLE IF NOT EXISTS public.promo_clicks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  promo_id UUID REFERENCES public.promotions(id) ON DELETE CASCADE NOT NULL,
  user_agent TEXT,
  ip_address TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.promo_clicks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view clicks on own promotions"
  ON public.promo_clicks FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.promotions
      WHERE promotions.id = promo_clicks.promo_id
      AND promotions.user_id = auth.uid()
    )
  );

CREATE POLICY "Anyone can insert clicks"
  ON public.promo_clicks FOR INSERT
  WITH CHECK (true);


-- 5. Index pour les performances
CREATE INDEX IF NOT EXISTS idx_promotions_user_id ON public.promotions(user_id);
CREATE INDEX IF NOT EXISTS idx_promotions_status ON public.promotions(status);
CREATE INDEX IF NOT EXISTS idx_promotions_category ON public.promotions(category);
CREATE INDEX IF NOT EXISTS idx_stores_user_id ON public.stores(user_id);
CREATE INDEX IF NOT EXISTS idx_stores_category ON public.stores(category);
CREATE INDEX IF NOT EXISTS idx_promo_clicks_promo_id ON public.promo_clicks(promo_id);
