-- Stage 5 academy flow
CREATE TABLE IF NOT EXISTS public.lesson_progress (student_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE, lesson_id uuid NOT NULL REFERENCES public.lessons(id) ON DELETE CASCADE, completed_at timestamptz NOT NULL DEFAULT now(), PRIMARY KEY(student_id, lesson_id));
CREATE TABLE IF NOT EXISTS public.exam_attempts (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), student_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE, course_id uuid NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE, questions jsonb NOT NULL DEFAULT '[]'::jsonb, answers jsonb NOT NULL DEFAULT '{}'::jsonb, score numeric, passed boolean, started_at timestamptz NOT NULL DEFAULT now(), submitted_at timestamptz);
CREATE TABLE IF NOT EXISTS public.student_projects (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), student_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE, course_id uuid NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE, brief text NOT NULL, submission_url text, submission_text text, submission_file_path text, ai_verdict text, ai_feedback text, status text NOT NULL DEFAULT 'submitted' CHECK(status IN ('submitted','approved','rejected')), reviewer_note text, created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now());
GRANT SELECT,INSERT,UPDATE ON public.lesson_progress,public.exam_attempts,public.student_projects TO authenticated;
GRANT ALL ON public.lesson_progress,public.exam_attempts,public.student_projects TO service_role;
ALTER TABLE public.lesson_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exam_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_projects ENABLE ROW LEVEL SECURITY;
CREATE POLICY "students own lesson progress" ON public.lesson_progress FOR ALL TO authenticated USING(student_id=auth.uid()) WITH CHECK(student_id=auth.uid() AND EXISTS(SELECT 1 FROM public.enrollments e JOIN public.lessons l ON l.course_id=e.course_id WHERE e.student_id=auth.uid() AND l.id=lesson_id));
CREATE POLICY "students own exams" ON public.exam_attempts FOR ALL TO authenticated USING(student_id=auth.uid()) WITH CHECK(student_id=auth.uid() AND EXISTS(SELECT 1 FROM public.enrollments e WHERE e.student_id=auth.uid() AND e.course_id=course_id));
CREATE POLICY "students own projects" ON public.student_projects FOR ALL TO authenticated USING(student_id=auth.uid()) WITH CHECK(student_id=auth.uid() AND EXISTS(SELECT 1 FROM public.enrollments e WHERE e.student_id=auth.uid() AND e.course_id=course_id));
CREATE POLICY "admin reads student projects" ON public.student_projects FOR SELECT TO authenticated USING(public.is_admin());
CREATE POLICY "admin updates student projects" ON public.student_projects FOR UPDATE TO authenticated USING(public.is_admin()) WITH CHECK(public.is_admin());

-- Payments
CREATE TABLE IF NOT EXISTS public.payment_transactions (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), reference text UNIQUE NOT NULL, student_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE, course_id uuid NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE, amount numeric(12,2) NOT NULL, currency text NOT NULL, status text NOT NULL DEFAULT 'pending' CHECK(status IN ('pending','success','failed')), provider text NOT NULL DEFAULT 'paystack', created_at timestamptz NOT NULL DEFAULT now(), verified_at timestamptz);
GRANT SELECT ON public.payment_transactions TO authenticated;
GRANT ALL ON public.payment_transactions TO service_role;
ALTER TABLE public.payment_transactions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "student reads own payments" ON public.payment_transactions FOR SELECT TO authenticated USING(student_id=auth.uid() OR public.is_admin());
CREATE POLICY "admin manages payments" ON public.payment_transactions FOR ALL TO authenticated USING(public.is_admin()) WITH CHECK(public.is_admin());
CREATE OR REPLACE FUNCTION public.activate_course_after_payment(_reference text) RETURNS boolean LANGUAGE plpgsql SECURITY DEFINER SET search_path=public AS $$
DECLARE p public.payment_transactions; BEGIN
  SELECT * INTO p FROM public.payment_transactions WHERE reference=_reference AND status='success' FOR UPDATE;
  IF NOT FOUND THEN RETURN false; END IF;
  INSERT INTO public.enrollments(student_id,course_id,status) VALUES(p.student_id,p.course_id,'active')
  ON CONFLICT (student_id,course_id) DO UPDATE SET status='active';
  RETURN true; END $$;
