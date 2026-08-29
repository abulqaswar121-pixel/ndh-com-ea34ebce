-- Public catalog access
DROP POLICY IF EXISTS "courses read published" ON public.courses;
CREATE POLICY "courses read published" ON public.courses FOR SELECT TO anon, authenticated
USING (is_published OR public.is_admin());
GRANT SELECT ON public.courses TO anon;
GRANT SELECT ON public.course_pricing TO anon;

-- Lesson outline for the public course page (titles only, no video URLs)
CREATE OR REPLACE FUNCTION public.course_outline(_slug text)
RETURNS TABLE (lesson_position integer, lesson_title text, free_preview boolean)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT l.position, l.title, l.is_free_preview
  FROM public.lessons l
  JOIN public.courses c ON c.id = l.course_id
  WHERE c.slug = _slug AND c.is_published
  ORDER BY l.position
$$;
GRANT EXECUTE ON FUNCTION public.course_outline(text) TO anon, authenticated;

-- Testimonials
CREATE TABLE public.testimonials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  author_name text NOT NULL,
  author_role text,
  company text,
  quote text NOT NULL,
  avatar_url text,
  is_published boolean NOT NULL DEFAULT false,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.testimonials TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.testimonials TO authenticated;
GRANT ALL ON public.testimonials TO service_role;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
CREATE POLICY "testimonials read published" ON public.testimonials FOR SELECT TO anon, authenticated
USING (is_published OR public.is_admin());
CREATE POLICY "testimonials admin manage" ON public.testimonials FOR ALL TO authenticated
USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE TRIGGER testimonials_updated BEFORE UPDATE ON public.testimonials
FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();

-- Case studies
CREATE TABLE public.case_studies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  title text NOT NULL,
  client_name text,
  summary text,
  challenge text,
  approach text,
  result text,
  cover_image_url text,
  is_published boolean NOT NULL DEFAULT false,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.case_studies TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.case_studies TO authenticated;
GRANT ALL ON public.case_studies TO service_role;
ALTER TABLE public.case_studies ENABLE ROW LEVEL SECURITY;
CREATE POLICY "case studies read published" ON public.case_studies FOR SELECT TO anon, authenticated
USING (is_published OR public.is_admin());
CREATE POLICY "case studies admin manage" ON public.case_studies FOR ALL TO authenticated
USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE TRIGGER case_studies_updated BEFORE UPDATE ON public.case_studies
FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();

-- Blog posts
CREATE TABLE public.posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  title text NOT NULL,
  excerpt text,
  body text,
  cover_image_url text,
  author_name text,
  is_published boolean NOT NULL DEFAULT false,
  published_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.posts TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.posts TO authenticated;
GRANT ALL ON public.posts TO service_role;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "posts read published" ON public.posts FOR SELECT TO anon, authenticated
USING (is_published OR public.is_admin());
CREATE POLICY "posts admin manage" ON public.posts FOR ALL TO authenticated
USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE TRIGGER posts_updated BEFORE UPDATE ON public.posts
FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();

-- Enquiries (contact form)
CREATE TABLE public.enquiries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL,
  email text NOT NULL,
  phone text,
  subject text,
  message text NOT NULL,
  source text NOT NULL DEFAULT 'contact',
  status text NOT NULL DEFAULT 'new',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT INSERT ON public.enquiries TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.enquiries TO authenticated;
GRANT ALL ON public.enquiries TO service_role;
ALTER TABLE public.enquiries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "enquiries anyone can submit" ON public.enquiries FOR INSERT TO anon, authenticated
WITH CHECK (true);
CREATE POLICY "enquiries admin read" ON public.enquiries FOR SELECT TO authenticated
USING (public.is_admin());
CREATE POLICY "enquiries admin manage" ON public.enquiries FOR UPDATE TO authenticated
USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "enquiries admin delete" ON public.enquiries FOR DELETE TO authenticated
USING (public.is_admin());
CREATE TRIGGER enquiries_updated BEFORE UPDATE ON public.enquiries
FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();