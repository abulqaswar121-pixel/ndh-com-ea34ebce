
-- Fix tautological enrollment checks (e.course_id = e.course_id is always true)
DROP POLICY IF EXISTS "students own exams" ON public.exam_attempts;
CREATE POLICY "students own exams" ON public.exam_attempts
  FOR ALL TO authenticated
  USING (student_id = auth.uid() AND EXISTS (
    SELECT 1 FROM public.enrollments e
    WHERE e.student_id = auth.uid() AND e.course_id = exam_attempts.course_id AND e.status = 'active'))
  WITH CHECK (student_id = auth.uid() AND EXISTS (
    SELECT 1 FROM public.enrollments e
    WHERE e.student_id = auth.uid() AND e.course_id = exam_attempts.course_id AND e.status = 'active'));

DROP POLICY IF EXISTS "students own projects" ON public.student_projects;
CREATE POLICY "students own projects select" ON public.student_projects
  FOR SELECT TO authenticated USING (student_id = auth.uid());
CREATE POLICY "students own projects insert" ON public.student_projects
  FOR INSERT TO authenticated
  WITH CHECK (student_id = auth.uid() AND status <> 'approved' AND EXISTS (
    SELECT 1 FROM public.enrollments e
    WHERE e.student_id = auth.uid() AND e.course_id = student_projects.course_id AND e.status = 'active'));
CREATE POLICY "students own projects update" ON public.student_projects
  FOR UPDATE TO authenticated
  USING (student_id = auth.uid())
  WITH CHECK (student_id = auth.uid() AND status <> 'approved' AND EXISTS (
    SELECT 1 FROM public.enrollments e
    WHERE e.student_id = auth.uid() AND e.course_id = student_projects.course_id AND e.status = 'active'));

-- Staff task creation must be scoped to projects they can see
DROP POLICY IF EXISTS "tasks staff write" ON public.tasks;
CREATE POLICY "tasks staff write" ON public.tasks
  FOR INSERT TO authenticated
  WITH CHECK (public.can_see_project(project_id));

-- Pin search_path on functions that lack it
ALTER FUNCTION public.delete_email(text, bigint) SET search_path = public, pgmq;
ALTER FUNCTION public.enqueue_email(text, jsonb) SET search_path = public, pgmq;
ALTER FUNCTION public.read_email_batch(text, integer, integer) SET search_path = public, pgmq;
ALTER FUNCTION public.move_to_dlq(text, text, bigint, jsonb) SET search_path = public, pgmq;
