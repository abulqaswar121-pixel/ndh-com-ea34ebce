CREATE TABLE public.project_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  sender_id uuid NOT NULL,
  body text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.project_messages TO authenticated;
GRANT ALL ON public.project_messages TO service_role;
ALTER TABLE public.project_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "project messages read" ON public.project_messages FOR SELECT TO authenticated USING (public.can_see_project(project_id));
CREATE POLICY "project messages insert" ON public.project_messages FOR INSERT TO authenticated WITH CHECK (sender_id = auth.uid() AND public.can_see_project(project_id));
CREATE POLICY "project messages delete own" ON public.project_messages FOR DELETE TO authenticated USING (sender_id = auth.uid() OR public.is_admin());
CREATE INDEX project_messages_project_idx ON public.project_messages(project_id, created_at);

CREATE TABLE public.project_files (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  uploader_id uuid NOT NULL,
  file_name text NOT NULL,
  file_path text NOT NULL,
  size_bytes bigint,
  content_type text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.project_files TO authenticated;
GRANT ALL ON public.project_files TO service_role;
ALTER TABLE public.project_files ENABLE ROW LEVEL SECURITY;
CREATE POLICY "project files read" ON public.project_files FOR SELECT TO authenticated USING (public.can_see_project(project_id));
CREATE POLICY "project files insert" ON public.project_files FOR INSERT TO authenticated WITH CHECK (uploader_id = auth.uid() AND public.can_see_project(project_id));
CREATE POLICY "project files delete" ON public.project_files FOR DELETE TO authenticated USING (uploader_id = auth.uid() OR public.is_admin());
CREATE INDEX project_files_project_idx ON public.project_files(project_id, created_at);

CREATE POLICY "project-files: member read" ON storage.objects FOR SELECT TO authenticated USING (bucket_id = 'project-files' AND public.can_see_project(((storage.foldername(name))[1])::uuid));
CREATE POLICY "project-files: member write" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'project-files' AND public.can_see_project(((storage.foldername(name))[1])::uuid));
CREATE POLICY "project-files: member delete" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'project-files' AND public.can_see_project(((storage.foldername(name))[1])::uuid));

CREATE POLICY "projects staff insert" ON public.projects FOR INSERT TO authenticated WITH CHECK (public.is_staff());