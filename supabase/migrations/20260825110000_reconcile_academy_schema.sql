-- Stage 4 checkpoint 1: the final reset migration's public courses/lessons/enrollments
-- model is authoritative. The earlier academy_* model is not used by the app and is
-- removed by the final schema reset; this migration extends the authoritative model.
ALTER TABLE public.courses ADD COLUMN IF NOT EXISTS learning_objectives text NOT NULL DEFAULT '', ADD COLUMN IF NOT EXISTS project_theme text NOT NULL DEFAULT '', ADD COLUMN IF NOT EXISTS cover_image_url text, ADD COLUMN IF NOT EXISTS school text;
ALTER TABLE public.lessons ADD COLUMN IF NOT EXISTS notes text;
CREATE TABLE IF NOT EXISTS public.course_pricing (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id uuid NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  region text NOT NULL CHECK (region IN ('NG','AF','GLOBAL')),
  currency text NOT NULL,
  amount numeric(12,2) NOT NULL CHECK (amount >= 0),
  UNIQUE(course_id, region)
);
GRANT SELECT ON public.course_pricing TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.course_pricing TO authenticated;
GRANT ALL ON public.course_pricing TO service_role;
ALTER TABLE public.course_pricing ENABLE ROW LEVEL SECURITY;
CREATE POLICY "published course pricing read" ON public.course_pricing FOR SELECT USING (EXISTS (SELECT 1 FROM public.courses c WHERE c.id=course_id AND c.is_published=true) OR public.is_admin());
CREATE POLICY "admin course pricing manage" ON public.course_pricing FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE INDEX IF NOT EXISTS course_pricing_course_idx ON public.course_pricing(course_id);
