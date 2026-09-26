import { createFileRoute, Link } from '@tanstack/react-router';
import { useEffect, useMemo, useState } from 'react';
import { ArrowUpRight, Search } from 'lucide-react';
import { PageShell, PageIntro, Button } from '@/components/PageShell';
import { Reveal } from '@/components/Reveal';
import { Rail } from '@/components/Rail';
import { RouteSkeleton } from '@/components/RouteSkeleton';
import { listCourses, listStudentVoices } from '@/lib/catalog.functions';
import { formatPrice } from '@/lib/format';
import academyLearning from '@/assets/academy-learning.jpg';
import { courseImage, schoolImage } from '@/lib/topic-images';
import { academyMenu } from '@/lib/nav-data';

const title = 'Academy — Practical AI courses and certification | NDH';
const description =
  'Short, self-serve AI courses across six schools. Each course ends with a final assessment, a practical project and a signed certificate.';

export const Route = createFileRoute('/academy/')({
  validateSearch: (search: Record<string, unknown>): { school?: string } =>
    typeof search.school === 'string' ? { school: search.school } : {},
  head: () => ({
    meta: [
      { title },
      { name: 'description', content: description },
      { property: 'og:title', content: title },
      { property: 'og:description', content: description },
      { property: 'og:type', content: 'website' },
      { property: 'og:image', content: 'https://ndh.com.ng/og-image.png' },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:image', content: 'https://ndh.com.ng/og-image.png' },
    ],
    links: [{ rel: 'canonical', href: 'https://ndh.com.ng/academy' }],
  }),
  loader: async () => {
    const [courses, voices] = await Promise.all([
      listCourses().catch(() => []),
      listStudentVoices().catch(() => []),
    ]);
    return { courses, voices };
  },
  errorComponent: () => (
    <PageShell>
      <main className="content">
        <h1>Courses are unavailable</h1>
        <p>We could not load the catalog just now. Please refresh the page.</p>
      </main>
    </PageShell>
  ),
  pendingComponent: () => <RouteSkeleton rows={6} />,
  component: Academy,
});

const certificationSteps = [
  ['01', 'Enrol', 'Pick a course and get instant access to the lessons.'],
  ['02', 'Learn', 'Work through short, practical video lessons at your own pace.'],
  ['03', 'Assess', 'Sit the final assessment and submit a practical project.'],
  ['04', 'Certify', 'Pass and receive a signed, verifiable certificate.'],
] as const;

