-- ============================================================
-- CONGO SOLES - Schema v2 (Super Admin Modules)
-- ============================================================

-- 1. Update profiles role check to include all roles
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_role_check;
ALTER TABLE public.profiles ADD CONSTRAINT profiles_role_check
  CHECK (role IN ('super_admin', 'admin', 'moderator', 'vendor', 'shop_manager', 'client'));

-- 2. Update stores: add status, verification, badges, documents
ALTER TABLE public.stores ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'pending'
  CHECK (status IN ('pending', 'active', 'suspended', 'rejected'));
ALTER TABLE public.stores ADD COLUMN IF NOT EXISTS verified BOOLEAN DEFAULT FALSE;
ALTER TABLE public.stores ADD COLUMN IF NOT EXISTS premium BOOLEAN DEFAULT FALSE;
ALTER TABLE public.stores ADD COLUMN IF NOT EXISTS verified_at TIMESTAMPTZ;
ALTER TABLE public.stores ADD COLUMN IF NOT EXISTS rejected_reason TEXT DEFAULT '';
ALTER TABLE public.stores ADD COLUMN IF NOT EXISTS district TEXT DEFAULT '';
ALTER TABLE public.stores ADD COLUMN IF NOT EXISTS neighborhood TEXT DEFAULT '';
ALTER TABLE public.stores ADD COLUMN IF NOT EXISTS gps_lat NUMERIC(10,7);
ALTER TABLE public.stores ADD COLUMN IF NOT EXISTS gps_lng NUMERIC(10,7);

-- 3. Update promotions: add flagged, featured, archived
ALTER TABLE public.promotions ADD COLUMN IF NOT EXISTS flagged BOOLEAN DEFAULT FALSE;
ALTER TABLE public.promotions ADD COLUMN IF NOT EXISTS featured BOOLEAN DEFAULT FALSE;
ALTER TABLE public.promotions ADD COLUMN IF NOT EXISTS archived BOOLEAN DEFAULT FALSE;
ALTER TABLE public.promotions ADD COLUMN IF NOT EXISTS rejection_reason TEXT DEFAULT '';
ALTER TABLE public.promotions ADD COLUMN IF NOT EXISTS district TEXT DEFAULT '';
ALTER TABLE public.promotions ADD COLUMN IF NOT EXISTS neighborhood TEXT DEFAULT '';

