-- =============================================================
-- TRUNCATE ALL DATA: Congo Soldes
-- Execute in Supabase SQL Editor (requires service_role or superuser)
-- =============================================================

-- Disable RLS temporarily for cleanup
ALTER TABLE public.promo_clicks DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.promotions DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.stores DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;

-- Truncate in correct order (respecting FK constraints)
TRUNCATE TABLE public.promo_clicks CASCADE;
TRUNCATE TABLE public.promotions CASCADE;
TRUNCATE TABLE public.stores CASCADE;
TRUNCATE TABLE public.profiles CASCADE;

-- Re-enable RLS
ALTER TABLE public.promo_clicks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.promotions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Also clear auth users (optional - requires service_role)
-- DELETE FROM auth.users WHERE email = 'admin@congosoldes.cg';

-- Verify cleanup
SELECT 'promo_clicks' as table_name, count(*) as rows FROM public.promo_clicks
UNION ALL SELECT 'promotions', count(*) FROM public.promotions
UNION ALL SELECT 'stores', count(*) FROM public.stores
UNION ALL SELECT 'profiles', count(*) FROM public.profiles;