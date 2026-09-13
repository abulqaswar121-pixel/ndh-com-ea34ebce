import { createFileRoute, Link } from '@tanstack/react-router';
import { useEffect, useMemo, useState } from 'react';
import { BookOpen, CheckCircle2, ClipboardList, LockKeyhole } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { PortalFrame } from '@/components/PortalShell';
import { RequireRole } from '@/components/RequireRole';
import { useAuth } from '@/lib/auth';
import { Reveal } from '@/components/Reveal';

export const Route = createFileRoute('/_authenticated/learning/$slug')({
  component: () => (
    <RequireRole role="student">
      <LearningPage />
    </RequireRole>
  ),
});

function formatClock(total: number | null | undefined) {
  if (total === null || total === undefined) return null;
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
}

function embedUrl(lesson: any) {
  const id = lesson.video_id || String(lesson.video_url || '').match(/[?&]v=([A-Za-z0-9_-]+)/)?.[1];
  if (!id) return null;
  const params = new URLSearchParams({ rel: '0', modestbranding: '1' });
  if (lesson.start_seconds != null) params.set('start', String(lesson.start_seconds));
  if (lesson.end_seconds != null) params.set('end', String(lesson.end_seconds));
  return `https://www.youtube-nocookie.com/embed/${id}?${params.toString()}`;
}