-- 4. Categories & Subcategories
CREATE TABLE IF NOT EXISTS public.categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  icon TEXT DEFAULT '',
  image TEXT DEFAULT '',
  description TEXT DEFAULT '',
  display_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.subcategories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  category_id UUID REFERENCES public.categories(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  description TEXT DEFAULT '',
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. Localisations (arrondissements, quartiers)
CREATE TABLE IF NOT EXISTS public.districts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  display_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.neighborhoods (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  district_id UUID REFERENCES public.districts(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. Subscriptions (abonnements)
CREATE TABLE IF NOT EXISTS public.subscription_plans (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT DEFAULT '',
  price NUMERIC(10,2) NOT NULL DEFAULT 0,
  max_promotions INT DEFAULT 0,
  max_stores INT DEFAULT 1,
  duration_days INT NOT NULL DEFAULT 30,
  features JSONB DEFAULT '[]',
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.subscriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  plan_id UUID REFERENCES public.subscription_plans(id) ON DELETE SET NULL,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'expired', 'cancelled', 'suspended')),
  starts_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expires_at TIMESTAMPTZ NOT NULL,
  auto_renew BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 7. Payments
CREATE TABLE IF NOT EXISTS public.payments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  subscription_id UUID REFERENCES public.subscriptions(id) ON DELETE SET NULL,
  amount NUMERIC(10,2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'XAF',
  method TEXT NOT NULL DEFAULT 'mobile_money' CHECK (method IN ('mobile_money', 'card', 'bank', 'manual')),
  provider TEXT DEFAULT '' CHECK (provider IN ('mtn', 'airtel', 'visa', 'mastercard', 'bank', 'manual', '')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
  transaction_id TEXT DEFAULT '',
  phone TEXT DEFAULT '',
  receipt_url TEXT DEFAULT '',
  notes TEXT DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 8. Sponsored campaigns
CREATE TABLE IF NOT EXISTS public.sponsored_campaigns (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  store_id UUID REFERENCES public.stores(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('home_feature', 'featured_store', 'banner', 'search_priority', 'push_notification', 'event')),
  title TEXT NOT NULL,
  description TEXT DEFAULT '',
  budget NUMERIC(10,2) NOT NULL DEFAULT 0,
  cost_per_click NUMERIC(10,2) DEFAULT 0,
  cost_per_impression NUMERIC(10,2) DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'paused', 'completed', 'rejected', 'cancelled')),
  starts_at TIMESTAMPTZ NOT NULL,
  ends_at TIMESTAMPTZ NOT NULL,
  impressions INT DEFAULT 0,
  clicks INT DEFAULT 0,
  target_impressions INT DEFAULT 0,
  target_clicks INT DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 9. Banners
CREATE TABLE IF NOT EXISTS public.banners (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  image TEXT NOT NULL DEFAULT '',
  link_url TEXT DEFAULT '',
  position TEXT NOT NULL CHECK (position IN ('home', 'categories', 'store', 'promo_detail', 'dashboard', 'mobile')),
  store_id UUID REFERENCES public.stores(id) ON DELETE SET NULL,
  campaign_id UUID REFERENCES public.sponsored_campaigns(id) ON DELETE SET NULL,
  is_active BOOLEAN DEFAULT TRUE,
  starts_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  ends_at TIMESTAMPTZ,
  clicks INT DEFAULT 0,
  impressions INT DEFAULT 0,
  display_order INT DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 10. Reviews
CREATE TABLE IF NOT EXISTS public.reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  store_id UUID REFERENCES public.stores(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT DEFAULT '',
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'hidden', 'rejected')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(store_id, user_id)
);

-- 11. Reports (signalements)
CREATE TABLE IF NOT EXISTS public.reports (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  reporter_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  target_type TEXT NOT NULL CHECK (target_type IN ('promotion', 'store', 'review', 'user')),
  target_id UUID NOT NULL,
  reason TEXT NOT NULL CHECK (reason IN ('fake_promo', 'misleading_price', 'fake_store', 'inappropriate_image', 'abusive_content', 'fraud', 'unavailable_product', 'other')),
  description TEXT DEFAULT '',
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'investigating', 'resolved', 'dismissed')),
  handled_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  resolution_notes TEXT DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 12. Notifications
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('system', 'promotion', 'store', 'payment', 'campaign', 'report', 'support', 'marketing')),
  title TEXT NOT NULL,
  body TEXT DEFAULT '',
  channel TEXT NOT NULL DEFAULT 'internal' CHECK (channel IN ('internal', 'email', 'whatsapp', 'sms', 'push')),
  target_audience TEXT DEFAULT 'all' CHECK (target_audience IN ('all', 'vendors', 'clients', 'district', 'category', 'user')),
  target_value TEXT DEFAULT '',
  is_read BOOLEAN DEFAULT FALSE,
  link_url TEXT DEFAULT '',
  sent_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 13. CMS Pages
CREATE TABLE IF NOT EXISTS public.cms_pages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  content TEXT DEFAULT '',
  meta_title TEXT DEFAULT '',
  meta_description TEXT DEFAULT '',
  image TEXT DEFAULT '',
  is_published BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 14. Activity logs
CREATE TABLE IF NOT EXISTS public.activity_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id TEXT DEFAULT '',
  details JSONB DEFAULT '{}',
  ip_address TEXT DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 15. Support tickets
CREATE TABLE IF NOT EXISTS public.support_tickets (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'waiting', 'resolved', 'closed')),
  priority TEXT NOT NULL DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
  assigned_to UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  category TEXT DEFAULT 'general' CHECK (category IN ('general', 'technical', 'billing', 'store', 'promotion', 'account')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.ticket_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  ticket_id UUID REFERENCES public.support_tickets(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 16. Platform settings
CREATE TABLE IF NOT EXISTS public.platform_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  key TEXT NOT NULL UNIQUE,
  value JSONB NOT NULL DEFAULT '{}',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 17. Store documents
CREATE TABLE IF NOT EXISTS public.store_documents (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  store_id UUID REFERENCES public.stores(id) ON DELETE CASCADE NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('rccm', 'niu', 'id_card', 'commercial_permit', 'address_proof', 'other')),
  file_url TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'needs_correction')),
  rejection_reason TEXT DEFAULT '',
  uploaded_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Insert default districts (Brazzaville)
