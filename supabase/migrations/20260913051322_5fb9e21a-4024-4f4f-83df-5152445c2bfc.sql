CREATE TABLE IF NOT EXISTS public.stage_courses (
  title text PRIMARY KEY,
  overview text, preparation text, checklist text, common_mistakes text,
  project_brief text, learning_objectives text, source_video_id text, rubric jsonb
);
GRANT ALL ON public.stage_courses TO service_role;
ALTER TABLE public.stage_courses ENABLE ROW LEVEL SECURITY;

CREATE TABLE IF NOT EXISTS public.stage_lessons (
  course_title text NOT NULL,
  position integer NOT NULL,
  title text NOT NULL,
  content text, practice_task text, knowledge_check text,
  video_url text, video_id text,
  start_seconds integer, end_seconds integer,
  is_free_preview boolean NOT NULL DEFAULT false,
  PRIMARY KEY (course_title, position)
);
GRANT ALL ON public.stage_lessons TO service_role;
ALTER TABLE public.stage_lessons ENABLE ROW LEVEL SECURITY;