REVOKE EXECUTE ON FUNCTION public.course_outline(text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.course_outline(text) TO authenticated, service_role;