REVOKE ALL ON FUNCTION public.validate_invite_token(text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.validate_invite_token(text) TO authenticated, service_role;