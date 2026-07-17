ALTER TABLE public.stores ADD COLUMN IF NOT EXISTS banner_url TEXT NOT NULL DEFAULT '';
UPDATE public.stores SET banner_url = image WHERE image IS NOT NULL AND image != '';