INSERT INTO public.districts (name, slug, display_order) VALUES
  ('Makélékélé', 'makelekele', 1),
  ('Bacongo', 'bacongo', 2),
  ('Poto-Poto', 'poto-poto', 3),
  ('Moungali', 'moungali', 4),
  ('Ouenzé', 'ouenze', 5),
  ('Talangaï', 'talangai', 6),
  ('Mfilou', 'mfilou', 7),
  ('Madibou', 'madibou', 8),
  ('Djiri', 'djiri', 9)
ON CONFLICT (slug) DO NOTHING;

-- Insert default subscription plans
INSERT INTO public.subscription_plans (name, slug, description, price, max_promotions, duration_days, features) VALUES
  ('Gratuit', 'free', 'Pour démarrer', 0, 3, 365, '["3 promotions par an", "Profil boutique de base", "Support standard"]'),
  ('Standard', 'standard', 'Pour les commerçants actifs', 15000, 50, 30, '["50 promotions par mois", "Statistiques détaillées", "Badge vérifié", "Support prioritaire"]'),
  ('Premium', 'premium', 'Pour maximiser votre visibilité', 30000, 200, 30, '["200 promotions par mois", "Statistiques avancées", "Badge Premium", "Mise en avant", "Support VIP", "Campagnes sponsorisées"]'),
  ('Entreprise', 'entreprise', 'Solution complète pour les grandes enseignes', 75000, -1, 30, '["Promotions illimitées", "Toutes les fonctionnalités", "API dédiée", "Comptes multiples", "Gestionnaire dédié", "Rapports personnalisés"]')
ON CONFLICT (slug) DO NOTHING;

-- Insert default platform settings
INSERT INTO public.platform_settings (key, value) VALUES
  ('general', '{"platform_name": "Congo Soldes", "slogan": "Toutes les promotions au même endroit", "currency": "XAF", "country": "Congo", "main_city": "Brazzaville", "logo": "/assets/logo.png"}'),
  ('fees', '{"service_fee_percent": 5, "commission_rate": 0}'),
  ('moderation', '{"auto_approve_stores": false, "auto_approve_promos": false, "default_promo_expiry_days": 30}')
ON CONFLICT (key) DO NOTHING;

-- Insert default CMS pages
INSERT INTO public.cms_pages (slug, title, content) VALUES
  ('a-propos', 'À propos', '<p>Bienvenue sur Congo Soldes, la plateforme référence des promotions au Congo.</p>'),
  ('faq', 'FAQ', '<p>Questions fréquemment posées.</p>'),
  ('devenir-commercant', 'Devenir commerçant', '<p>Inscrivez votre boutique et commencez à vendre.</p>')
ON CONFLICT (slug) DO NOTHING;

-- Insert default categories
INSERT INTO public.categories (name, slug, display_order) VALUES
  ('Mode', 'mode', 1),
  ('Alimentation', 'alimentation', 2),
  ('Téléphones', 'telephones', 3),
  ('Électroménager', 'electromenager', 4),
  ('Beauté', 'beaute', 5),
  ('Restaurants', 'restaurants', 6),
  ('Pharmacies', 'pharmacies', 7),
  ('Services', 'services', 8),
  ('Immobilier', 'immobilier', 9),
  ('Automobile', 'automobile', 10),
  ('Informatique', 'informatique', 11),
  ('Sport', 'sport', 12),
  ('Chaussures', 'chaussures', 13),
  ('Mobilier', 'mobilier', 14),
  ('Supermarchés', 'supermarches', 15)
ON CONFLICT (slug) DO NOTHING;

-- RLS Policies for admin access
-- Helper function to check if user is admin/super_admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid()
    AND role IN ('super_admin', 'admin', 'moderator')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.is_super_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid()
    AND role = 'super_admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Enable RLS on all new tables
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subcategories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.districts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.neighborhoods ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscription_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sponsored_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.banners ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cms_pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.support_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ticket_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.platform_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.store_documents ENABLE ROW LEVEL SECURITY;

-- Admin can read/write all categories
CREATE POLICY "Admins can manage categories" ON public.categories
  FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "Public can read active categories" ON public.categories
  FOR SELECT USING (is_active = TRUE);

CREATE POLICY "Admins can manage subcategories" ON public.subcategories
  FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE POLICY "Admins can manage districts" ON public.districts
  FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE POLICY "Admins can manage neighborhoods" ON public.neighborhoods
  FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE POLICY "Admins can manage subscription plans" ON public.subscription_plans
  FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE POLICY "Users can view own subscription" ON public.subscriptions
  FOR SELECT USING (auth.uid() = user_id OR public.is_admin());
