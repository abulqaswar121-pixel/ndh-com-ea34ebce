ALTER TABLE public.case_studies ADD COLUMN IF NOT EXISTS category text, ADD COLUMN IF NOT EXISTS live_url text;
ALTER TABLE public.testimonials ADD COLUMN IF NOT EXISTS badge text;