function Academy() {
  const { courses, voices } = Route.useLoaderData();
  const { school: schoolParam } = Route.useSearch();
  const [query, setQuery] = useState('');
  const [school, setSchool] = useState(schoolParam || 'All');

  // Keep the filter in sync if a deep link (mega-menu, site search, browser back/forward) changes the ?school= param.
  useEffect(() => {
    if (schoolParam) setSchool(schoolParam);
  }, [schoolParam]);

  const schools = useMemo(
    () => ['All', ...Array.from(new Set(courses.map((c) => c.school).filter(Boolean) as string[]))],
    [courses],
  );

  const filtered = useMemo(
    () =>
      courses.filter(
        (c) =>
          (school === 'All' || c.school === school) &&
          (query.trim() === '' ||
            `${c.title} ${c.summary ?? ''}`.toLowerCase().includes(query.trim().toLowerCase())),
      ),
    [courses, school, query],
  );

  return (
    <PageShell>
      <PageIntro
        eyebrow="Academy"
        title="Learn a practical AI skill, then prove it."
        body="Short, self-serve courses across six schools. Finish the lessons, sit the final assessment, submit a practical project and receive a signed certificate."
        image={academyLearning}
        imageAlt="Learner working through an online course"
      />
      <main className="content">
        <Reveal>
          <section className="school-section">
            <div className="section-heading">
              <p className="eyebrow">Six schools</p>
              <h2>Browse the Academy by school.</h2>
              <p>Every course sits inside one of six schools. Jump straight to the one that matches what you want to learn.</p>
            </div>
            <div className="service-grid school-grid">
              {academyMenu.map((item) => {
                const image = schoolImage(item.school);
                return (
                  <Link
                    key={item.school}
                    to="/academy"
                    search={{ school: item.school }}
                    className="service-card"
                  >
                    {image && (
                      <img
                        className="service-card-media"
                        src={image.url}
                        alt={image.alt}
                        width={1400}
                        height={933}
                        loading="lazy"
                        decoding="async"
                      />
                    )}
                    <h3>{item.school}</h3>
                    <p>{item.blurb}</p>
                    <ArrowUpRight size={18} className="card-arrow" />
                  </Link>
                );
              })}
            </div>
          </section>
        </Reveal>

        <section id="courses" className="catalog-section">
        <Reveal>
          <div className="catalog-controls">
            <div className="catalog-search">
              <Search size={16} />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search courses"
                aria-label="Search courses"
              />
            </div>
            <div className="catalog-filters">
              {schools.map((s) => (
                <button
                  key={s}
                  type="button"
                  className={s === school ? 'chip is-active' : 'chip'}
                  onClick={() => setSchool(s)}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </Reveal>

        <p className="catalog-count">
          {filtered.length} {filtered.length === 1 ? 'course' : 'courses'}
        </p>

        {filtered.length === 0 ? (
          <div className="empty-card">No courses match that search yet.</div>
        ) : (
          <div className="course-grid">
            {filtered.map((c, i) => (
              <Reveal key={c.id} delay={(i % 3) * 60}>
                <Link to="/academy/$slug" params={{ slug: c.slug }} className="course-card course-card-link">
                  {(courseImage(c.slug) ?? schoolImage(c.school)) && (
                    <img
                      className="course-card-media"
                      src={(courseImage(c.slug) ?? schoolImage(c.school))!.url}
                      alt={(courseImage(c.slug) ?? schoolImage(c.school))!.alt}
                      width={1400}
                      height={933}
                      loading="lazy"
                      decoding="async"
                    />
                  )}
                  <div className="card-top">
                    <span className="tag">{c.school}</span>
                    <ArrowUpRight size={18} />
                  </div>
                  <h3>{c.title}</h3>
                  <p>{c.summary}</p>
                  <div className="course-card-foot">
                    <strong>{formatPrice(c.prices)}</strong>
                    <span>Self-paced · Certificate</span>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        )}
        </section>

        <Reveal>
          <section className="process-section">
            <div className="section-heading">
              <p className="eyebrow">How certification works</p>
              <h2>Four steps to a signed certificate.</h2>
            </div>
            <Rail label="How certification works" className="process-row-rail" autoPlay>
              {certificationSteps.map(([n, heading, text]) => (
                <div className="step-card" key={n}>
                  <span className="step-number">{n}</span>
                  <h3>{heading}</h3>
                  <p>{text}</p>
                </div>
              ))}
            </Rail>
          </section>
        </Reveal>

        {voices.length > 0 && (
          <Reveal>
            <section className="course-section">
              <h2>What our students say</h2>
              <Rail label="Student testimonials" autoPlay>
                {voices.map((v) => (
                  <figure className="voice-card" key={v.id}>
                    <blockquote>{v.quote}</blockquote>
                    <figcaption>
                      <strong>{v.display_name}</strong>
                      {v.course_title && <span>{v.course_title}</span>}
                      <em>Verified student</em>
                    </figcaption>
                  </figure>
                ))}
              </Rail>
            </section>
          </Reveal>
        )}

        <Reveal>
          <div className="cta-panel">
            <p className="eyebrow">Ready when you are</p>
            <h2>Start a course today, get certified in weeks.</h2>
            <p>Every course ends with a real assessment, a practical project and a certificate you can verify.</p>
            <div className="actions">
              <a className="button" href="#courses">
                Browse all courses <ArrowUpRight size={16} />
              </a>
              <Button to="/verify" secondary>
                Verify a certificate
              </Button>
            </div>
          </div>
        </Reveal>
      </main>
    </PageShell>
  );
}
