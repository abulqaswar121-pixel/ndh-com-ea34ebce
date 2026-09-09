import { createFileRoute, Link } from '@tanstack/react-router';
import { useMemo, useState } from 'react';
import { ArrowUpRight, GraduationCap, Search } from 'lucide-react';
import { PortalPage } from '@/components/PortalShell';
import { listCourses } from '@/lib/catalog.functions';
import { formatPrice } from '@/lib/format';

export const Route = createFileRoute('/_authenticated/portal/student/catalogue/')({
  loader: () => listCourses(),
  errorComponent: () => (
    <div className="empty-card">We could not load the courses just now. Please refresh the page.</div>
  ),
  component: Catalogue,
});

function Catalogue() {
  const courses = Route.useLoaderData();
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
    <PortalPage
      eyebrow="ACADEMY"
      title="Browse courses"
      intro="Every published course, with pricing and full details."
      icon={GraduationCap}
    >
      <section className="portal-section">
        <div className="catalog-controls">
          <label className="catalog-search">
            <Search size={17} />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search courses"
              aria-label="Search courses"
            />
          </label>
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

        {filtered.length === 0 ? (
          <div className="empty-card">No course matches that search.</div>
        ) : (
          <div className="portal-grid">
            {filtered.map((c) => (
              <article className="portal-card" key={c.id}>
                <span className="tag">{c.school}</span>
                <h3>{c.title}</h3>
                <p>{c.summary}</p>
                <strong>{formatPrice(c.prices)}</strong>
                <Link className="button" to="/portal/student/catalogue/$slug" params={{ slug: c.slug }}>
                  View course <ArrowUpRight size={16} />
                </Link>
              </article>
            ))}
          </div>
        )}
      </section>
    </PortalPage>
  );
}