REVOKE ALL ON FUNCTION public.activate_course_after_payment(text) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.activate_course_after_payment(text) TO service_role;

-- Certificates
CREATE TABLE IF NOT EXISTS public.certificates (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), student_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE, course_id uuid NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE, certificate_number text UNIQUE NOT NULL, issue_date timestamptz NOT NULL DEFAULT now(), created_at timestamptz NOT NULL DEFAULT now());
GRANT SELECT ON public.certificates TO authenticated;
GRANT ALL ON public.certificates TO service_role;
ALTER TABLE public.certificates ENABLE ROW LEVEL SECURITY;
CREATE POLICY "students read own certificates" ON public.certificates FOR SELECT TO authenticated USING(student_id=auth.uid() OR public.is_admin());
CREATE POLICY "admin manages certificates" ON public.certificates FOR ALL TO authenticated USING(public.is_admin()) WITH CHECK(public.is_admin());

-- Invitations (no anon/authenticated read: token validation is server-side only)
CREATE TABLE IF NOT EXISTS public.pm_invitations (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), token text UNIQUE NOT NULL, email text NOT NULL, full_name text NOT NULL, invited_by uuid REFERENCES auth.users(id) ON DELETE SET NULL, status text NOT NULL DEFAULT 'pending' CHECK(status IN ('pending','accepted','revoked','expired')), expires_at timestamptz NOT NULL, accepted_at timestamptz, accepted_user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL, created_at timestamptz NOT NULL DEFAULT now());
CREATE TABLE IF NOT EXISTS public.talent_invitations (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), token text UNIQUE NOT NULL, email text NOT NULL, full_name text NOT NULL, invited_by uuid REFERENCES auth.users(id) ON DELETE SET NULL, status text NOT NULL DEFAULT 'pending' CHECK(status IN ('pending','accepted','revoked','expired')), expires_at timestamptz NOT NULL, accepted_at timestamptz, accepted_user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL, created_at timestamptz NOT NULL DEFAULT now());
GRANT ALL ON public.pm_invitations, public.talent_invitations TO service_role;
ALTER TABLE public.pm_invitations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.talent_invitations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "admin manages pm invitations" ON public.pm_invitations FOR ALL TO authenticated USING(public.is_admin()) WITH CHECK(public.is_admin());
CREATE POLICY "admin manages talent invitations" ON public.talent_invitations FOR ALL TO authenticated USING(public.is_admin()) WITH CHECK(public.is_admin());
GRANT SELECT, INSERT, UPDATE, DELETE ON public.pm_invitations, public.talent_invitations TO authenticated;

CREATE OR REPLACE FUNCTION public.validate_invite_token(_token text) RETURNS jsonb LANGUAGE sql STABLE SECURITY DEFINER SET search_path=public AS $$
  SELECT jsonb_build_object('type','pm','email',email,'full_name',full_name,'status',status,'expires_at',expires_at)
  FROM public.pm_invitations WHERE token=_token
  UNION ALL
  SELECT jsonb_build_object('type','talent','email',email,'full_name',full_name,'status',status,'expires_at',expires_at)
  FROM public.talent_invitations WHERE token=_token
  LIMIT 1;
$$;
GRANT EXECUTE ON FUNCTION public.validate_invite_token(text) TO authenticated, service_role;

-- Career/talent applications
CREATE TABLE IF NOT EXISTS public.career_applications (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), full_name text NOT NULL, email text NOT NULL, role_applied text NOT NULL, portfolio_url text, cover_letter text, status text NOT NULL DEFAULT 'new' CHECK(status IN ('new','reviewing','invited','rejected')), created_at timestamptz NOT NULL DEFAULT now());
GRANT INSERT ON public.career_applications TO anon, authenticated;
GRANT SELECT, UPDATE, DELETE ON public.career_applications TO authenticated;
GRANT ALL ON public.career_applications TO service_role;
ALTER TABLE public.career_applications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anyone can apply" ON public.career_applications FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "admin manages applications" ON public.career_applications FOR ALL TO authenticated USING(public.is_admin()) WITH CHECK(public.is_admin());