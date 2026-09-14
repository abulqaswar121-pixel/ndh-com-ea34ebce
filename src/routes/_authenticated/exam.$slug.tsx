import { createFileRoute, Link } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { ClipboardCheck } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { generateReadinessQuiz, submitReadinessQuiz } from '@/lib/academy.functions';
import { PortalFrame } from '@/components/PortalShell';
import { RequireRole } from '@/components/RequireRole';
import { useAuth } from '@/lib/auth';
import { Reveal } from '@/components/Reveal';

export const Route = createFileRoute('/_authenticated/exam/$slug')({
  component: () => (
    <RequireRole role="student">
      <QuizPage />
    </RequireRole>
  ),
});

type Question = {
  id: string;
  type: 'multiple_choice' | 'short_answer';
  question: string;
  options?: string[];
  lesson?: string | null;
};

function QuizPage() {
  const { slug } = Route.useParams();
  const { user } = useAuth();
  const [course, setCourse] = useState<any>();
  const [attempt, setAttempt] = useState<{ id: string; questions: Question[] } | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!user) return;
    void (supabase as any)
      .from('courses')
      .select('id,title,slug')
      .eq('slug', slug)
      .maybeSingle()
      .then(({ data }: any) => setCourse(data));
  }, [slug, user]);

  useEffect(() => {
    if (!user || !course) return;
    void (supabase as any)
      .from('quiz_attempts')
      .select('id,score,passed,feedback,submitted_at')
      .eq('student_id', user.id)
      .eq('course_id', course.id)
      .eq('passed', true)
      .limit(1)
      .maybeSingle()
      .then(({ data }: any) => {
        if (data) setResult({ score: data.score, passed: true, feedback: data.feedback ?? [] });
      });
  }, [user, course]);

  async function start() {
    if (!course) return;
    setBusy(true);
    setError('');
    try {
      const created = await generateReadinessQuiz({ data: { courseId: course.id } });
      setAttempt(created as any);
      setAnswers({});
      setResult(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'We could not build your quiz. Please try again.');
    } finally {
      setBusy(false);
    }
  }

  async function finish(e: React.FormEvent) {
    e.preventDefault();
    if (!attempt) return;
    setBusy(true);
    setError('');
    try {
      setResult(await submitReadinessQuiz({ data: { attemptId: attempt.id, answers } }));
      setAttempt(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'We could not submit your answers. Please try again.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <PortalFrame>
      <main className="portal">
        <div className="portal-head">
          <div>
            <p className="eyebrow">READINESS QUIZ</p>
            <h1>{course?.title || 'Course quiz'}</h1>
            <p>Score 70% or more to unlock your final project brief.</p>
          </div>
          <ClipboardCheck size={42} />
        </div>

        <Reveal>
          <section className="portal-section">
            {result ? (
              <div className="exam-card">
                <h2>{result.passed ? 'Quiz passed' : 'Not passed yet'}</h2>
                <p>
                  You scored {result.score}%. Pass mark is {result.pass_mark ?? 70}%.
                </p>
                {Array.isArray(result.feedback) && result.feedback.length > 0 && (
                  <ul className="quiz-feedback">
                    {result.feedback.map((f: any) => (
                      <li key={f.id} className={f.correct ? 'is-correct' : 'is-wrong'}>
                        <strong>{f.question}</strong>
                        <span>{f.note}</span>
                        {f.lesson && !f.correct && <em>Revisit: {f.lesson}</em>}
                      </li>
                    ))}
                  </ul>
                )}
                {result.passed ? (
                  <Link className="button" to="/project/$slug" params={{ slug }}>
                    Go to your project
                  </Link>
                ) : (
                  <button className="button" onClick={() => void start()} disabled={busy}>
                    {busy ? 'Preparing…' : 'Try a fresh quiz'}
                  </button>
                )}
              </div>
            ) : !attempt ? (
              <div className="empty-card">
                <h2>Start your readiness quiz</h2>
                <p>Eight questions drawn from the lessons you just completed.</p>
                <button className="button" onClick={() => void start()} disabled={busy}>
                  {busy ? 'Preparing…' : 'Start quiz'}
                </button>
              </div>
            ) : (
              <form className="exam-card" onSubmit={finish}>
                {attempt.questions.map((q, i) => (
                  <label className="exam-question" key={q.id}>
                    <b>
                      {i + 1}. {q.question}
                    </b>
                    {q.type === 'multiple_choice' ? (
                      (q.options ?? []).map((option) => (
                        <span key={option}>
                          <input
                            type="radio"
                            name={q.id}
                            value={option}
                            required
                            onChange={(e) => setAnswers({ ...answers, [q.id]: e.target.value })}
                          />{' '}
                          {option}
                        </span>
                      ))
                    ) : (
                      <textarea
                        rows={4}
                        required
                        onChange={(e) => setAnswers({ ...answers, [q.id]: e.target.value })}
                      />
                    )}
                  </label>
                ))}
                <button className="button" disabled={busy}>
                  {busy ? 'Marking…' : 'Submit answers'}
                </button>
              </form>
            )}
            {error && <p className="form-error">{error}</p>}
          </section>
        </Reveal>
      </main>
    </PortalFrame>
  );
}
