
-- ========== 1. Column-level paywall on courses ==========
REVOKE SELECT ON public.courses FROM anon, authenticated;
GRANT SELECT (id, slug, title, summary, school, cover_image_url, price_amount, currency, is_published, created_at, updated_at, source_video_id)
  ON public.courses TO anon, authenticated;
GRANT ALL ON public.courses TO service_role;

-- ========== 2. Helper: has the student completed the course? ==========
CREATE OR REPLACE FUNCTION public.has_completed_course(_course_id uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.certificates c WHERE c.course_id = _course_id AND c.student_id = auth.uid())
      OR (
        EXISTS (SELECT 1 FROM public.enrollments e
                WHERE e.course_id = _course_id AND e.student_id = auth.uid() AND e.status IN ('active','completed'))
        AND EXISTS (SELECT 1 FROM public.lessons l WHERE l.course_id = _course_id AND l.is_required)
        AND NOT EXISTS (
          SELECT 1 FROM public.lessons l
          WHERE l.course_id = _course_id AND l.is_required
            AND NOT EXISTS (SELECT 1 FROM public.lesson_progress p
                            WHERE p.lesson_id = l.id AND p.student_id = auth.uid())
        )
      )
$$;

-- ========== 3. Teaser / full-content readers ==========
DROP FUNCTION IF EXISTS public.course_outline(text);

CREATE OR REPLACE FUNCTION public.course_outline(_slug text)
RETURNS TABLE(lesson_position integer, lesson_title text, free_preview boolean)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT l.position,
         CASE WHEN l.is_free_preview OR public.is_enrolled(c.id) OR public.is_admin()
              THEN l.title ELSE 'Unlocks when you enrol' END,
         l.is_free_preview
  FROM public.lessons l
  JOIN public.courses c ON c.id = l.course_id
  WHERE c.slug = _slug AND c.is_published
  ORDER BY l.position
$$;

CREATE OR REPLACE FUNCTION public.course_teaser(_slug text)
RETURNS jsonb LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT jsonb_build_object(
    'id', c.id,
    'slug', c.slug,
    'title', c.title,
    'summary', c.summary,
    'school', c.school,
    'cover_image_url', c.cover_image_url,
    'intro', (
      SELECT string_agg(line, E'\n')
      FROM (SELECT t.line FROM unnest(string_to_array(coalesce(c.overview,''), E'\n')) WITH ORDINALITY AS t(line, ord)
            WHERE btrim(t.line) <> '' ORDER BY t.ord LIMIT 2) s(line)
    ),
    'outcomes', coalesce((
      SELECT jsonb_agg(btrim(line) ORDER BY ord)
      FROM (SELECT t.line, t.ord FROM unnest(string_to_array(coalesce(c.learning_objectives,''), E'\n')) WITH ORDINALITY AS t(line, ord)
            WHERE btrim(t.line) <> '' ORDER BY t.ord LIMIT 4) s(line, ord)
    ), '[]'::jsonb),
    'lesson_count', (SELECT count(*) FROM public.lessons l WHERE l.course_id = c.id),
    'total_seconds', (SELECT coalesce(sum(greatest(coalesce(l.end_seconds,0) - coalesce(l.start_seconds,0), 0)), 0)
                      FROM public.lessons l WHERE l.course_id = c.id),
    'rubric_count', jsonb_array_length(coalesce(c.rubric, '[]'::jsonb)),
    'outline', coalesce((
      SELECT jsonb_agg(jsonb_build_object(
               'position', l.position,
               'title', CASE WHEN l.is_free_preview THEN l.title ELSE NULL END,
               'free_preview', l.is_free_preview) ORDER BY l.position)
      FROM public.lessons l WHERE l.course_id = c.id
    ), '[]'::jsonb)
  )
  FROM public.courses c
  WHERE c.slug = _slug AND c.is_published
$$;

CREATE OR REPLACE FUNCTION public.course_content(_slug text)
RETURNS jsonb LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT jsonb_build_object(
    'id', c.id, 'slug', c.slug, 'title', c.title, 'summary', c.summary, 'school', c.school,
    'overview', c.overview, 'learning_objectives', c.learning_objectives,
    'preparation', c.preparation, 'checklist', c.checklist, 'common_mistakes', c.common_mistakes,
    'project_brief', c.project_brief, 'project_theme', c.project_theme,
    'rubric', coalesce(c.rubric, '[]'::jsonb)
  )
  FROM public.courses c
  WHERE c.slug = _slug AND c.is_published AND (public.is_enrolled(c.id) OR public.is_admin())
$$;

CREATE OR REPLACE FUNCTION public.admin_courses()
RETURNS SETOF jsonb LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT to_jsonb(c) FROM public.courses c WHERE public.is_admin() ORDER BY c.title
$$;

CREATE OR REPLACE FUNCTION public.admin_update_course(_id uuid, _payload jsonb)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE row public.courses;
BEGIN
  IF NOT public.is_admin() THEN RAISE EXCEPTION 'Forbidden'; END IF;
  UPDATE public.courses c SET
    title = coalesce(_payload->>'title', c.title),
    summary = coalesce(_payload->>'summary', c.summary),
    overview = coalesce(_payload->>'overview', c.overview),
    learning_objectives = coalesce(_payload->>'learning_objectives', c.learning_objectives),
    preparation = coalesce(_payload->>'preparation', c.preparation),
    checklist = coalesce(_payload->>'checklist', c.checklist),
    common_mistakes = coalesce(_payload->>'common_mistakes', c.common_mistakes),
    project_brief = coalesce(_payload->>'project_brief', c.project_brief),
    is_published = coalesce((_payload->>'is_published')::boolean, c.is_published)
  WHERE c.id = _id RETURNING c.* INTO row;
  RETURN to_jsonb(row);
