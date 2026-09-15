
CREATE OR REPLACE FUNCTION public.course_teaser(_slug text)
RETURNS jsonb LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = public AS $$
DECLARE
  c public.courses;
  flat text;
  intro text;
  p integer;
  lines text[];
  outcomes jsonb;
BEGIN
  SELECT * INTO c FROM public.courses WHERE slug = _slug AND is_published;
  IF NOT FOUND THEN RETURN NULL; END IF;

  flat := btrim(regexp_replace(coalesce(c.overview, ''), '\s+', ' ', 'g'));
  IF length(flat) <= 340 THEN
    intro := flat;
  ELSE
    intro := left(flat, 340);
    p := strpos(reverse(intro), ' .');
    IF p > 0 AND length(intro) - p >= 120 THEN
      intro := left(intro, length(intro) - p);
    ELSE
      intro := rtrim(left(flat, 300), ' .,;:') || '…';
    END IF;
  END IF;

  lines := ARRAY(
    SELECT btrim(t.line)
    FROM unnest(string_to_array(coalesce(c.learning_objectives, ''), E'\n')) WITH ORDINALITY AS t(line, ord)
    WHERE btrim(t.line) <> ''
    ORDER BY t.ord
  );
  IF array_length(lines, 1) IS NOT NULL AND array_length(lines, 1) < 2 THEN
    lines := ARRAY(
      SELECT btrim(part)
      FROM unnest(regexp_split_to_array(lines[1], '(?<=\.)\s+')) AS part
      WHERE length(btrim(part)) > 25
    );
  END IF;
  outcomes := coalesce((SELECT jsonb_agg(v) FROM (SELECT unnest(lines) v LIMIT 4) s), '[]'::jsonb);

  RETURN jsonb_build_object(
    'id', c.id, 'slug', c.slug, 'title', c.title, 'summary', c.summary, 'school', c.school,
    'cover_image_url', c.cover_image_url,
    'intro', nullif(intro, ''),
    'outcomes', outcomes,
    'lesson_count', (SELECT count(*) FROM public.lessons l WHERE l.course_id = c.id),
    'total_seconds', (SELECT coalesce(sum(greatest(coalesce(l.end_seconds,0) - coalesce(l.start_seconds,0), 0)), 0)
                      FROM public.lessons l WHERE l.course_id = c.id),
    'rubric_count', jsonb_array_length(coalesce(c.rubric, '[]'::jsonb)),
    'outline', coalesce((
      SELECT jsonb_agg(jsonb_build_object(
               'position', l.position,
               'title', CASE WHEN l.is_free_preview THEN l.title ELSE NULL END,
               'free_preview', l.is_free_preview) ORDER BY l.position)
      FROM public.lessons l WHERE l.course_id = c.id), '[]'::jsonb)
  );
END $$;
