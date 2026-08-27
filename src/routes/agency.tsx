import { createFileRoute } from '@tanstack/react-router';
import { ArrowUpRight, BarChart3, Bot, Code2, Megaphone, Palette, PenTool, Video } from 'lucide-react';
import { PageShell, PageIntro, Button } from '@/components/PageShell';
import { Reveal } from '@/components/Reveal';

const title = 'Agency — Digital delivery managed end to end | NDH';
const description =
  'Brand, product, development, content, growth, media, data and AI automation, delivered through one managed process with review before handover.';

export const Route = createFileRoute('/agency')({
  head: () => ({
    meta: [
      { title },
      { name: 'description', content: description },
      { property: 'og:title', content: title },
      { property: 'og:description', content: description },
    ],
  }),
  component: Agency,
});

const services = [
  ['Brand & identity', 'Visual systems that make a business easier to recognise.', Palette],
  ['Design & product', 'Interfaces, flows and product experiences shaped around use.', PenTool],
  ['Development', 'Web and product builds prepared for real use.', Code2],
  ['Content & writing', 'Clear words for pages, campaigns and ongoing communication.', PenTool],
  ['Marketing & growth', 'Structured campaigns and practical growth support.', Megaphone],
  ['Video & media', 'Editing, motion, photography and podcast production.', Video],
  ['Data & business', 'Dashboards and operational support for decisions.', BarChart3],
  ['AI & automation', 'AI-assisted workflows, agents and connected tools.', Bot],
] as const;

const steps = [
  ['01', 'Brief', 'Share what needs to be done.'],
  ['02', 'Scope', 'A project manager clarifies the work.'],
  ['03', 'Match', 'The right capability is assigned.'],
  ['04', 'Review', 'Work is checked before delivery.'],
] as const;

function Agency() {
  return (
    <PageShell>
      <PageIntro
        eyebrow="Agency"
        title="Digital work, with a better route through it."
        body="NDH brings digital services, project management and review into one considered delivery process."
      />
      <main className="content agency-content">
        <Reveal>
          <div className="agency-banner">
            <img src="/ndh-services-new.png" alt="A project timeline mapped out on a planning wall" />
            <div>
              <p className="eyebrow">The NDH method</p>
              <h2>Good work needs a clear path.</h2>
              <p>Start with the brief. Shape the scope. Match the work. Review before delivery.</p>
            </div>
          </div>
        </Reveal>

        <Reveal>
          <section>
            <div className="section-heading">
              <p className="eyebrow">Service areas</p>
              <h2>Bring us the work you need to move.</h2>
            </div>
            <div className="service-grid">
              {services.map(([name, text, Icon]) => (
                <article className="service-card" key={name}>
                  <Icon size={22} />
                  <h3>{name}</h3>
                  <p>{text}</p>
                  <ArrowUpRight size={18} className="card-arrow" />
                </article>
              ))}
            </div>
          </section>
        </Reveal>

        <Reveal>
          <section className="process-section">
            <div className="section-heading">
              <p className="eyebrow">How we work</p>
              <h2>Four steps, no guesswork.</h2>
            </div>
            <div className="process-row">
              {steps.map(([n, heading, text]) => (
                <div key={n}>
                  <span>{n}</span>
                  <h3>{heading}</h3>
                  <p>{text}</p>
                </div>
              ))}
            </div>
          </section>
        </Reveal>

        <Reveal>
          <div className="cta-panel">
            <p className="eyebrow">Next step</p>
            <h2>Book a free scoping call.</h2>
            <p>Thirty minutes to understand the work and outline a route through it.</p>
            <div className="actions">
              <Button to="/contact">
                Book a scoping call <ArrowUpRight size={16} />
              </Button>
            </div>
          </div>
        </Reveal>
      </main>
    </PageShell>
  );
}
