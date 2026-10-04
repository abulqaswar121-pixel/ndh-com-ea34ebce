import { createFileRoute } from '@tanstack/react-router';
import { ArrowDown, ArrowRight, ArrowUpRight, BookOpen, BriefcaseBusiness, HeartPulse, Plane, School, ShoppingBag, TrendingUp } from 'lucide-react';
import { NdhFamilySymbol } from '@/components/NdhFamilySymbol';

const title = 'Najeeb Digital Hub | The NDH Family of Businesses';
const description =
  'Discover the NDH family of businesses across digital services, education, ventures, commerce, travel, healthcare and more.';

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

type Business = { name: string; description: string; Icon: typeof BriefcaseBusiness; href?: string; state: 'Live' | 'Coming soon' };

const businesses: Business[] = [
  { name: 'Agency', description: 'Digital products, brand, media and growth work delivered through a clear managed process.', Icon: BriefcaseBusiness, href: 'https://ndhagency.lovable.app', state: 'Live' },
  { name: 'Academy', description: 'Practical AI skills, assessments, projects and certificates for ambitious learners.', Icon: BookOpen, href: 'https://ndhacademy.lovable.app', state: 'Live' },
  { name: 'Venture', description: 'A home for ideas, investments and businesses built for long-term value.', Icon: TrendingUp, href: 'https://ndhventure.lovable.app', state: 'Live' },
  { name: 'eStore', description: 'A growing commerce destination for useful products and digital essentials.', Icon: ShoppingBag, href: 'https://ndhestore.lovable.app', state: 'Live' },
  { name: 'SchoolDesk', description: 'A focused digital workspace for schools, staff, learners and families.', Icon: School, href: 'https://ndhschooldesk.lovable.app', state: 'Live' },
  { name: 'Travel', description: 'Thoughtful travel planning and experiences, being prepared for what comes next.', Icon: Plane, state: 'Coming soon' },
  { name: 'iHospital', description: 'A future healthcare platform designed around clearer access and coordination.', Icon: HeartPulse, state: 'Coming soon' },
];

function Home() {
  return (
    <div className="ecosystem-page">
      <header className="ecosystem-header">
        <a className="ecosystem-brand" href="#top" aria-label="Najeeb Digital Hub home">
          <NdhFamilySymbol />
          <span><strong>NAJEEB</strong><small>DIGITAL HUB</small></span>
        </a>
        <nav aria-label="Main navigation">
          <a href="#businesses">Businesses</a>
          <a href="#purpose">Our approach</a>
        </nav>
        <a className="ecosystem-header-link" href="#businesses">Explore the family <ArrowUpRight size={15} /></a>
      </header>

      <main id="top">
        <section className="ecosystem-hero">
          <div className="ecosystem-hero-art" aria-hidden="true"><NdhFamilySymbol /></div>
          <div className="ecosystem-hero-inner">
            <p className="ecosystem-kicker">The NDH family <span /> Founded in Nigeria · Open to the world</p>
            <h1>Najeeb<br />Digital Hub<span className="ecosystem-hero-period">.</span></h1>
            <p className="ecosystem-hero-lead">Different businesses. One ambition to make what matters work better.</p>
            <p className="ecosystem-hero-detail">From digital services and practical learning to commerce, venture building and the platforms still to come.</p>
            <div className="ecosystem-hero-actions">
              <a className="ecosystem-primary-link" href="#businesses">Explore our businesses <ArrowUpRight size={18} /></a>
              <a className="ecosystem-secondary-link" href="#purpose">Get to know NDH <ArrowDown size={16} /></a>
            </div>
          </div>
          <div className="ecosystem-hero-bottom" aria-hidden="true"><span>NDH / A growing ecosystem</span><span>Scroll to explore ↓</span></div>
        </section>

        <section className="ecosystem-paths" aria-label="Find your way into NDH">
          <div className="ecosystem-paths-inner">
            <p>WHERE CAN WE TAKE YOU?</p>
            <a href="https://ndhagency.lovable.app">Build a digital product <ArrowUpRight size={16} /></a>
            <a href="https://ndhacademy.lovable.app">Learn a practical skill <ArrowUpRight size={16} /></a>
            <a href="https://ndhschooldesk.lovable.app">Run a smarter school <ArrowUpRight size={16} /></a>
          </div>
        </section>

        <section className="ecosystem-directory" id="businesses" aria-labelledby="businesses-heading">
          <div className="ecosystem-section-heading">
            <div><p className="ecosystem-kicker">01 / Explore the ecosystem</p><h2 id="businesses-heading">One name. Many doors.</h2></div>
            <p>Find the NDH business that fits what you're here to do. Each has its own focus, united by a shared identity.</p>
          </div>
          <div className="ecosystem-grid">
            {businesses.map(({ name, description: businessDescription, Icon, href, state }) => {
              const content = <>
                <div className="ecosystem-card-top"><NdhFamilySymbol SectorIcon={Icon} /><span>{state}</span></div>
                <div><p className="ecosystem-card-label">NAJEEB DIGITAL HUB / {name.toUpperCase()}</p><h3>NDH {name}</h3><p>{businessDescription}</p></div>
                <span className="ecosystem-card-action">{href ? 'Visit business' : 'In development'} {href ? <ArrowUpRight size={17} /> : null}</span>
              </>;
              return href ? <a className="ecosystem-card" href={href} key={name}>{content}</a> : <article className="ecosystem-card ecosystem-card-muted" key={name}>{content}</article>;
            })}
            <article className="ecosystem-card ecosystem-card-next">
              <span className="ecosystem-plus">+</span>
              <div><p className="ecosystem-card-label">The next chapter</p><h3>More to come.</h3><p>The system is designed to grow with every new NDH business.</p></div>
            </article>
          </div>
        </section>

        <section className="ecosystem-about" id="purpose">
          <div className="ecosystem-about-intro"><p className="ecosystem-kicker">02 / The idea behind NDH</p><h2>Built to move<br /><em>things forward.</em></h2></div>
          <div className="ecosystem-about-body"><p>NDH brings focused businesses under one roof. Some help you make things. Some help you learn. Others help you run everyday life more effectively.</p><p>The work is different. The belief behind it is the same: useful ideas deserve to become useful experiences.</p><a href="#businesses">Find your next step <ArrowRight size={17} /></a></div>
        </section>
      </main>

      <footer className="ecosystem-footer">
        <div className="ecosystem-brand"><NdhFamilySymbol /><span><strong>NAJEEB</strong><small>DIGITAL HUB</small></span></div>
        <p>One family. A world of possibility.</p>
        <span>© {new Date().getFullYear()} NDH</span>
      </footer>
    </div>
  );
}