END $$;

REVOKE ALL ON FUNCTION public.course_content(text) FROM anon;
REVOKE ALL ON FUNCTION public.admin_courses() FROM anon;
REVOKE ALL ON FUNCTION public.admin_update_course(uuid, jsonb) FROM anon;

-- ========== 4. Course ratings ==========
CREATE TABLE public.course_ratings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid NOT NULL DEFAULT auth.uid(),
  course_id uuid NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  stars smallint NOT NULL CHECK (stars BETWEEN 1 AND 5),
  review text,
  is_hidden boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (student_id, course_id)
);
GRANT SELECT, INSERT, UPDATE ON public.course_ratings TO authenticated;
GRANT ALL ON public.course_ratings TO service_role;
ALTER TABLE public.course_ratings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "ratings own read" ON public.course_ratings FOR SELECT TO authenticated
  USING (student_id = auth.uid() OR public.is_admin());
CREATE POLICY "ratings own insert" ON public.course_ratings FOR INSERT TO authenticated
  WITH CHECK (student_id = auth.uid() AND public.has_completed_course(course_id));
CREATE POLICY "ratings own update" ON public.course_ratings FOR UPDATE TO authenticated
  USING (student_id = auth.uid() OR public.is_admin())
  WITH CHECK (student_id = auth.uid() OR public.is_admin());
CREATE TRIGGER course_ratings_updated BEFORE UPDATE ON public.course_ratings
  FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();

CREATE OR REPLACE FUNCTION public.course_rating_stats(_course_id uuid)
RETURNS jsonb LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT jsonb_build_object(
    'count', count(*),
    'average', round(coalesce(avg(stars), 0)::numeric, 2),
    'distribution', jsonb_build_object(
      '5', count(*) FILTER (WHERE stars = 5), '4', count(*) FILTER (WHERE stars = 4),
      '3', count(*) FILTER (WHERE stars = 3), '2', count(*) FILTER (WHERE stars = 2),
      '1', count(*) FILTER (WHERE stars = 1))
  )
  FROM public.course_ratings r WHERE r.course_id = _course_id AND NOT r.is_hidden
$$;

-- ========== 5. Student testimonials ==========
CREATE TABLE public.student_testimonials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid NOT NULL DEFAULT auth.uid(),
  course_id uuid REFERENCES public.courses(id) ON DELETE SET NULL,
  display_name text NOT NULL,
  role_label text,
  quote text NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  is_featured boolean NOT NULL DEFAULT false,
  consent boolean NOT NULL DEFAULT false,
  reviewer_note text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT student_testimonials_status_check CHECK (status IN ('pending','approved','rejected'))
);
GRANT SELECT, INSERT, UPDATE ON public.student_testimonials TO authenticated;
GRANT ALL ON public.student_testimonials TO service_role;
ALTER TABLE public.student_testimonials ENABLE ROW LEVEL SECURITY;
CREATE POLICY "testimonial own read" ON public.student_testimonials FOR SELECT TO authenticated
  USING (student_id = auth.uid() OR public.is_admin());
CREATE POLICY "testimonial own insert" ON public.student_testimonials FOR INSERT TO authenticated
  WITH CHECK (student_id = auth.uid() AND consent AND status = 'pending' AND public.has_completed_course(course_id));
CREATE POLICY "testimonial admin update" ON public.student_testimonials FOR UPDATE TO authenticated
  USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE TRIGGER student_testimonials_updated BEFORE UPDATE ON public.student_testimonials
  FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();

CREATE OR REPLACE FUNCTION public.public_student_testimonials(_limit integer DEFAULT 12, _course_id uuid DEFAULT NULL)
RETURNS jsonb LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT coalesce(jsonb_agg(t), '[]'::jsonb) FROM (
    SELECT s.id, s.display_name, s.role_label, s.quote, s.is_featured, c.title AS course_title
    FROM public.student_testimonials s
    LEFT JOIN public.courses c ON c.id = s.course_id
    WHERE s.status = 'approved' AND (_course_id IS NULL OR s.course_id = _course_id)
    ORDER BY s.is_featured DESC, s.created_at DESC
    LIMIT greatest(coalesce(_limit, 12), 1)
  ) t
$$;

-- ========== 6. Readiness quizzes ==========
CREATE TABLE public.quiz_attempts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid NOT NULL DEFAULT auth.uid(),
  course_id uuid NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  questions jsonb NOT NULL DEFAULT '[]'::jsonb,
  answer_key jsonb NOT NULL DEFAULT '[]'::jsonb,
  answers jsonb NOT NULL DEFAULT '{}'::jsonb,
  feedback jsonb NOT NULL DEFAULT '[]'::jsonb,
  score numeric,
  passed boolean,
  created_at timestamptz NOT NULL DEFAULT now(),
  submitted_at timestamptz
);
GRANT SELECT (id, student_id, course_id, questions, answers, feedback, score, passed, created_at, submitted_at)
  ON public.quiz_attempts TO authenticated;
GRANT ALL ON public.quiz_attempts TO service_role;
ALTER TABLE public.quiz_attempts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "quiz own read" ON public.quiz_attempts FOR SELECT TO authenticated
  USING (student_id = auth.uid() OR public.is_admin());
