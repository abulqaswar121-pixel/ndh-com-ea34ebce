-- 1. Column additions
ALTER TABLE public.courses
  ADD COLUMN IF NOT EXISTS learning_objectives text,
  ADD COLUMN IF NOT EXISTS project_theme text,
  ADD COLUMN IF NOT EXISTS cover_image_url text,
  ADD COLUMN IF NOT EXISTS school text;

ALTER TABLE public.lessons
  ADD COLUMN IF NOT EXISTS notes text;

-- 2. course_pricing
CREATE TABLE IF NOT EXISTS public.course_pricing (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id uuid NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  region text NOT NULL CHECK (region IN ('NG','AF','GLOBAL')),
  currency text NOT NULL DEFAULT 'NGN',
  amount numeric NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (course_id, region)
);
GRANT SELECT ON public.course_pricing TO anon;
GRANT SELECT ON public.course_pricing TO authenticated;
GRANT ALL ON public.course_pricing TO service_role;
ALTER TABLE public.course_pricing ENABLE ROW LEVEL SECURITY;
CREATE POLICY "pricing read published" ON public.course_pricing FOR SELECT TO anon, authenticated
  USING (EXISTS (SELECT 1 FROM public.courses c WHERE c.id = course_id AND c.is_published));
CREATE POLICY "pricing admin manage" ON public.course_pricing FOR ALL TO authenticated
  USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE TRIGGER course_pricing_updated BEFORE UPDATE ON public.course_pricing
  FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();

-- 3. talent_earnings
CREATE TABLE IF NOT EXISTS public.talent_earnings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  talent_id uuid NOT NULL UNIQUE,
  currency text NOT NULL DEFAULT 'NGN',
  pending_amount numeric NOT NULL DEFAULT 0,
  available_amount numeric NOT NULL DEFAULT 0,
  paid_amount numeric NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.talent_earnings TO authenticated;
GRANT ALL ON public.talent_earnings TO service_role;
ALTER TABLE public.talent_earnings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "earnings own read" ON public.talent_earnings FOR SELECT TO authenticated
  USING (talent_id = auth.uid() OR public.is_admin());
CREATE POLICY "earnings admin manage" ON public.talent_earnings FOR ALL TO authenticated
  USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE TRIGGER talent_earnings_updated BEFORE UPDATE ON public.talent_earnings
  FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();

-- 4. payout_requests
DO $$ BEGIN
  CREATE TYPE public.payout_status AS ENUM ('pending','approved','paid','rejected');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE TABLE IF NOT EXISTS public.payout_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  talent_id uuid NOT NULL,
  amount numeric NOT NULL DEFAULT 0,
  currency text NOT NULL DEFAULT 'NGN',
  status public.payout_status NOT NULL DEFAULT 'pending',
  note text,
  requested_at timestamptz NOT NULL DEFAULT now(),
  processed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.payout_requests TO authenticated;
GRANT ALL ON public.payout_requests TO service_role;
ALTER TABLE public.payout_requests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "payouts own read" ON public.payout_requests FOR SELECT TO authenticated
  USING (talent_id = auth.uid() OR public.is_admin());
CREATE POLICY "payouts own insert" ON public.payout_requests FOR INSERT TO authenticated
  WITH CHECK (talent_id = auth.uid() AND status = 'pending');
CREATE POLICY "payouts admin manage" ON public.payout_requests FOR ALL TO authenticated
  USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE TRIGGER payout_requests_updated BEFORE UPDATE ON public.payout_requests
  FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();

-- 5. pm_review_access
CREATE TABLE IF NOT EXISTS public.pm_review_access (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  pm_id uuid NOT NULL UNIQUE,
  enabled boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.pm_review_access TO authenticated;
GRANT ALL ON public.pm_review_access TO service_role;
ALTER TABLE public.pm_review_access ENABLE ROW LEVEL SECURITY;
CREATE POLICY "pm access admin manage" ON public.pm_review_access FOR ALL TO authenticated
  USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "pm access own read" ON public.pm_review_access FOR SELECT TO authenticated
  USING (pm_id = auth.uid() OR public.is_admin());
CREATE TRIGGER pm_review_access_updated BEFORE UPDATE ON public.pm_review_access
  FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();

CREATE OR REPLACE FUNCTION public.can_review_submissions()
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT public.is_admin() OR EXISTS (
    SELECT 1 FROM public.pm_review_access a
    WHERE a.pm_id = auth.uid() AND a.enabled AND public.has_role(auth.uid(),'pm')
  )
$$;

-- 6. academy_submissions
DO $$ BEGIN
  CREATE TYPE public.submission_status AS ENUM ('submitted','approved','rejected');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE TABLE IF NOT EXISTS public.academy_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid NOT NULL,
  course_id uuid NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  brief text,
  submission_url text,
  submission_text text,
  submission_file_path text,
  ai_verdict text,
  ai_feedback text,
  status public.submission_status NOT NULL DEFAULT 'submitted',
  reviewer_note text,
  reviewed_by uuid,
  reviewed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.academy_submissions TO authenticated;
GRANT ALL ON public.academy_submissions TO service_role;
ALTER TABLE public.academy_submissions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "submissions own read" ON public.academy_submissions FOR SELECT TO authenticated
  USING (student_id = auth.uid() OR public.can_review_submissions());
CREATE POLICY "submissions own insert" ON public.academy_submissions FOR INSERT TO authenticated
  WITH CHECK (student_id = auth.uid() AND public.is_enrolled(course_id));
CREATE POLICY "submissions reviewer update" ON public.academy_submissions FOR UPDATE TO authenticated
  USING (public.can_review_submissions()) WITH CHECK (public.can_review_submissions());
CREATE POLICY "submissions admin delete" ON public.academy_submissions FOR DELETE TO authenticated
  USING (public.is_admin());
CREATE TRIGGER academy_submissions_updated BEFORE UPDATE ON public.academy_submissions
  FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();

-- 7. audit_logs
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id uuid,
  action text NOT NULL,
  target_user_id uuid,
  details jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.audit_logs TO authenticated;
GRANT ALL ON public.audit_logs TO service_role;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "audit admin read" ON public.audit_logs FOR SELECT TO authenticated
  USING (public.is_admin());

-- 8. Tighten lesson access to actively enrolled students only
DROP POLICY IF EXISTS "lessons read" ON public.lessons;
CREATE POLICY "lessons read" ON public.lessons FOR SELECT TO authenticated
  USING (is_free_preview OR public.is_enrolled(course_id) OR public.is_admin());