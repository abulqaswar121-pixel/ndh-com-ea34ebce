CREATE OR REPLACE FUNCTION public.verify_certificate(_code text)
RETURNS jsonb
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT jsonb_build_object(
    'certificate_number', c.certificate_number,
    'student_name', p.full_name,
    'course_title', co.title,
    'issue_date', c.issue_date
  )
  FROM public.certificates c
  JOIN public.profiles p ON p.id = c.student_id
  JOIN public.courses co ON co.id = c.course_id
  WHERE c.certificate_number = _code
  LIMIT 1;
$$;

GRANT EXECUTE ON FUNCTION public.verify_certificate(text) TO anon;
GRANT EXECUTE ON FUNCTION public.verify_certificate(text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.verify_certificate(text) TO service_role;