-- Add payment_methods column to promotions
ALTER TABLE public.promotions ADD COLUMN IF NOT EXISTS payment_methods JSONB DEFAULT '["mtn","airtel"]'::jsonb;
