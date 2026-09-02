REVOKE ALL ON FUNCTION public.course_outline(text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.course_outline(text) TO anon, authenticated, service_role;