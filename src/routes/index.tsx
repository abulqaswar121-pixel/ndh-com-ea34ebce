import { createFileRoute } from '@tanstack/react-router';
import { ArrowUpRight, Boxes, BrainCircuit, CheckCircle2, Sparkles } from 'lucide-react';
import { PageShell, Button } from '@/components/PageShell';
import { Reveal } from '@/components/Reveal';
import { ResponsiveImage } from '@/components/ResponsiveImage';

const title = 'Najeeb Digital Hub — Digital delivery and AI skills';
const description =
  'A digital agency and AI skills academy. Brief the work, get it scoped, reviewed and delivered — or learn a practical AI skill and get certified.';

export const Route = createFileRoute('/')({
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
      { rel: 'preload', as: 'image', href: '/images/ndh-hero-640.avif', fetchPriority: 'high' },
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
  component: Home,
});

const pillars = [
  ['Digital delivery', 'Brand, product, web, media and growth work guided by a project manager.', Boxes],
  ['AI skills', 'Short courses built around a final assessment, a practical project and a certificate.', BrainCircuit],
  ['Clear process', 'A defined route from brief to scope, assignment, review and delivery.', CheckCircle2],
] as const;

function Home() {
  return (
    <PageShell>
      <main>
        <section className="hero home-hero">
          <div className="hero-copy">
            <p className="eyebrow">Digital agency · AI academy</p>
            <h1>
              Digital work,
              <br />
              <em>sharply delivered.</em>
            </h1>
            <p className="lede">
              NDH scopes, manages and reviews digital projects for ambitious businesses — with practical AI skills for people ready to grow.
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
          <Reveal delay={120}>
            <div className="hero-stage">
              <ResponsiveImage name="ndh-hero" alt="A designer's desk with a website layout in progress" width={1280} height={960} priority sizes="(max-width: 760px) 100vw, 52vw" />
              <div className="stage-note">
                <Sparkles size={16} />
                <span>Ideas into useful work</span>
              </div>
            </div>
          </Reveal>
        </section>

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
