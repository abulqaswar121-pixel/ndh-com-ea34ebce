import { createFileRoute, Link, notFound, useNavigate } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { BadgeCheck, CheckCircle2, Clock, GraduationCap, ListChecks } from 'lucide-react';
import { PortalPage } from '@/components/PortalShell';
import { getCourse } from '@/lib/catalog.functions';
import { startCourseCheckout } from '@/lib/payment.functions';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/lib/auth';
import { formatPrice } from '@/lib/format';

export const Route = createFileRoute('/_authenticated/portal/student/catalogue/$slug')({
  loader: async ({ params }) => {
    const course = await getCourse({ data: { slug: params.slug } });
    if (!course) throw notFound();
    return course;
  },
  errorComponent: () => (
    <div className="empty-card">
      We could not load this course. <Link to="/portal/student/catalogue">Back to courses</Link>
    </div>
  ),
  notFoundComponent: () => (
    <div className="empty-card">
      This course is no longer listed. <Link to="/portal/student/catalogue">Back to courses</Link>
    </div>
  ),
  component: PortalCourse,
});

function PortalCourse() {
  const course = Route.useLoaderData();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [enrolled, setEnrolled] = useState(false);
  const [region, setRegion] = useState<'NG' | 'INTL'>('NG');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const objectives = (course.learning_objectives ?? '')
    .split('\n')
    .map((s) => s.trim())
    .filter(Boolean);
  const intl = course.prices.find((p) => p.region !== 'NG');

  useEffect(() => {
    if (!user) return;
    void (supabase as any)
      .from('enrollments')
      .select('id')
      .eq('student_id', user.id)
      .eq('course_id', course.id)
      .maybeSingle()
      .then(({ data }: any) => setEnrolled(Boolean(data)));
  }, [user, course.id]);

  async function enrol() {
    setBusy(true);
    setError('');
    try {
      const result = await startCourseCheckout({
        data: { slug: course.slug, region, origin: window.location.origin },
      });
      if (result.status === 'redirect' && result.url) {
        window.location.href = result.url;
        return;
      }
      await navigate({ to: '/learning/$slug', params: { slug: course.slug } });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'We could not start checkout. Please try again.');
      setBusy(false);
    }
  }

  return (
    <PortalPage eyebrow={course.school ?? 'ACADEMY'} title={course.title} intro={course.summary ?? ''} icon={GraduationCap}>
      <p className="portal-muted">
        <Link to="/portal/student/catalogue">← Back to courses</Link>
      </p>

      <section className="portal-section">
        <div className="portal-section-title">
          <h2>Enrol</h2>
        </div>
        <div className="card-panel">
          <p className="price">{formatPrice(course.prices)}</p>
          {intl && (
            <p className="price-alt">
              or {intl.currency} {intl.amount.toLocaleString()} outside Nigeria
            </p>
          )}
          {intl && !enrolled && (
            <div className="filter-chips">
              <button type="button" className={region === 'NG' ? 'chip is-active' : 'chip'} onClick={() => setRegion('NG')}>
                Pay in Nigeria
              </button>
              <button
                type="button"
                className={region === 'INTL' ? 'chip is-active' : 'chip'}
                onClick={() => setRegion('INTL')}
              >
                Pay from abroad
              </button>
            </div>
          )}
          {enrolled ? (
            <Link className="button" to="/learning/$slug" params={{ slug: course.slug }}>
              Continue learning
            </Link>
          ) : (
            <button className="button" onClick={enrol} disabled={busy}>
              {busy ? 'Starting…' : 'Enrol now'}
            </button>
          )}
          {error && <p className="form-error">{error}</p>}
          <ul className="plain-list">
            <li>
              <Clock size={15} /> Self-paced lessons
            </li>
            <li>
              <ListChecks size={15} /> Final assessment and reviewed project
            </li>
            <li>
              <BadgeCheck size={15} /> Signed certificate after review
            </li>
          </ul>
        </div>
      </section>

      {objectives.length > 0 && (
        <section className="portal-section">
          <div className="portal-section-title">
            <h2>What you will learn</h2>
          </div>
          <ul className="tick-list">
            {objectives.map((o) => (
              <li key={o}>
                <CheckCircle2 size={18} /> {o}
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="portal-section">
        <div className="portal-section-title">
          <h2>Course outline</h2>
        </div>
        {course.outline.length > 0 ? (
          <ol className="outline-list">
            {course.outline.map((l) => (
              <li key={l.lesson_position}>
                <span>{String(l.lesson_position).padStart(2, '0')}</span>
                <strong>{l.lesson_title}</strong>
                {l.free_preview && <em>Free preview</em>}
              </li>
            ))}
          </ol>
        ) : (
          <p>Lessons for this course are being finalised.</p>
        )}
      </section>

      {course.project_theme && (
        <section className="portal-section">
          <div className="portal-section-title">
            <h2>Assessment and certificate</h2>
          </div>
          <p>
            After the lessons you sit a final assessment, then submit a practical project: {course.project_theme}
          </p>
        </section>
      )}
    </PortalPage>
  );
}
