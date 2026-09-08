CREATE OR REPLACE FUNCTION public.course_outline(_slug text)
RETURNS TABLE(lesson_position integer, lesson_title text, free_preview boolean)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT l.position AS lesson_position, l.title AS lesson_title, l.is_free_preview AS free_preview
  FROM public.lessons l
  JOIN public.courses c ON c.id = l.course_id
  WHERE c.slug = _slug AND c.is_published = true
  ORDER BY l.position
$$;

GRANT EXECUTE ON FUNCTION public.course_outline(text) TO anon, authenticated, service_role;