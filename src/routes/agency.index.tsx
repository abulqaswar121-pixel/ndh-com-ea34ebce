import { createFileRoute, Link } from '@tanstack/react-router';
import { ArrowUpRight, BarChart3, BadgeCheck, Bot, Code2, Megaphone, Palette, PenTool, Video } from 'lucide-react';
import { PageShell, PageIntro, Button } from '@/components/PageShell';
import { Reveal } from '@/components/Reveal';
import { Rail } from '@/components/Rail';
import { listCaseStudies, listTestimonials } from '@/lib/catalog.functions';
import agencyCollaboration from '@/assets/agency-collaboration.jpg';
import projectDelivery from '@/assets/project-delivery.jpg';
import { caseStudyImage } from '@/lib/editorial-assets';
import { serviceImage } from '@/lib/topic-images';

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
            <img src={agencyCollaboration} alt="A creative team reviewing digital work together" width={1600} height={1008} loading="lazy" decoding="async" />
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
              {services.map(([slug, name, text, Icon]) => (
                <Link className="service-card" key={slug} to="/agency/$slug" params={{ slug }}>
                  {serviceImage(slug) && (
                    <img
                      className="service-card-media"
                      src={serviceImage(slug)!.url}
                      alt={serviceImage(slug)!.alt}
                      width={1400}
                      height={933}
                      loading="lazy"
                      decoding="async"
                    />
                  )}
                  <Icon size={22} />
                  <h3>{name}</h3>
                  <p>{text}</p>
                  <ArrowUpRight size={18} className="card-arrow" />
                </Link>
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
            <Rail label="How we work" className="process-row-rail" autoPlay>
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
              <img
                className="selected-work-visual"
                src={projectDelivery}
                alt="An editorial view of interface planning and digital project delivery"
                width={1600}
                height={1008}
                loading="lazy"
                decoding="async"
              />
              <div className="featured-work-list">
                {studies.slice(0, 6).map((s) => (
                  <Link className="featured-work-item" key={s.slug} to="/work/$slug" params={{ slug: s.slug }}>
                    {caseStudyImage(s.slug, s.cover_image_url) && <img src={caseStudyImage(s.slug, s.cover_image_url) ?? ''} alt="" width={160} height={110} loading="lazy" decoding="async" />}
                    <div>
                      <span className="featured-work-verified"><BadgeCheck size={14} /> Verified project</span>
                      <h3>{s.title}</h3>
                      <p>{s.category ?? s.summary}</p>
                    </div>
                  </Link>
                ))}
              </div>
              {testimonials.length > 0 && (
                <div className="testimonial-block">
                  <div className="section-heading">
                    <p className="eyebrow">Client &amp; stakeholder verification</p>
                    <h2>What our clients say.</h2>
                  </div>
                  <Rail label="Client testimonials" className="testimonial-rail" autoPlay autoPlayInterval={4000}>
                    {testimonials.slice(0, 10).map((t) => {
                      const portrait = testimonialPortrait(t.author_name, t.avatar_url);
                      return (
                      <blockquote className="testimonial-card" key={t.id}>
                        <span className="testimonial-quote-mark" aria-hidden="true">“</span>
                        {t.service_area && <span className="testimonial-service">{t.service_area}</span>}
                        <p>{t.quote}</p>
                        <div className="testimonial-person">
                          {portrait ? <img className="testimonial-avatar" src={portrait} alt={`${t.author_name} portrait`} width={48} height={48} loading="lazy" decoding="async" /> : <span className="testimonial-avatar testimonial-initials" aria-hidden="true">{t.author_name.split(/\s+/).map((part) => part[0]).join('').slice(0, 2).toUpperCase()}</span>}
                          <span><strong>{t.author_name}</strong><small>{[t.author_role !== t.author_name ? t.author_role : null, t.company].filter(Boolean).join(' · ') || 'NDH client'}</small></span>
                          {t.badge && <span className="testimonial-badge"><BadgeCheck size={14} /> {t.badge}</span>}
                        </div>
                      </blockquote>
                    ))}
                  </Rail>
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
