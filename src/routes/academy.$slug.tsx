import { createFileRoute, Link, notFound, useNavigate } from '@tanstack/react-router';
import { useState } from 'react';
import { BadgeCheck, CheckCircle2, Clock, GraduationCap, ListChecks, Lock, PlayCircle, Star } from 'lucide-react';
import { PageShell } from '@/components/PageShell';
import { Reveal } from '@/components/Reveal';
import { getCourse } from '@/lib/catalog.functions';
import { startCourseCheckout } from '@/lib/payment.functions';
import { useAuth } from '@/lib/auth';
import { formatPrice } from '@/lib/format';

export const Route = createFileRoute('/academy/$slug')({
  loader: async ({ params }) => {
    const course = await getCourse({ data: { slug: params.slug } });
    if (!course) throw notFound();
    return course;
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return { meta: [{ title: 'Course unavailable — NDH Academy' }, { name: 'robots', content: 'noindex' }] };
    }
    const t = `${loaderData.title} — NDH Academy`;
    const d = loaderData.summary ?? 'A practical AI course with a final assessment, project and certificate.';
    return {
      meta: [
        { title: t },
        { name: 'description', content: d },
        { property: 'og:title', content: t },
        { property: 'og:description', content: d },
        { property: 'og:type', content: 'article' },
        { property: 'og:image', content: 'https://ndh.com.ng/og-image.png' },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:image', content: 'https://ndh.com.ng/og-image.png' },
      ],
    };
  },
  errorComponent: () => (
    <PageShell>
      <main className="content">
        <h1>Course unavailable</h1>
        <p>We could not load this course. Please refresh or return to the catalog.</p>
        <Link className="button" to="/academy">
          Back to courses
        </Link>
      </main>
    </PageShell>
  ),
  notFoundComponent: () => (
    <PageShell>
      <main className="content">
        <h1>Course not found</h1>
        <p>This course is no longer listed.</p>
        <Link className="button" to="/academy">
          Browse all courses
        </Link>
      </main>
    </PageShell>
  ),
  component: CoursePage,
});

function watchTime(seconds: number) {
  if (!seconds) return null;
  const minutes = Math.round(seconds / 60);
  if (minutes < 60) return `${minutes} min of video`;
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  return `${hours}h ${rest ? `${rest}m` : ''} of video`.trim();
}

