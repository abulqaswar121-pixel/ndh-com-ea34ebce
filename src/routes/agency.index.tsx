import { createFileRoute, Link } from '@tanstack/react-router';
import { ArrowUpRight, BarChart3, BadgeCheck, Bot, Code2, Megaphone, Palette, PenTool, Video } from 'lucide-react';
import { PageShell, PageIntro, Button } from '@/components/PageShell';
import { Reveal } from '@/components/Reveal';
import { listCaseStudies, listTestimonials } from '@/lib/catalog.functions';

const title = 'Agency — Digital delivery managed end to end | NDH';
const description =
  'Brand, product, development, content, growth, media, data and AI automation, delivered through one managed process with review before handover.';

export const Route = createFileRoute('/agency/')({
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
    const [studies, testimonials] = await Promise.all([listCaseStudies(), listTestimonials()]);
    return { studies, testimonials };
  },
  errorComponent: () => (
    <PageShell>
      <main className="content">
        <h1>Agency</h1>
        <p>Some content could not be loaded. Please refresh the page.</p>
      </main>
    </PageShell>
  ),
  component: Agency,
});

const services = [
  ['brand-identity', 'Brand & identity', 'Visual systems that make a business easier to recognise.', Palette],
  ['design-product', 'Design & product', 'Interfaces, flows and product experiences shaped around use.', PenTool],
  ['development', 'Development', 'Web and product builds prepared for real use.', Code2],
  ['content-writing', 'Content & writing', 'Clear words for pages, campaigns and ongoing communication.', PenTool],
  ['marketing-growth', 'Marketing & growth', 'Structured campaigns and practical growth support.', Megaphone],
  ['video-media', 'Video & media', 'Editing, motion, photography and podcast production.', Video],
  ['data-business', 'Data & business', 'Dashboards and operational support for decisions.', BarChart3],
  ['ai-automation', 'AI & automation', 'AI-assisted workflows, agents and connected tools.', Bot],
] as const;

const steps = [
  ['01', 'Brief', 'Share what needs to be done.'],
  ['02', 'Scope', 'A project manager clarifies the work.'],
  ['03', 'Match', 'The right capability is assigned.'],
  ['04', 'Review', 'Work is checked before delivery.'],
] as const;

function Agency() {
  const { studies, testimonials } = Route.useLoaderData();
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
            <img src="/ndh-services-new.png" alt="A project timeline mapped out on a planning wall" width={1280} height={960} loading="lazy" decoding="async" />
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
            <Rail label="Service areas">
              {services.map(([slug, name, text, Icon]) => (
                <Link className="service-card" key={slug} to="/agency/$slug" params={{ slug }}>
                  <Icon size={22} />
                  <h3>{name}</h3>
                  <p>{text}</p>
                  <ArrowUpRight size={18} className="card-arrow" />
                </Link>
              ))}
            </Rail>
          </section>
        </Reveal>

        <Reveal>
          <section className="process-section">
            <div className="section-heading">
              <p className="eyebrow">How we work</p>
              <h2>Four steps, no guesswork.</h2>
            </div>
            <Rail label="How we work" className="process-row-rail">
              {steps.map(([n, heading, text]) => (
                <div className="step-card" key={n}>
                  <span className="step-number">{n}</span>
                  <h3>{heading}</h3>
                  <p>{text}</p>
                </div>
              ))}
            </Rail>
          </section>
        </Reveal>

        {studies.length > 0 && (
          <Reveal>
            <section>
              <div className="section-heading">
                <p className="eyebrow">Selected work</p>
                <h2>Real projects, delivered and verified.</h2>
                <p>Every project below is live work built, authored or managed by NDH — no hypothetical metrics.</p>
              </div>
              <Rail label="Selected work">
                {studies.slice(0, 6).map((s) => (
                  <Link className="service-card" key={s.slug} to="/work">
                    <BadgeCheck size={22} />
                    <h3>{s.title}</h3>
                    <p>{s.category ?? s.summary}</p>
                    <ArrowUpRight size={18} className="card-arrow" />
                  </Link>
                ))}
              </Rail>
              {testimonials.length > 0 && (
                <div className="testimonial-block">
                  <div className="section-heading">
                    <p className="eyebrow">Client &amp; stakeholder verification</p>
                    <h2>What our clients say.</h2>
                  </div>
                  <Rail label="Client testimonials">
                    {testimonials.slice(0, 3).map((t) => (
                      <blockquote className="testimonial-card" key={t.id}>
                        {t.badge && <p className="badge-pill">{t.badge}</p>}
                        <p>&ldquo;{t.quote}&rdquo;</p>
                        <footer>
                          {t.author_name}
                          {t.company ? ` — ${t.company}` : ''}
                        </footer>
                      </blockquote>
                    ))}
                  </div>
                </div>
              )}
            </section>
          </Reveal>
        )}

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
