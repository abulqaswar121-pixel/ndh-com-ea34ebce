import { createFileRoute, Link } from '@tanstack/react-router';
import { useEffect, useMemo, useState } from 'react';
import { BookOpen, CheckCircle2, ClipboardList, LockKeyhole, Star } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { PortalFrame } from '@/components/PortalShell';
import { RequireRole } from '@/components/RequireRole';
import { LessonPlayer } from '@/components/LessonPlayer';
import { useAuth } from '@/lib/auth';
import { Reveal } from '@/components/Reveal';
import { getCourseContent, rateCourse, submitStudentTestimonial } from '@/lib/academy.functions';

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

function videoIdOf(lesson: any): string | null {
  return lesson.video_id || String(lesson.video_url || '').match(/[?&]v=([A-Za-z0-9_-]+)/)?.[1] || null;
}

function LearningPage() {
  const { slug } = Route.useParams();
  const { user } = useAuth();
  const [course, setCourse] = useState<any>(null);
  const [content, setContent] = useState<any>(null);
  const [lessons, setLessons] = useState<any[]>([]);
  const [done, setDone] = useState<string[]>([]);
  const [openId, setOpenId] = useState<string | null>(null);
  const [guide, setGuide] = useState<'preparation' | 'checklist' | 'mistakes' | null>(null);

  useEffect(() => {
    if (!user) return;
    void (supabase as any)
      .from('courses')
      .select('id,slug,title,summary,school')
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
    void getCourseContent({ data: { slug } })
      .then(setContent)
      .catch(() => setContent(null));
    void (supabase as any)
      .from('lesson_progress')
      .select('lesson_id')
      .eq('student_id', user.id)
      .then(({ data }: any) => setDone((data ?? []).map((x: any) => x.lesson_id)));
  }, [slug, user]);

  async function complete(id: string, advance = true) {
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
    if (!advance) return;
    const index = lessons.findIndex((l) => l.id === id);
    const following = lessons[index + 1];
    if (following) setOpenId(following.id);
  }

  const percent = lessons.length ? Math.round((done.length / lessons.length) * 100) : 0;
  const requiredDone = useMemo(
    () => lessons.length > 0 && lessons.filter((l) => l.is_required !== false).every((l) => done.includes(l.id)),
    [lessons, done],
  );
  const guideText =
    guide === 'preparation' ? content?.preparation : guide === 'checklist' ? content?.checklist : content?.common_mistakes;

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

        {(content?.preparation || content?.checklist || content?.common_mistakes) && (
          <section className="portal-section">
            <div className="catalog-filters">
              {content?.preparation && (
                <button
                  type="button"
                  className={guide === 'preparation' ? 'chip is-active' : 'chip'}
                  onClick={() => setGuide(guide === 'preparation' ? null : 'preparation')}
                >
                  Before you start
                </button>
              )}
              {content?.checklist && (
                <button
                  type="button"
                  className={guide === 'checklist' ? 'chip is-active' : 'chip'}
                  onClick={() => setGuide(guide === 'checklist' ? null : 'checklist')}
                >
                  Reference checklist
                </button>
              )}
              {content?.common_mistakes && (
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
              <div className="empty-card">Lessons for this course are being published. Check back shortly.</div>
            ) : (
              <div className="lesson-list">
                {lessons.map((l) => {
                  const isOpen = openId === l.id;
                  const isDone = done.includes(l.id);
                  const from = formatClock(l.start_seconds);
                  const to = formatClock(l.end_seconds);
                  const vid = videoIdOf(l);
                  return (
                    <article className={`lesson-item${isOpen ? ' is-open' : ''}`} key={l.id}>
                      <button type="button" className="lesson-head" onClick={() => setOpenId(isOpen ? null : l.id)}>
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
                          {vid && (
                            <LessonPlayer
                              videoId={vid}
                              startSeconds={Number(l.start_seconds ?? 0)}
                              endSeconds={l.end_seconds != null ? Number(l.end_seconds) : null}
                              title={l.title}
                              completed={isDone}
                              onSegmentWatched={() => void complete(l.id)}
                            />
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
                          <button className="button" onClick={() => void complete(l.id, false)} disabled={isDone}>
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
            {requiredDone ? <CheckCircle2 size={20} /> : <LockKeyhole size={20} />}
            <h2>Readiness quiz</h2>
            {requiredDone ? (
              <>
                <p>All lessons complete. Take the quiz to unlock your project.</p>
                <Link className="button" to="/exam/$slug" params={{ slug }}>
                  Start the quiz
                </Link>
              </>
            ) : (
              <p>Complete every required lesson to unlock the quiz.</p>
            )}
          </div>
          <div>
            <LockKeyhole size={20} />
            <h2>Practical project</h2>
            <p>Score 70% or more on the quiz to unlock your project brief.</p>
            {requiredDone && (
              <Link className="button button-secondary" to="/project/$slug" params={{ slug }}>
                Go to project
              </Link>
            )}
          </div>
        </section>

        {requiredDone && course && <CourseFeedback courseId={course.id} courseTitle={course.title} />}
      </main>
    </PortalFrame>
  );
}

function CourseFeedback({ courseId, courseTitle }: { courseId: string; courseTitle: string }) {
  const [stars, setStars] = useState(0);
  const [review, setReview] = useState('');
  const [rated, setRated] = useState(false);
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [quote, setQuote] = useState('');
  const [consent, setConsent] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  async function saveRating() {
    if (!stars) return;
    setError('');
    try {
      await rateCourse({ data: { courseId, stars, review: review || undefined } });
      setRated(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'We could not save your rating.');
    }
  }

  async function sendTestimonial(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    try {
      await submitStudentTestimonial({
        data: { courseId, displayName: name, roleLabel: role || undefined, quote, consent: true },
      });
      setSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'We could not send your testimonial.');
    }
  }

  return (
    <section className="portal-section">
      <div className="portal-section-title">
        <h2>Rate this course</h2>
        <span>{courseTitle}</span>
      </div>
      <div className="rating-picker">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            aria-label={`${n} star${n > 1 ? 's' : ''}`}
            className={n <= stars ? 'is-on' : ''}
            onClick={() => setStars(n)}
          >
            <Star size={22} />
          </button>
        ))}
      </div>
      <textarea
        rows={3}
        placeholder="Anything you want to add (optional)"
        value={review}
        onChange={(e) => setReview(e.target.value)}
      />
      <button className="button" onClick={() => void saveRating()} disabled={!stars}>
        {rated ? 'Rating saved' : 'Save rating'}
      </button>

      <div className="portal-section-title">
        <h2>Share a testimonial</h2>
      </div>
      {sent ? (
        <p className="form-success">Thank you. Your testimonial is with the Academy team for review.</p>
      ) : (
        <form className="auth-form" onSubmit={sendTestimonial}>
          <label>
            Name to display
            <input value={name} onChange={(e) => setName(e.target.value)} required minLength={2} />
          </label>
          <label>
            What you do (optional)
            <input value={role} onChange={(e) => setRole(e.target.value)} placeholder="Freelance designer" />
          </label>
          <label>
            Your words
            <textarea rows={4} value={quote} onChange={(e) => setQuote(e.target.value)} required minLength={20} />
          </label>
          <label className="checkbox-row">
            <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} required />
            I am happy for NDH to publish this with my name.
          </label>
          <button className="button" disabled={!consent}>
            Send testimonial
          </button>
        </form>
      )}
      {error && <p className="form-error">{error}</p>}
    </section>
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
          return (
            <p className="lesson-bullet" key={i}>
              • {inline(trimmed.slice(2))}
            </p>
          );
        if (/^\d+\.\s/.test(trimmed))
          return (
            <p className="lesson-bullet" key={i}>
              {inline(trimmed)}
            </p>
          );
        return <p key={i}>{inline(trimmed)}</p>;
      })}
    </div>
  );
}

function inline(text: string) {
  return text.split(/\*\*(.+?)\*\*/g).map((part, i) => (i % 2 === 1 ? <strong key={i}>{part}</strong> : part));
}
