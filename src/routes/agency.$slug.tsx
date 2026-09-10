import { createFileRoute, notFound } from '@tanstack/react-router';
import { ArrowUpRight } from 'lucide-react';
import { PageShell, PageIntro, Button } from '@/components/PageShell';
import { Reveal } from '@/components/Reveal';

const services: Record<
  string,
  { name: string; tagline: string; body: string[]; includes: string[] }
> = {
  'brand-identity': {
    name: 'Brand & identity',
    tagline: 'Visual systems that make a business easier to recognise.',
    body: [
      'A brand is judged in seconds. We design identity systems — logo, colour, type and voice — that stay consistent everywhere your business shows up.',
      'Every identity project ends with a practical brand guide your team and vendors can actually use, not just a folder of logo files.',
    ],
    includes: [
      'Logo and identity design',
      'Colour, typography and usage system',
      'Brand voice and messaging',
      'Brand guidelines document',
      'Social and print-ready asset kits',
    ],
  },
  'design-product': {
    name: 'Design & product',
    tagline: 'Interfaces, flows and product experiences shaped around use.',
    body: [
      'We design interfaces and journeys around the people using them — from first wireframe to polished, development-ready screens.',
      'Designs are delivered with clear specs and components so development moves without guesswork.',
    ],
    includes: [
      'UX research and user flows',
      'Wireframes and prototypes',
      'UI design systems',
      'Website and app interface design',
      'Design handoff with specs',
    ],
  },
  development: {
    name: 'Development',
    tagline: 'Web and product builds prepared for real use.',
    body: [
      'We build fast, reliable websites and web products — marketing sites, portals, dashboards and custom tools — engineered for real traffic and real users.',
      'Every build is reviewed, tested on real devices and handed over with documentation.',
    ],
    includes: [
      'Marketing and corporate websites',
      'Web applications and portals',
      'E-commerce and payments',
      'CMS and content-managed sites',
      'Maintenance and support plans',
    ],
  },
  'content-writing': {
    name: 'Content & writing',
    tagline: 'Clear words for pages, campaigns and ongoing communication.',
    body: [
      'Good content sounds like your business on its best day. We write copy and content that is clear, persuasive and consistent with your brand voice.',
      'From single pages to ongoing editorial calendars, we keep the words working.',
    ],
    includes: [
      'Website and landing page copy',
      'Blog and editorial content',
      'Email and campaign writing',
      'Product and sales material',
      'Editing and content refresh',
    ],
  },
  'marketing-growth': {
    name: 'Marketing & growth',
    tagline: 'Structured campaigns and practical growth support.',
    body: [
      'We plan and run campaigns with clear goals, clear budgets and clear reporting — search, social and email working together instead of in silos.',
      'You see what was spent, what it produced and what happens next.',
    ],
    includes: [
      'Campaign strategy and planning',
      'Search and social advertising',
      'Email marketing and automation',
      'Analytics and conversion tracking',
      'Monthly reporting and iteration',
    ],
  },
  'video-media': {
    name: 'Video & media',
    tagline: 'Editing, motion, photography and podcast production.',
    body: [
      'From short social clips to full podcast production, we produce media that holds attention and fits the platform it lives on.',
      'Editing, motion graphics, sound and colour — handled end to end.',
    ],
    includes: [
      'Video editing and post-production',
      'Motion graphics and animation',
      'Podcast production',
      'Product and brand photography',
      'Social media video packages',
    ],
  },
  'data-business': {
    name: 'Data & business',
    tagline: 'Dashboards and operational support for decisions.',
    body: [
      'We turn scattered numbers into dashboards and reports that answer real questions — sales, operations, marketing and finance.',
      'Beyond reporting, we support the operational work that keeps the numbers moving.',
    ],
    includes: [
      'Business dashboards and reporting',
      'Data cleanup and organisation',
      'Sales and operations analytics',
      'Process documentation',
      'Virtual operations support',
    ],
  },
  'ai-automation': {
    name: 'AI & automation',
    tagline: 'AI-assisted workflows, agents and connected tools.',
    body: [
      'We identify the repetitive work slowing your team down and automate it — connecting your tools and adding AI where it genuinely saves time.',
      'Every automation is documented and handed over so you are never locked in.',
    ],
    includes: [
      'Workflow automation',
      'AI assistants and chat agents',
      'Tool and data integrations',
      'Document and report generation',
      'Automation audit and roadmap',
    ],
  },
};

export const Route = createFileRoute('/agency/$slug')({
  loader: ({ params }) => {
    const service = services[params.slug];
    if (!service) throw notFound();
    return { service };
  },
  head: ({ loaderData, params }) => {
    const s = loaderData?.service;
    const title = s ? `${s.name} — NDH Agency` : 'Service — NDH Agency';
    const description = s?.tagline ?? 'Digital services delivered through one managed process.';
    return {
      meta: [
        { title },
        { name: 'description', content: description },
        { property: 'og:title', content: title },
        { property: 'og:description', content: description },
        { property: 'og:type', content: 'article' },
        { name: 'twitter:card', content: 'summary' },
        ...(s ? [] : [{ name: 'robots', content: 'noindex' }]),
      ],
    };
  },
  component: ServiceDetail,
});

function ServiceDetail() {
  const { service } = Route.useLoaderData();

  return (
    <PageShell>
      <PageIntro eyebrow="Agency service" title={service.name} body={service.tagline} />
      <main className="content prose service-detail">
        <Reveal>
          {service.body.map((p) => (
            <p key={p.slice(0, 24)}>{p}</p>
          ))}
          <h2>What is included</h2>
          <ul>
            {service.includes.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </Reveal>
        <Reveal>
          <div className="cta-panel">
            <p className="eyebrow">Next step</p>
            <h2>Talk through your {service.name.toLowerCase()} project.</h2>
            <p>Book a free scoping call — thirty minutes to outline the work and the route through it.</p>
            <div className="actions">
              <Button to="/contact">
                Book a scoping call <ArrowUpRight size={16} />
              </Button>
              <Button to="/agency" secondary>
                All services
              </Button>
            </div>
          </div>
        </Reveal>
      </main>
    </PageShell>
  );
}
