import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ArrowUpRight, Search } from "lucide-react";
import { ACADEMY_SNAPSHOT, ACADEMY_SCHOOLS, BUSINESS_PROFILES } from "@/lib/business-profiles";
import { PageShell, PageIntro } from "@/components/PageShell";
import { Reveal } from "@/components/Reveal";
import { Rail } from "@/components/Rail";
import { listCourses, listStudentVoices } from "@/lib/catalog.functions";
import { formatPrice } from "@/lib/format";
import academyLearning from "@/assets/academy-learning.jpg";
import { courseImage, schoolImage } from "@/lib/topic-images";

const title = "Academy — Practical AI courses and certification | NDH";
const description = BUSINESS_PROFILES.academy.tagline;

export const Route = createFileRoute("/academy/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:image", content: "https://ndh.com.ng/og-image.png" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: "https://ndh.com.ng/og-image.png" },
    ],
    links: [{ rel: "canonical", href: "https://ndh.com.ng/academy" }],
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
  const [query, setQuery] = useState("");
  const [school, setSchool] = useState("All");

  const schools = useMemo(
    () => ["All", ...Array.from(new Set(courses.map((c) => c.school).filter(Boolean) as string[]))],
    [courses],
  );

  const filtered = useMemo(
    () =>
      courses.filter(
        (c) =>
          (school === "All" || c.school === school) &&
          (query.trim() === "" ||
            `${c.title} ${c.summary ?? ""}`.toLowerCase().includes(query.trim().toLowerCase())),
      ),
    [courses, school, query],
  );

  return (
    <PageShell>
      <PageIntro
        eyebrow="Academy"
        title="Learn a practical AI skill, then prove it."
        body={BUSINESS_PROFILES.academy.description}
        image={academyLearning}
        imageAlt="Learner working through an online course"
      />
      <main className="content" id="courses">
        <section className="card-panel official-academy-scope">
          <p className="eyebrow">Official Academy scope</p>
          <h2>
            {ACADEMY_SNAPSHOT.courses} courses across {ACADEMY_SNAPSHOT.schools} specialized
            schools.
          </h2>
          <p>
            Structured video lessons, pre-project readiness quizzes, capstone deliverables and
            signed, cryptographically verifiable certificates.
          </p>
          <ul>
            {ACADEMY_SCHOOLS.map((item) => (
              <li key={item.name}>
                <strong>{item.name}</strong> — {item.topics}
              </li>
            ))}
          </ul>
          <p>
            The catalogue below is the selection currently mirrored on this gateway, not the
            complete 60-course offering. Visit the official Academy for the full scope and current
            availability.
          </p>
          <div className="official-profile-links">
            <a href="https://academy.ndh.com.ng">Open the official Academy ↗</a>
            <Link to="/verify">Verify a certificate ↗</Link>
          </div>
        </section>
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
                  className={s === school ? "chip is-active" : "chip"}
                  onClick={() => setSchool(s)}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </Reveal>

        <p className="catalog-count">
          {filtered.length}{" "}
          {filtered.length === 1
            ? "course in this gateway selection"
            : "courses in this gateway selection"}
        </p>

        {filtered.length === 0 ? (
          <div className="empty-card">No courses match that search yet.</div>
        ) : (
          <div className="course-grid">
            {filtered.map((c, i) => (
              <Reveal key={c.id} delay={(i % 3) * 60}>
                <Link
                  to="/academy/$slug"
                  params={{ slug: c.slug }}
                  className="course-card course-card-link"
                >
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
      </main>
    </PageShell>
  );
}
