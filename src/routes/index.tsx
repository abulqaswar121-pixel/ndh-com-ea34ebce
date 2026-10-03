import { createFileRoute } from '@tanstack/react-router';
import { ArrowDown, ArrowUpRight, BookOpen, BriefcaseBusiness, HeartPulse, Plane, School, ShoppingBag, TrendingUp } from 'lucide-react';
import { NdhFamilySymbol } from '@/components/NdhFamilySymbol';

const title = 'Najeeb Digital Hub — One brand, many possibilities';
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

const businesses = [
  { name: 'Agency', description: 'Digital products, brand, media and growth work delivered through a clear managed process.', Icon: BriefcaseBusiness, href: 'https://ndhagency.lovable.app', state: 'Live' },
  { name: 'Academy', description: 'Practical AI skills, assessments, projects and certificates for ambitious learners.', Icon: BookOpen, href: 'https://ndhacademy.lovable.app', state: 'Live' },
  { name: 'Venture', description: 'A home for ideas, investments and businesses built for long-term value.', Icon: TrendingUp, href: 'https://ndhventure.lovable.app', state: 'Live' },
  { name: 'eStore', description: 'A growing commerce destination for useful products and digital essentials.', Icon: ShoppingBag, href: 'https://ndhestore.lovable.app', state: 'Live' },
  { name: 'SchoolDesk', description: 'A focused digital workspace for schools, staff, learners and families.', Icon: School, href: 'https://ndhschooldesk.lovable.app', state: 'Live' },
  { name: 'Travel', description: 'Thoughtful travel planning and experiences, being prepared for what comes next.', Icon: Plane, state: 'Coming soon' },
  { name: 'iHospital', description: 'A future healthcare platform designed around clearer access and coordination.', Icon: HeartPulse, state: 'Coming soon' },
] as const;

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
          <a href="#about">Our vision</a>
        </nav>
        <a className="ecosystem-header-link" href="#businesses">Explore NDH <ArrowDown size={15} /></a>
      </header>

      <main id="top">
        <section className="ecosystem-hero">
          <div className="ecosystem-hero-copy">
            <p className="ecosystem-kicker">Najeeb Digital Hub · Nigeria to the world</p>
            <h1>One brand.<br /><span>Many possibilities.</span></h1>
            <p>NDH is a growing family of businesses built to help people learn, create, operate and move forward.</p>
            <a className="ecosystem-primary-link" href="#businesses">Discover our businesses <ArrowDown size={18} /></a>
          </div>
          <div className="ecosystem-hero-symbol">
            <span className="ecosystem-orbit ecosystem-orbit-one" />
            <span className="ecosystem-orbit ecosystem-orbit-two" />
            <NdhFamilySymbol />
            <p>Shared vision<br /><strong>Distinct businesses</strong></p>
          </div>
        </section>

        <section className="ecosystem-directory" id="businesses" aria-labelledby="businesses-heading">
          <div className="ecosystem-section-heading">
            <div><p className="ecosystem-kicker">The NDH family</p><h2 id="businesses-heading">Built for different parts of life.</h2></div>
            <p>Each business carries the same foundation, with its own expertise, team and purpose.</p>
          </div>
          <div className="ecosystem-grid">
            {businesses.map(({ name, description: businessDescription, Icon, href, state }) => {
              const content = <>
                <div className="ecosystem-card-top"><NdhFamilySymbol SectorIcon={Icon} /><span>{state}</span></div>
                <div><p className="ecosystem-card-label">NDH</p><h3>{name}</h3><p>{businessDescription}</p></div>
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

        <section className="ecosystem-about" id="about">
          <p className="ecosystem-kicker">Our shared foundation</p>
          <div><h2>Different industries.<br />One standard.</h2><p>Every NDH business is shaped by useful technology, clear service and long-term thinking. The symbol is the link: one identity that remains recognisable wherever the family grows.</p></div>
        </section>
      </main>

      <footer className="ecosystem-footer">
        <div className="ecosystem-brand"><NdhFamilySymbol /><span><strong>NAJEEB</strong><small>DIGITAL HUB</small></span></div>
        <p>Building useful businesses for a changing world.</p>
        <span>© {new Date().getFullYear()} NDH</span>
      </footer>
    </div>
  );
}
