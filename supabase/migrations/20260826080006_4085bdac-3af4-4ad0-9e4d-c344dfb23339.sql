REVOKE ALL ON FUNCTION public.can_review_submissions() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.can_review_submissions() TO authenticated, service_role;