ALTER TABLE public.promo_clicks ADD COLUMN IF NOT EXISTS delivery_option TEXT DEFAULT '';
ALTER TABLE public.promo_clicks ADD COLUMN IF NOT EXISTS delivery_city TEXT DEFAULT '';
ALTER TABLE public.promo_clicks ADD COLUMN IF NOT EXISTS delivery_district TEXT DEFAULT '';
ALTER TABLE public.promo_clicks ADD COLUMN IF NOT EXISTS delivery_neighborhood TEXT DEFAULT '';
ALTER TABLE public.promo_clicks ADD COLUMN IF NOT EXISTS delivery_address TEXT DEFAULT '';
ALTER TABLE public.promo_clicks ADD COLUMN IF NOT EXISTS delivery_instructions TEXT DEFAULT '';
