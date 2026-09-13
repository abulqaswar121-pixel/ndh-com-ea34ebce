ALTER TABLE public.courses
  ADD COLUMN IF NOT EXISTS overview text,
  ADD COLUMN IF NOT EXISTS preparation text,
  ADD COLUMN IF NOT EXISTS checklist text,
  ADD COLUMN IF NOT EXISTS common_mistakes text,
  ADD COLUMN IF NOT EXISTS project_brief text,
  ADD COLUMN IF NOT EXISTS source_video_id text,
  ADD COLUMN IF NOT EXISTS rubric jsonb NOT NULL DEFAULT '[]'::jsonb;

ALTER TABLE public.lessons
  ADD COLUMN IF NOT EXISTS video_id text,
  ADD COLUMN IF NOT EXISTS start_seconds integer,
  ADD COLUMN IF NOT EXISTS end_seconds integer,
  ADD COLUMN IF NOT EXISTS practice_task text,
  ADD COLUMN IF NOT EXISTS knowledge_check text,
  ADD COLUMN IF NOT EXISTS is_required boolean NOT NULL DEFAULT true;