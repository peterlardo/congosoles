ALTER TABLE public.promo_clicks ADD COLUMN IF NOT EXISTS amount NUMERIC(10,2);
ALTER TABLE public.promo_clicks ADD COLUMN IF NOT EXISTS payment_method TEXT;
ALTER TABLE public.promo_clicks ADD COLUMN IF NOT EXISTS phone TEXT;
ALTER TABLE public.promo_clicks ADD COLUMN IF NOT EXISTS buyer_name TEXT;
ALTER TABLE public.promo_clicks ADD COLUMN IF NOT EXISTS buyer_email TEXT;
ALTER TABLE public.promo_clicks ADD COLUMN IF NOT EXISTS click_type TEXT NOT NULL DEFAULT 'click' CHECK (click_type IN ('click', 'view', 'purchase'));