function CoursePage() {
  const course = Route.useLoaderData();
  const intl = course.prices.find((p) => p.region !== 'NG');
  const duration = watchTime(course.total_seconds);
  const lockedCount = course.outline.filter((l) => !l.free_preview).length;

  return (
    <PageShell>
      <main className="content course-detail">
        <nav className="crumbs">
          <Link to="/academy">Academy</Link>
          <span>/</span>
          <span>{course.school}</span>
        </nav>

        <div className="course-detail-grid">
          <div>
            <Reveal>
              <header className="course-hero">
                <span className="tag">{course.school}</span>
                <h1>{course.title}</h1>
                <p className="lede">{course.summary}</p>
                {course.rating.count >= 3 ? (
                  <p className="course-rating">
                    <Star size={16} /> {Number(course.rating.average).toFixed(1)} from {course.rating.count} students
                  </p>
                ) : (
                  <p className="course-rating">
                    <Star size={16} /> New course
                  </p>
                )}
                <ul className="course-meta">
                  <li>
                    <ListChecks size={16} /> {course.lesson_count} lessons
                  </li>
                  {duration && (
                    <li>
                      <PlayCircle size={16} /> {duration}
                    </li>
                  )}
                  <li>
                    <Clock size={16} /> Self-paced
                  </li>
                  <li>
                    <BadgeCheck size={16} /> Signed certificate
                  </li>
                </ul>
              </header>
            </Reveal>

            {course.intro && (
              <Reveal>
                <section className="course-section">
                  <h2>About this course</h2>
                  {course.intro
                    .split('\n')
                    .filter(Boolean)
                    .map((p) => (
                      <p key={p}>{p}</p>
                    ))}
                </section>
              </Reveal>
            )}

            {course.outcomes.length > 0 && (
              <Reveal>
                <section className="course-section">
                  <h2>What you will be able to do</h2>
                  <ul className="tick-list">
                    {course.outcomes.map((o) => (
                      <li key={o}>
                        <CheckCircle2 size={18} /> {o}
                      </li>
                    ))}
                  </ul>
                </section>
              </Reveal>
            )}

            <Reveal>
              <section className="course-section">
                <h2>Course outline</h2>
                {course.outline.length > 0 ? (
                  <>
                    <ol className="outline-list">
                      {course.outline.map((l) => (
                        <li key={l.position} className={l.free_preview ? '' : 'is-locked'}>
                          <span>{String(l.position).padStart(2, '0')}</span>
                          <strong>{l.free_preview ? l.title : <i className="locked-bar" aria-hidden />}</strong>
                          {l.free_preview ? (
                            <em>Free preview</em>
                          ) : (
                            <em>
                              <Lock size={13} /> Locked
                            </em>
                          )}
                        </li>
                      ))}
                    </ol>
                    <p className="muted-note">
                      {lockedCount} lessons, the full project brief and the grading rubric unlock when you enrol.
                    </p>
                  </>
                ) : (
                  <p>Lessons for this course are being finalised. Enrol to get access as soon as they publish.</p>
                )}
              </section>
            </Reveal>

            <Reveal>
              <section className="course-section">
                <h2>Assessment and certificate</h2>
                <p>
                  After the lessons you take a readiness quiz on the material. Pass it and your practical project brief
                  is released, graded against {course.rubric_count || 'a'} clear criteria by the Academy team.
                </p>
                <p>
                  Once your project is approved, a signed certificate with a unique verification number is issued to
                  your account.
                </p>
              </section>
            </Reveal>

            {course.testimonials.length > 0 && (
              <Reveal>
                <section className="course-section">
                  <h2>What students say</h2>
                  <div className="voice-grid">
                    {course.testimonials.map((t) => (
                      <figure className="voice-card" key={t.id}>
                        <blockquote>{t.quote}</blockquote>
                        <figcaption>
                          <strong>{t.display_name}</strong>
                          {t.role_label && <span>{t.role_label}</span>}
                          <em>Verified student</em>
                        </figcaption>
                      </figure>
                    ))}
                  </div>
                </section>
              </Reveal>
            )}

            <Reveal>
              <section className="course-section">
                <h2>Requirements</h2>
                <ul className="plain-list">
                  <li>A laptop or phone with a reliable internet connection.</li>
                  <li>No prior experience required — each course starts from the fundamentals.</li>
                  <li>Free versions of the tools covered are enough to complete the project.</li>
                </ul>
              </section>
            </Reveal>
          </div>

          <aside className="course-buy">
            <div className="card-panel">
              <p className="price">{formatPrice(course.prices)}</p>
              {intl && (
                <p className="price-alt">
                  or {intl.currency} {intl.amount.toLocaleString()} outside Nigeria
                </p>
              )}
              <EnrolActions slug={course.slug} hasIntlPrice={Boolean(intl)} />
              <ul className="plain-list">
                <li>
                  <GraduationCap size={15} /> Lifetime access to {course.lesson_count} lessons
                </li>
                <li>Readiness quiz and reviewed project included</li>
                <li>Certificate issued after review</li>
              </ul>
            </div>
          </aside>
        </div>
      </main>
    </PageShell>
  );
}

function EnrolActions({ slug, hasIntlPrice }: { slug: string; hasIntlPrice: boolean }) {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [region, setRegion] = useState<'NG' | 'INTL'>('NG');

  async function enrol() {
    setBusy(true);
    setError('');
    try {
      const result = await startCourseCheckout({ data: { slug, region, origin: window.location.origin } });
      if (result.status === 'redirect' && result.url) {
        window.location.href = result.url;
        return;
      }
      await navigate({ to: '/learning/$slug', params: { slug } });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'We could not start checkout. Please try again.');
      setBusy(false);
    }
  }

  if (loading) {
    return (
      <button className="button" disabled>
        Loading…
      </button>
    );
  }

  if (!user) {
    return (
      <>
        <Link to="/signup" className="button">
          Create an account to enrol
        </Link>
        <Link to="/login" className="button button-secondary">
          Sign in to continue
        </Link>
      </>
    );
  }

  return (
    <>
      {hasIntlPrice && (
        <div className="region-toggle">
          <button type="button" className={region === 'NG' ? 'is-active' : ''} onClick={() => setRegion('NG')}>
            Pay in Nigeria
          </button>
          <button type="button" className={region === 'INTL' ? 'is-active' : ''} onClick={() => setRegion('INTL')}>
            Pay internationally
          </button>
        </div>
      )}
      <button className="button" onClick={() => void enrol()} disabled={busy}>
        {busy ? 'Starting checkout…' : 'Enrol now'}
      </button>
      <Link to="/portal/student" className="button button-secondary">
        Go to my learning
      </Link>
      {error && <p className="form-error">{error}</p>}
    </>
  );
}
