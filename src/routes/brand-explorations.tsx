import { createFileRoute, Link } from '@tanstack/react-router';
import { useState } from 'react';
import { ArrowLeft, ArrowUpRight, BookOpen, BriefcaseBusiness, HeartPulse, Plane, TrendingUp, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

const title = 'NDH Brand Family Explorations — Najeeb Digital Hub';
const description = 'Compare three visual logo systems for Najeeb Digital Hub and its expanding family of businesses.';

export const Route = createFileRoute('/brand-explorations')({
  head: () => ({ meta: [
    { title }, { name: 'description', content: description },
    { property: 'og:title', content: title }, { property: 'og:description', content: description },
    { property: 'og:type', content: 'website' }, { name: 'twitter:card', content: 'summary' },
  ] }),
  component: BrandExplorations,
});

const businesses = [
  { name: 'Agency', Icon: BriefcaseBusiness, state: 'Current' },
  { name: 'Academy', Icon: BookOpen, state: 'Current' },
  { name: 'Venture', Icon: TrendingUp, state: 'Planned' },
  { name: 'Travel', Icon: Plane, state: 'Future' },
  { name: 'iHospital', Icon: HeartPulse, state: 'Future' },
] as const;

const directions = [
  { number: '01', name: 'Dual badge', idea: 'The NDH symbol stays untouched; a second, smaller badge identifies the business.', className: 'dual' },
  { number: '02', name: 'Integrated corner', idea: 'Each business icon sits inside one shared architectural frame.', className: 'integrated' },
  { number: '03', name: 'Linear signature', idea: 'A compact symbol leads the name; the business identity sits on the same line.', className: 'linear' },
] as const;

type Business = (typeof businesses)[number];
type Direction = (typeof directions)[number];

function MasterSymbol({ className = '' }: { className?: string }) {
  return <svg className={`brand-lab-symbol ${className}`} viewBox="0 0 96 96" fill="none" aria-hidden="true">
    <path d="M12 76V20h16l40 40V20h16v56H68L28 36v40H12Z" fill="currentColor" />
    <path d="M12 20h16l40 40V20" stroke="var(--lab-glint)" strokeWidth="3" strokeLinejoin="round" opacity=".72" />
  </svg>;
}

function Identity({ direction, business, parent = false }: { direction: Direction; business?: Business; parent?: boolean }) {
  const Icon = business?.Icon;
  return <div className={`brand-lab-identity ${direction.className}${parent ? ' parent' : ''}`}>
    <div className="brand-lab-symbol-group">
      <span className="brand-lab-master"><MasterSymbol /></span>
      {Icon && <span className="brand-lab-sector"><Icon aria-hidden="true" strokeWidth={1.8} /></span>}
    </div>
    <div className="brand-lab-identity-text">
      <strong>NAJEEB <span>DIGITAL HUB</span></strong>
      {business && <small>NDH {business.name.toUpperCase()}</small>}
      {parent && <small>THE PARENT BRAND</small>}
    </div>
  </div>;
}

function BrandExplorations() {
  const [dark, setDark] = useState(false);
  return <main className={`brand-lab${dark ? ' brand-lab-dark' : ''}`}>
    <div className="brand-lab-container">
      <header className="brand-lab-header">
        <Link to="/" className="brand-lab-back"><ArrowLeft size={17} /> Back to NDH</Link>
        <span className="brand-lab-header-label">NDH / Identity studies</span>
        <Button variant="outline" size="sm" onClick={() => setDark(value => !value)} aria-pressed={dark}>
          {dark ? 'View on light' : 'View on dark'}
        </Button>
      </header>

      <div className="brand-lab-intro">
        <p className="brand-lab-kicker">Brand family / Exploration 01</p>
        <h1>One family.<br /><em>Many futures.</em></h1>
        <p>Three ways to connect Najeeb Digital Hub to every business it grows into. One colour language across them all; a distinct icon for each sector.</p>
      </div>

      <div className="brand-lab-index" aria-label="The three directions">
        {directions.map((direction) => <a href={`#direction-${direction.number}`} key={direction.number}>
          <span>{direction.number} / {direction.name}</span><ArrowUpRight size={16} aria-hidden="true" />
        </a>)}
      </div>

      {directions.map((direction) => <section className="brand-lab-direction" id={`direction-${direction.number}`} key={direction.number} aria-labelledby={`heading-${direction.number}`}>
        <div className="brand-lab-direction-heading">
          <span className="brand-lab-number">{direction.number}</span>
          <div><h2 id={`heading-${direction.number}`}>{direction.name}</h2><p>{direction.idea}</p></div>
        </div>
        <div className="brand-lab-master-display">
          <div className="brand-lab-display-meta"><span>01 / Parent identity</span><span>ndh.com.ng</span></div>
          <Identity direction={direction} parent />
        </div>
        <div className="brand-lab-family-heading"><h3>One system, five expressions</h3><span>Same palette · shared symbol · sector-specific icon</span></div>
        <div className="brand-lab-grid">
          {businesses.map((business) => <div className="brand-lab-tile" key={business.name}>
            <div className="brand-lab-tile-meta"><span>{business.state}</span><span>NDH / {business.name}</span></div>
            <Identity direction={direction} business={business} />
          </div>)}
          <div className="brand-lab-tile brand-lab-tile-future">
            <div className="brand-lab-tile-meta"><span>Expandable</span><span>NDH / Next</span></div>
            <div className="brand-lab-add"><Plus size={22} /><span>Room for what comes next</span></div>
          </div>
        </div>
      </section>)}
      <footer className="brand-lab-footer"><span>Explorations only — the existing NDH logo and live businesses have not been changed.</span><Link to="/">Return to NDH <ArrowUpRight size={16} /></Link></footer>
    </div>
  </main>;
}