ALTER TABLE public.testimonials
ADD COLUMN IF NOT EXISTS service_area text;

ALTER TABLE public.testimonials
DROP CONSTRAINT IF EXISTS testimonials_service_area_check;

ALTER TABLE public.testimonials
ADD CONSTRAINT testimonials_service_area_check CHECK (
  service_area IS NULL OR service_area IN (
    'Brand & Identity',
    'Design & Product',
    'Development',
    'Content & Writing',
    'Marketing & Growth',
    'Video & Media',
    'Data & Business',
    'AI & Automation'
  )
);

UPDATE public.testimonials
SET service_area = CASE
  WHEN company ILIKE '%Apex Agri-Capital%' THEN 'Development'
  WHEN company ILIKE '%Miftah al-Arabiyyah%' THEN 'Content & Writing'
  WHEN company ILIKE '%Markazussalaf%' THEN 'Data & Business'
  ELSE service_area
END
WHERE service_area IS NULL;