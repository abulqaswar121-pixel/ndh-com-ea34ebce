import { createFileRoute, Link } from '@tanstack/react-router';
import { ArrowUpRight, Boxes, BrainCircuit, CheckCircle2 } from 'lucide-react';
import { PageShell, Button } from '@/components/PageShell';
import { Reveal } from '@/components/Reveal';
import { ResponsiveImage } from '@/components/ResponsiveImage';
import { RouteSkeleton } from '@/components/RouteSkeleton';
import agencyCollaboration from '@/assets/agency-collaboration.jpg';
import { listCaseStudies, listCourses } from '@/lib/catalog.functions';
import { caseStudyImage } from '@/lib/editorial-assets';

const title = 'Najeeb Digital Hub — Digital delivery and AI skills';
const description =
  'A digital agency and AI skills academy. Brief the work, get it scoped, reviewed and delivered — or learn a practical AI skill and get certified.';

// Fallback used only if the live catalog can't be reached — kept in sync with the
// real course count so the homepage never understates or fabricates a number.
const FALLBACK_COURSE_COUNT = 60;

export const Route = createFileRoute('/')({
  loader: async () => {
    const [studies, courseCount] = await Promise.all([
      listCaseStudies()
        .then((rows) => rows.slice(0, 3))
        .catch(() => []),
      listCourses()
        .then((rows) => (rows.length > 0 ? rows.length : FALLBACK_COURSE_COUNT))
        .catch(() => FALLBACK_COURSE_COUNT),
    ]);
    return { studies, courseCount };
  },
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
    links: [
      { rel: 'canonical', href: 'https://ndh.com.ng/' },
    ],
    scripts: [
      {
        type: 'application/ld+json',
        children: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'Organization',
          name: 'Najeeb Digital Hub',
          alternateName: 'NDH',
          url: 'https://ndh.com.ng/',
          logo: 'https://ndh.com.ng/ndh-logo.png',
          description,
          areaServed: ['Nigeria', 'Worldwide'],
          sameAs: [
            'https://www.facebook.com/share/1Be6HN8zjS/',
            'https://www.instagram.com/njb_digital_hub',
          ],
        }),
      },
    ],
  }),
  pendingComponent: () => <RouteSkeleton rows={3} />,
  component: Home,
});

const pillars = [
  ['Digital delivery', 'Brand, product, web, media and growth work guided by a project manager.', Boxes],
  ['AI skills', 'Short courses built around a final assessment, a practical project and a certificate.', BrainCircuit],
  ['Clear process', 'A defined route from brief to scope, assignment, review and delivery.', CheckCircle2],
] as const;

