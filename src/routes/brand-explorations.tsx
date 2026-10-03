import { createFileRoute, Link } from '@tanstack/react-router';
import { useId, useState } from 'react';
import { ArrowLeft, ArrowUpRight, BookOpen, BriefcaseBusiness, HeartPulse, Plane, TrendingUp, Plus, ShoppingBag, School } from 'lucide-react';
import { Button } from '@/components/ui/button';

const title = 'NDH Brand Family Explorations — Najeeb Digital Hub';
const description = 'Preview the selected integrated-corner NDH brand family with a sculpted N inspired by the supplied reference.';

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
  { name: 'eStore', Icon: ShoppingBag, state: 'Planned' },
  { name: 'SchoolDesk', Icon: School, state: 'Planned' },
  { name: 'Travel', Icon: Plane, state: 'Future' },
  { name: 'iHospital', Icon: HeartPulse, state: 'Future' },
] as const;

const directions = [
  { number: '01', name: 'Dual badge', idea: 'The NDH symbol stays untouched; a second, smaller badge identifies the business.', className: 'dual' },
  { number: '02', name: 'Integrated corner', idea: 'Selected direction · a sculpted N anchors the family; each business gets a small sector icon.', className: 'integrated' },
  { number: '03', name: 'Linear signature', idea: 'A compact symbol leads the name; the business identity sits on the same line.', className: 'linear' },
] as const;

type Business = (typeof businesses)[number];
type Direction = (typeof directions)[number];

function MasterSymbol({ integrated = false }: { integrated?: boolean }) {
  const gradientId = useId().replace(/:/g, '');
  return <svg className="brand-lab-symbol" viewBox="0 0 100 100" fill="none" aria-hidden="true">
    {integrated ? <>
      <defs><linearGradient id={gradientId} x1="24" y1="18" x2="77" y2="85" gradientUnits="userSpaceOnUse">
        <stop stopColor="var(--lab-symbol-light)" /><stop offset=".5" stopColor="var(--lab-symbol-mid)" /><stop offset="1" stopColor="var(--lab-symbol-deep)" />
      </linearGradient></defs>
      <g fill={`url(#${gradientId})`}>
        <path d="M34 25 45 17Q50 13 55 17L69 27V61L58 52V35Q58 32 55 30L53 28Q50 26 47 28L44 30Q42 32 42 35V42L31 33V30Q31 27 34 25Z" />
        <path d="M17 40Q17 33 23 29L28 25 72 62V27L79 32Q84 36 84 43V65Q84 72 78 76L72 80 28 44V73L22 69Q16 65 16 58V40Z" />
        <path d="M31 55 42 64V69Q42 72 46 75L48 77Q50 79 52 77L56 74Q59 72 59 69V61L69 69V77L55 87Q50 91 45 87L31 77V55Z" />
      </g>
      <path d="M21 36 73 78" stroke="var(--lab-symbol-glint)" strokeWidth="1" opacity=".52" />
    </> : <>
      <path d="M12 76V20h16l40 40V20h16v56H68L28 36v40H12Z" fill="currentColor" />
      <path d="M12 20h16l40 40V20" stroke="var(--lab-glint)" strokeWidth="3" strokeLinejoin="round" opacity=".72" />
    </>}
  </svg>;
}

function Identity({ direction, business, parent = false }: { direction: Direction; business?: Business; parent?: boolean }) {
  const Icon = business?.Icon;
  return <div className={`brand-lab-identity ${direction.className}${parent ? ' parent' : ''}`}>
    <div className="brand-lab-symbol-group">
      <span className="brand-lab-master"><MasterSymbol integrated={direction.className === 'integrated'} /></span>
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
        <p className="brand-lab-kicker">Brand family / Selected direction 02</p>
        <h1>One family.<br /><em>Many futures.</em></h1>
        <p>The integrated corner now carries an architectural N inspired by your reference. Its sector icon changes for each business; the parent symbol stays consistent.</p>
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
        <div className="brand-lab-family-heading"><h3>One system, seven expressions</h3><span>Same palette · shared symbol · sector-specific icon</span></div>
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
      <footer className="brand-lab-footer"><span>Preview only — the current NDH logo and live businesses have not been changed.</span><Link to="/">Return to NDH <ArrowUpRight size={16} /></Link></footer>
    </div>
  </main>;
}