function LearningPage() {
  const { slug } = Route.useParams();
  const { user } = useAuth();
  const [course, setCourse] = useState<any>(null);
  const [lessons, setLessons] = useState<any[]>([]);
  const [done, setDone] = useState<string[]>([]);
  const [openId, setOpenId] = useState<string | null>(null);
  const [guide, setGuide] = useState<'preparation' | 'checklist' | 'mistakes' | null>(null);

  useEffect(() => {
    if (!user) return;
    void (supabase as any)
      .from('courses')
      .select('*')
      .eq('slug', slug)
      .maybeSingle()
      .then(({ data }: any) => {
        setCourse(data);
        if (data) {
          void (supabase as any)
            .from('lessons')
            .select('*')
            .eq('course_id', data.id)
            .order('position')
            .then(({ data: rows }: any) => {
              setLessons(rows ?? []);
              setOpenId(rows?.[0]?.id ?? null);
            });
        }
      });
    void (supabase as any)
      .from('lesson_progress')
      .select('lesson_id')
      .eq('student_id', user.id)
      .then(({ data }: any) => setDone((data ?? []).map((x: any) => x.lesson_id)));
  }, [slug, user]);

  async function complete(id: string) {
    if (!user || done.includes(id)) return;
    await (supabase as any).from('lesson_progress').insert({ student_id: user.id, lesson_id: id });
    const next = [...done, id];
    setDone(next);
    if (course) {
      const percentNow = lessons.length ? Math.round((next.length / lessons.length) * 100) : 0;
      await (supabase as any)
        .from('enrollments')
        .update({ progress: percentNow })
        .eq('student_id', user.id)
        .eq('course_id', course.id);
    }
    const index = lessons.findIndex((l) => l.id === id);
    const following = lessons[index + 1];
    if (following) setOpenId(following.id);
  }

  const percent = lessons.length ? Math.round((done.length / lessons.length) * 100) : 0;
  const requiredDone = useMemo(
    () => lessons.filter((l) => l.is_required !== false).every((l) => done.includes(l.id)),
    [lessons, done],
  );
  const unlocked = lessons.length > 0 && requiredDone;
  const guideText =
    guide === 'preparation' ? course?.preparation : guide === 'checklist' ? course?.checklist : course?.common_mistakes;

  return (
    <PortalFrame>
      <main className="portal">
        <div className="portal-head">
          <div>
            <p className="eyebrow">LEARNING</p>
            <h1>{course?.title || 'Course learning'}</h1>
            <p>{course?.summary}</p>
          </div>
          <BookOpen size={42} />
        </div>

        {(course?.preparation || course?.checklist || course?.common_mistakes) && (
          <section className="portal-section">
            <div className="catalog-filters">
              {course?.preparation && (
                <button
                  type="button"
                  className={guide === 'preparation' ? 'chip is-active' : 'chip'}
                  onClick={() => setGuide(guide === 'preparation' ? null : 'preparation')}
                >
                  Before you start
                </button>
              )}
              {course?.checklist && (
                <button
                  type="button"
                  className={guide === 'checklist' ? 'chip is-active' : 'chip'}
                  onClick={() => setGuide(guide === 'checklist' ? null : 'checklist')}
                >
                  Reference checklist
                </button>
              )}
              {course?.common_mistakes && (
                <button
                  type="button"
                  className={guide === 'mistakes' ? 'chip is-active' : 'chip'}
                  onClick={() => setGuide(guide === 'mistakes' ? null : 'mistakes')}
                >
                  Common mistakes
                </button>
              )}
            </div>
            {guideText && <LessonContent text={guideText} />}
          </section>
        )}

        <Reveal>
          <section className="portal-section">
            <div className="portal-section-title">
              <h2>Lessons</h2>
              <span>
                {done.length} of {lessons.length} complete — {percent}%
              </span>
            </div>
            <div className="progress-track">
              <span style={{ width: `${percent}%` }} />
            </div>

            {lessons.length === 0 ? (
              <div className="empty-card">
                Lessons for this course are being published. Check back shortly.
              </div>
            ) : (
              <div className="lesson-list">
                {lessons.map((l) => {
                  const isOpen = openId === l.id;
                  const isDone = done.includes(l.id);
                  const from = formatClock(l.start_seconds);
                  const to = formatClock(l.end_seconds);
                  const src = embedUrl(l);
                  return (
                    <article className={`lesson-item${isOpen ? ' is-open' : ''}`} key={l.id}>
                      <button
                        type="button"
                        className="lesson-head"
                        onClick={() => setOpenId(isOpen ? null : l.id)}
                      >
                        <span className="lesson-number">{String(l.position).padStart(2, '0')}</span>
                        <strong>{l.title}</strong>
                        {from && (
                          <em className="lesson-time">
                            {from}
                            {to ? `–${to}` : ''}
                          </em>
                        )}
                        {isDone && <CheckCircle2 size={18} className="lesson-done" />}
                      </button>

                      {isOpen && (
                        <div className="lesson-body">
                          {src && (
                            <div className="video-frame">
                              <iframe
                                src={src}
                                title={l.title}
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; picture-in-picture"
                                allowFullScreen
                              />
                            </div>
                          )}
                          {l.content && <LessonContent text={l.content} />}
                          {l.practice_task && (
                            <div className="lesson-task">
                              <h4>
                                <ClipboardList size={16} /> Follow-along task
                              </h4>
                              <p>{l.practice_task}</p>
                            </div>
                          )}
                          {l.knowledge_check && (
                            <div className="lesson-task">
                              <h4>Check your understanding</h4>
                              <p>{l.knowledge_check}</p>
                            </div>
                          )}
                          {l.notes && <p className="lesson-note">{l.notes}</p>}
                          <button className="button" onClick={() => void complete(l.id)} disabled={isDone}>
                            {isDone ? 'Completed' : 'Mark as complete'}
                          </button>
                        </div>
                      )}
                    </article>
                  );
                })}
              </div>
            )}
          </section>
        </Reveal>

        <section className="portal-section locked-tabs">
          <div>
            {unlocked ? <CheckCircle2 size={20} /> : <LockKeyhole size={20} />}
            <h2>Final assessment</h2>
            {unlocked ? (
              <>
                <p>All lessons complete. You can sit the assessment now.</p>
                <Link className="button" to="/exam/$slug" params={{ slug }}>
                  Start the assessment
                </Link>
              </>
            ) : (
              <p>Complete every lesson to unlock the final assessment.</p>
            )}
          </div>
          <div>
            <LockKeyhole size={20} />
            <h2>Practical project</h2>
            <p>Pass the assessment to unlock your project brief.</p>
            {unlocked && (
              <Link className="button button-secondary" to="/project/$slug" params={{ slug }}>
                Go to project
              </Link>
            )}
          </div>
        </section>
      </main>
    </PortalFrame>
  );
}

/** Renders the lightweight markdown used in lesson content. */
function LessonContent({ text }: { text: string }) {
  const blocks = text.split('\n').filter((line) => line.trim().length > 0);
  return (
    <div className="lesson-content">
      {blocks.map((line, i) => {
        const trimmed = line.trim();
        if (trimmed.startsWith('## ')) return <h3 key={i}>{trimmed.slice(3)}</h3>;
        if (trimmed.startsWith('- ') || trimmed.startsWith('• '))
          return <p className="lesson-bullet" key={i}>• {inline(trimmed.slice(2))}</p>;
        if (/^\d+\.\s/.test(trimmed)) return <p className="lesson-bullet" key={i}>{inline(trimmed)}</p>;
        return <p key={i}>{inline(trimmed)}</p>;
      })}
    </div>
  );
}

function inline(text: string) {
  return text.split(/\*\*(.+?)\*\*/g).map((part, i) => (i % 2 === 1 ? <strong key={i}>{part}</strong> : part));
}
