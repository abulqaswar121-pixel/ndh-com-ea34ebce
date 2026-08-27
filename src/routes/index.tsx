import { createFileRoute } from '@tanstack/react-router';
import { ArrowUpRight, Boxes, BrainCircuit, CheckCircle2, Sparkles } from 'lucide-react';
import { PageShell, Button } from '@/components/PageShell';
import { Reveal } from '@/components/Reveal';

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
    ],
  }),
  component: Home,
});

const pillars = [
  ['Digital delivery', 'Brand, product, web, media and growth work guided by a project manager.', Boxes],
  ['AI skills', 'Short courses built around an AI exam, a reviewed project and a certificate.', BrainCircuit],
  ['Clear process', 'A defined route from brief to scope, assignment, review and delivery.', CheckCircle2],
] as const;

function Home() {
  return (
    <PageShell>
      <main>
        <section className="hero home-hero">
          <div className="hero-copy">
            <p className="eyebrow">Najeeb Digital Hub</p>
            <h1>
              Build with clarity.
              <br />
              <em>Move with intent.</em>
            </h1>
            <p className="lede">
              A digital agency and AI skills academy for people building useful things.
            </p>
            <div className="actions">
              <Button to="/agency">
                Hire a team <ArrowUpRight size={16} />
              </Button>
              <Button to="/academy" secondary>
                Learn AI skills
              </Button>
            </div>
          </div>
          <Reveal delay={120}>
            <div className="hero-stage">
              <img src="/ndh-hero-new.png" alt="A designer's desk with a website layout in progress" />
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
              <img src="/ndh-agency-work.png" alt="A project team reviewing work together in a studio" />
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
                Focused courses across six AI schools. Finish the lessons, sit an AI-set exam, submit a
                project, and receive a signed certificate.
              </p>
              <Button to="/academy" secondary>
                Browse the academy <ArrowUpRight size={16} />
              </Button>
            </div>
          </Reveal>
          <Reveal delay={100}>
            <div className="split-visual">
              <img src="/ndh-academy-new.png" alt="A learner following an online AI course and taking notes" />
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
