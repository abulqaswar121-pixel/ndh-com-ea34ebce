DROP POLICY IF EXISTS "courses read published" ON public.courses;
CREATE POLICY "courses read published" ON public.courses FOR SELECT TO anon, authenticated USING (is_published);

DROP POLICY IF EXISTS "posts read published" ON public.posts;
CREATE POLICY "posts read published" ON public.posts FOR SELECT TO anon, authenticated USING (is_published);

DROP POLICY IF EXISTS "case studies read published" ON public.case_studies;
CREATE POLICY "case studies read published" ON public.case_studies FOR SELECT TO anon, authenticated USING (is_published);

DROP POLICY IF EXISTS "testimonials read published" ON public.testimonials;
CREATE POLICY "testimonials read published" ON public.testimonials FOR SELECT TO anon, authenticated USING (is_published);

REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM anon;
REVOKE EXECUTE ON FUNCTION public.is_admin() FROM anon;
REVOKE EXECUTE ON FUNCTION public.course_outline(text) FROM anon;