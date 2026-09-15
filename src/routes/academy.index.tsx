import { createFileRoute, Link } from '@tanstack/react-router';
import { useMemo, useState } from 'react';
import { ArrowUpRight, Search } from 'lucide-react';
import { PageShell, PageIntro } from '@/components/PageShell';
import { Reveal } from '@/components/Reveal';
import { Rail } from '@/components/Rail';
import { listCourses, listStudentVoices } from '@/lib/catalog.functions';
import { formatPrice } from '@/lib/format';
import academyLearning from '@/assets/academy-learning.jpg';

const title = 'Academy — Practical AI courses and certification | NDH';
const description =
  'Short, self-serve AI courses across six schools. Each course ends with a final assessment, a practical project and a signed certificate.';

export const Route = createFileRoute('/academy/')({
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
  }),
  loader: async () => {
    const [courses, voices] = await Promise.all([listCourses(), listStudentVoices()]);
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
  component: Academy,
});

function Academy() {
  const { courses, voices } = Route.useLoaderData();
  const [query, setQuery] = useState('');
  const [school, setSchool] = useState('All');

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
      />
      <Reveal>
        <div className="academy-visual">
          <img
            src={academyLearning}
            alt="A learner taking notes during an online course"
            width={1600}
            height={1008}
            loading="lazy"
            decoding="async"
          />
        </div>
      </Reveal>
      <main className="content">
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
      </main>
    </PageShell>
  );
}