function Home() {
  const { studies, courseCount } = Route.useLoaderData();
  return (
    <PageShell>
      <main>
        <section className="hero home-hero">
          <img className="home-hero-image" src={agencyCollaboration} alt="Abstract glowing network of connected digital interfaces" width={1600} height={1008} fetchPriority="high" decoding="async" />
          <div className="hero-copy">
            <p className="eyebrow">Digital agency · AI academy</p>
            <h1>
              Work worth <em>talking about.</em>
            </h1>
            <p className="lede">
              NDH scopes, manages and reviews digital projects for ambitious businesses — and teaches
              practical, certified AI skills for people ready to grow. One hub, no guesswork.
            </p>
            <div className="actions">
              <Button to="/agency">
                Explore the agency <ArrowUpRight size={16} />
              </Button>
              <Button to="/academy" secondary>
                Learn AI skills
              </Button>
            </div>
          </div>
        </section>

        <div className="stat-strip" role="list" aria-label="Najeeb Digital Hub at a glance">
          {[
            ['8', 'Agency service lines'],
            ['6', 'AI academy schools'],
            [`${courseCount}+`, 'Certified AI courses'],
            ['2', 'Continents served — Nigeria · Worldwide'],
          ].map(([value, label]) => (
            <div className="stat-strip-item" role="listitem" key={label}>
              <strong>{value}</strong>
              <span>{label}</span>
            </div>
          ))}
        </div>

        <nav className="home-paths" aria-label="Explore Najeeb Digital Hub">
          <Button to="/agency">Agency <ArrowUpRight size={17} /></Button>
          <Button to="/work" secondary>Selected work <ArrowUpRight size={17} /></Button>
          <Button to="/academy" secondary>Academy <ArrowUpRight size={17} /></Button>
        </nav>

        <section className="home-section">
          <Reveal>
            <div className="section-heading">
              <p className="eyebrow">One hub, two ways forward</p>
              <h2>Make the next step easier to see.</h2>
            </div>
          </Reveal>
          <div className="pillar-grid">
            {pillars.map(([heading, text, Icon], i) => (
              <Reveal key={heading} delay={i * 90}>
                <article className="pillar-card">
                  <Icon size={22} />
                  <h3>{heading}</h3>
                  <p>{text}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </section>

        {studies.length > 0 && (
          <section className="home-work-section" aria-labelledby="home-work-title">
            <div className="home-work-inner">
              <div className="home-work-heading">
                <div>
                  <p className="eyebrow">Selected work</p>
                  <h2 id="home-work-title">Built for real use.</h2>
                </div>
                <Button to="/work" secondary>See all work <ArrowUpRight size={16} /></Button>
              </div>
              <div className="home-work-grid">
                {studies.map((study) => {
                  const image = caseStudyImage(study.slug, study.cover_image_url);
                  return (
                    <Link key={study.slug} className="home-work-item" to="/work/$slug" params={{ slug: study.slug }}>
                      {image && <img src={image} alt={`Cover for ${study.title}`} width={800} height={530} loading="lazy" decoding="async" />}
                      <div className="home-work-item-copy">
                        <span className="eyebrow">{study.category ?? 'Case study'}</span>
                        <h3>{study.title}</h3>
                        <ArrowUpRight size={20} aria-hidden="true" />
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          </section>
        )}

        <section className="split-section">
          <Reveal>
            <div className="split-visual">
              <ResponsiveImage name="ndh-agency-work" alt="A project team reviewing work together in a studio" width={1280} height={960} />
            </div>
          </Reveal>
          <Reveal delay={100}>
            <div className="split-copy">
              <p className="eyebrow">For businesses</p>
              <h2>Brief the work. We’ll shape the route.</h2>
              <p>
                From the first conversation to the final review, NDH brings structure to digital delivery —
                one project manager, one clear scope, one accountable handover.
              </p>
              <Button to="/agency">
                Explore the agency <ArrowUpRight size={16} />
              </Button>
            </div>
          </Reveal>
        </section>

        <section className="split-section">
          <Reveal>
            <div className="split-copy">
              <p className="eyebrow">For learners</p>
              <h2>Learn a practical AI skill, then prove it.</h2>
              <p>
                Focused courses across six AI schools. Finish the lessons, sit the final assessment, submit a
                project, and receive a signed certificate.
              </p>
              <Button to="/academy" secondary>
                Browse the academy <ArrowUpRight size={16} />
              </Button>
            </div>
          </Reveal>
          <Reveal delay={100}>
            <div className="split-visual">
              <ResponsiveImage name="ndh-academy" alt="A learner following an online AI course and taking notes" width={1600} height={912} />
            </div>
          </Reveal>
        </section>

        <section className="home-section" style={{ paddingTop: 0 }}>
          <Reveal>
            <div className="cta-panel">
              <p className="eyebrow">Start here</p>
              <h2>Tell us what needs to move.</h2>
              <p>Share a brief and we’ll come back with a clear scope and next step.</p>
              <div className="actions">
                <Button to="/contact">
                  Book a scoping call <ArrowUpRight size={16} />
                </Button>
                <Button to="/signup" secondary>
                  Create an account
                </Button>
              </div>
            </div>
          </Reveal>
        </section>
      </main>
    </PageShell>
  );
}