CREATE POLICY "Admins can manage subscriptions" ON public.subscriptions
  FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE POLICY "Admins can view all payments" ON public.payments
  FOR SELECT USING (public.is_admin());
CREATE POLICY "Users can view own payments" ON public.payments
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins can manage payments" ON public.payments
  FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE POLICY "Admins can manage campaigns" ON public.sponsored_campaigns
  FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "Users can view own campaigns" ON public.sponsored_campaigns
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage banners" ON public.banners
  FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "Public can view active banners" ON public.banners
  FOR SELECT USING (is_active = TRUE);

CREATE POLICY "Admins can manage reviews" ON public.reviews
  FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE POLICY "Admins can manage reports" ON public.reports
  FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE POLICY "Admins can manage notifications" ON public.notifications
  FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "Users can view own notifications" ON public.notifications
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage CMS pages" ON public.cms_pages
  FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "Public can view published CMS pages" ON public.cms_pages
  FOR SELECT USING (is_published = TRUE);

CREATE POLICY "Admins can view activity logs" ON public.activity_logs
  FOR SELECT USING (public.is_admin());

CREATE POLICY "Admins can manage support tickets" ON public.support_tickets
  FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "Users can view own tickets" ON public.support_tickets
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create tickets" ON public.support_tickets
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can manage ticket messages" ON public.ticket_messages
  FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE POLICY "Admins can manage platform settings" ON public.platform_settings
  FOR ALL USING (public.is_super_admin()) WITH CHECK (public.is_super_admin());

CREATE POLICY "Admins can manage store documents" ON public.store_documents
  FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "Users can view own store documents" ON public.store_documents
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.stores WHERE stores.id = store_documents.store_id AND stores.user_id = auth.uid())
  );

-- Update existing stores RLS to allow admin access
DROP POLICY IF EXISTS "Users can view own store" ON public.stores;
CREATE POLICY "Users can view own store" ON public.stores
  FOR SELECT USING (auth.uid() = user_id OR public.is_admin());

DROP POLICY IF EXISTS "Users can update own store" ON public.stores;
CREATE POLICY "Users can update own store" ON public.stores
  FOR UPDATE USING (auth.uid() = user_id OR public.is_admin());

DROP POLICY IF EXISTS "Users can delete own store" ON public.stores;
DELETE FROM public.stores WHERE FALSE;
-- Note: stores has no delete policy, super_admin can delete

-- Update existing promotions RLS to allow admin access
DROP POLICY IF EXISTS "Users can view own promotions" ON public.promotions;
CREATE POLICY "Users can view own promotions" ON public.promotions
  FOR SELECT USING (auth.uid() = user_id OR public.is_admin());

DROP POLICY IF EXISTS "Users can update own promotions" ON public.promotions;
CREATE POLICY "Users can update own promotions" ON public.promotions
  FOR UPDATE USING (auth.uid() = user_id OR public.is_admin());

DROP POLICY IF EXISTS "Users can delete own promotions" ON public.promotions;
CREATE POLICY "Users can delete own promotions" ON public.promotions
  FOR DELETE USING (auth.uid() = user_id OR public.is_admin());

-- Update profiles RLS to allow admin access
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id OR public.is_admin());

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id OR public.is_admin());

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_reports_status ON public.reports(status);
CREATE INDEX IF NOT EXISTS idx_reports_target ON public.reports(target_type, target_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON public.notifications(user_id, is_read);
CREATE INDEX IF NOT EXISTS idx_activity_logs_user ON public.activity_logs(user_id, created_at);
CREATE INDEX IF NOT EXISTS idx_activity_logs_action ON public.activity_logs(action, created_at);
CREATE INDEX IF NOT EXISTS idx_support_tickets_status ON public.support_tickets(status);
CREATE INDEX IF NOT EXISTS idx_subscriptions_user ON public.subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_payments_user ON public.payments(user_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON public.payments(status);
CREATE INDEX IF NOT EXISTS idx_store_documents_store ON public.store_documents(store_id);
CREATE INDEX IF NOT EXISTS idx_reviews_store ON public.reviews(store_id);
CREATE INDEX IF NOT EXISTS idx_campaigns_user ON public.sponsored_campaigns(user_id);
CREATE INDEX IF NOT EXISTS idx_campaigns_status ON public.sponsored_campaigns(status);
CREATE INDEX IF NOT EXISTS idx_subcategories_category ON public.subcategories(category_id);
CREATE INDEX IF NOT EXISTS idx_neighborhoods_district ON public.neighborhoods(district_id);
