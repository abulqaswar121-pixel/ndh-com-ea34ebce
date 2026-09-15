
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
      SELECT CASE
        WHEN length(flat) <= 340 THEN flat
        ELSE rtrim(left(flat, coalesce(nullif(strpos(right(left(flat, 340), 140), '. '), 0) + 200, 337)), ' ') ||
             CASE WHEN right(rtrim(left(flat, 340)), 1) = '.' THEN '' ELSE '…' END
      END
      FROM (SELECT btrim(regexp_replace(coalesce(c.overview,''), '\s+', ' ', 'g')) AS flat) f
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
