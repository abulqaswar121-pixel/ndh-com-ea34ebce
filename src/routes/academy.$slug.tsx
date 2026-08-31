import { createFileRoute, Link, notFound } from '@tanstack/react-router';
import { BadgeCheck, CheckCircle2, Clock, GraduationCap, ListChecks } from 'lucide-react';
import { PageShell } from '@/components/PageShell';
import { Reveal } from '@/components/Reveal';
import { getCourse } from '@/lib/catalog.functions';
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
        { name: 'twitter:card', content: 'summary_large_image' },
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

function CoursePage() {
  const course = Route.useLoaderData();
  const objectives = (course.learning_objectives ?? '')
    .split('\n')
    .map((s) => s.trim())
    .filter(Boolean);
  const intl = course.prices.find((p) => p.region !== 'NG');

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
                <ul className="course-meta">
                  <li>
                    <Clock size={16} /> Self-paced
                  </li>
                  <li>
                    <ListChecks size={16} /> Final assessment
                  </li>
                  <li>
                    <BadgeCheck size={16} /> Signed certificate
                  </li>
                </ul>
              </header>
            </Reveal>

            {objectives.length > 0 && (
              <Reveal>
                <section className="course-section">
                  <h2>What you will learn</h2>
                  <ul className="tick-list">
                    {objectives.map((o) => (
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
                  <p>
                    Lessons for this course are being finalised. Enrol now to get access the moment they are
                    published.
                  </p>
                )}
              </section>
            </Reveal>

            <Reveal>
              <section className="course-section">
                <h2>Assessment and certificate</h2>
                <p>
                  When you finish the lessons you sit a final assessment covering the material, then submit a
                  practical project: {course.project_theme}
                </p>
                <p>
                  Your project is reviewed by the Academy team. Once it is approved, a signed certificate with a
                  unique verification number is issued to your account.
                </p>
              </section>
            </Reveal>

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
              <Link to="/signup" className="button">
                Enrol now
              </Link>
              <Link to="/login" className="button button-secondary">
                Sign in to continue
              </Link>
              <ul className="plain-list">
                <li>
                  <GraduationCap size={15} /> Lifetime access to the lessons
                </li>
                <li>Final assessment and reviewed project included</li>
                <li>Certificate issued after review</li>
              </ul>
            </div>
          </aside>
        </div>
      </main>
    </PageShell>
  );
}
