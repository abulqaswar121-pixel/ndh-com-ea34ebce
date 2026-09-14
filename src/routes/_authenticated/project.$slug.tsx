import { createFileRoute, Link } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { FolderKanban, LockKeyhole, Send } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { generateProjectBrief, getCourseContent } from '@/lib/academy.functions';
import { PortalFrame } from '@/components/PortalShell';
import { RequireRole } from '@/components/RequireRole';
import { useAuth } from '@/lib/auth';
import { Reveal } from '@/components/Reveal';

export const Route = createFileRoute('/_authenticated/project/$slug')({
  component: () => (
    <RequireRole role="student">
      <ProjectPage />
    </RequireRole>
  ),
});

function ProjectPage() {
  const { slug } = Route.useParams();
  const { user } = useAuth();
  const [course, setCourse] = useState<any>();
  const [content, setContent] = useState<any>();
  const [quizPassed, setQuizPassed] = useState<boolean | null>(null);
  const [project, setProject] = useState<any>();
  const [url, setUrl] = useState('');
  const [text, setText] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!user) return;
    void (supabase as any)
      .from('courses')
      .select('id,slug,title,summary')
      .eq('slug', slug)
      .maybeSingle()
      .then(({ data }: any) => setCourse(data));
    void getCourseContent({ data: { slug } })
      .then(setContent)
      .catch(() => setContent(null));
  }, [slug, user]);

  useEffect(() => {
    if (!user || !course) return;
    void (supabase as any)
      .from('quiz_attempts')
      .select('id')
      .eq('student_id', user.id)
      .eq('course_id', course.id)
      .eq('passed', true)
      .limit(1)
      .maybeSingle()
      .then(({ data }: any) => setQuizPassed(Boolean(data)));
    void (supabase as any)
      .from('student_projects')
      .select('*')
      .eq('student_id', user.id)
      .eq('course_id', course.id)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle()
      .then(({ data }: any) => {
        if (data) setProject(data);
      });
  }, [user, course]);

  const rubric: { criterion: string; weight: number; standard: string }[] = Array.isArray(content?.rubric)
    ? content.rubric
    : [];

  async function create() {
    if (!course) return;
    setBusy(true);
    setError('');
    try {
      setProject(
        await generateProjectBrief({
          data: {
            courseId: course.id,
            theme: content?.project_brief || content?.project_theme || course.title,
          },
        }),
      );
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Unable to create project');
    } finally {
      setBusy(false);
    }
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!project) return;
    setBusy(true);
    const { data, error: updateError } = await (supabase as any)
      .from('student_projects')
      .update({ submission_url: url, submission_text: text, status: 'submitted' })
      .eq('id', project.id)
      .eq('student_id', user?.id)
      .select('*')
      .single();
    if (updateError) setError(updateError.message);
    else setProject(data);
    setBusy(false);
  }

  if (quizPassed === false && !project) {
    return (
      <PortalFrame>
        <main className="portal">
          <div className="portal-head">
            <div>
              <p className="eyebrow">PROJECT</p>
              <h1>{course?.title || 'Course project'}</h1>
              <p>Your project brief unlocks after the readiness quiz.</p>
            </div>
            <LockKeyhole size={42} />
          </div>
          <section className="portal-section">
            <div className="empty-card">
              <h2>Take the readiness quiz first</h2>
              <p>Score 70% or more and your project brief is released straight away.</p>
              <Link className="button" to="/exam/$slug" params={{ slug }}>
                Go to the quiz
              </Link>
            </div>
          </section>
        </main>
      </PortalFrame>
    );
  }

  return (
    <PortalFrame>
      <main className="portal">
        <div className="portal-head">
          <div>
            <p className="eyebrow">PROJECT</p>
            <h1>{course?.title || 'Course project'}</h1>
            <p>Complete the brief and submit your work for review.</p>
          </div>
          <FolderKanban size={42} />
        </div>

        {content?.project_brief && (
          <Reveal>
            <section className="portal-section">
              <div className="portal-section-title">
                <h2>Course project brief</h2>
              </div>
              <BriefText text={content.project_brief} />
            </section>
          </Reveal>
        )}

        {rubric.length > 0 && (
          <section className="portal-section">
            <div className="portal-section-title">
              <h2>How your work is graded</h2>
            </div>
            <ul className="rubric-list">
              {rubric.map((r) => (
                <li key={r.criterion}>
                  <strong>{r.criterion}</strong>
                  <em>{r.weight}%</em>
                  <span>{r.standard}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        <Reveal>
          <section className="portal-section">
            {!project ? (
              <div className="empty-card">
                <h2>Start your project</h2>
                <p>Your personal brief is created from this course project.</p>
                <button className="button" onClick={() => void create()} disabled={busy}>
                  {busy ? 'Creating…' : 'Start project'}
                </button>
              </div>
            ) : (
              <div className="exam-card">
                <h2>Your project brief</h2>
                <BriefText text={project.brief} />
                {project.status === 'submitted' || project.status === 'approved' ? (
                  <p className="form-success">
                    Submitted for review. Current status: {project.status}.
                    {project.reviewer_note ? ` Reviewer note: ${project.reviewer_note}` : ''}
                  </p>
                ) : (
                  <form className="auth-form" onSubmit={submit}>
                    <label>
                      Submission link
                      <input type="url" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://" />
                    </label>
                    <label>
                      Submission notes
                      <textarea rows={7} value={text} onChange={(e) => setText(e.target.value)} />
                    </label>
                    <button className="button" disabled={busy}>
                      {busy ? (
                        'Submitting…'
                      ) : (
                        <>
                          Submit project <Send size={16} />
                        </>
                      )}
                    </button>
                  </form>
                )}
                {error && <p className="error-text">{error}</p>}
              </div>
            )}
            {error && !project && <p className="error-text">{error}</p>}
          </section>
        </Reveal>
      </main>
    </PortalFrame>
  );
}

function BriefText({ text }: { text: string }) {
  return (
    <div className="lesson-content">
      {String(text)
        .split('\n')
        .filter((l) => l.trim())
        .map((line, i) => {
          const t = line.trim();
          if (t.startsWith('•') || t.startsWith('- '))
            return (
              <p className="lesson-bullet" key={i}>
                • {t.replace(/^[•-]\s*/, '')}
              </p>
            );
          if (/^\d+\.\s/.test(t))
            return (
              <p className="lesson-bullet" key={i}>
                {t}
              </p>
            );
          return <p key={i}>{t}</p>;
        })}
    </div>
  );
}
