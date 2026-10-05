import { createFileRoute, Link } from '@tanstack/react-router';
import { useState } from 'react';
import { ArrowLeft, ArrowUpRight, BookOpen, BriefcaseBusiness, HeartPulse, Plane, Sprout, Plus, ShoppingBag, School } from 'lucide-react';
import { Button } from '@/components/ui/button';
import gatewayLogo from '@/assets/ndh-logo-gateway-cropped.png';

const title = 'NDH Brand Family Explorations — Najeeb Digital Hub';
const description = 'Preview a non-letter gateway symbol in the selected integrated badge for the NDH family of businesses.';

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
  { name: 'AgriCapital', Icon: Sprout, state: 'Current' },
  { name: 'eStore', Icon: ShoppingBag, state: 'Current' },
  { name: 'SchoolDesk', Icon: School, state: 'Coming Soon' },
  { name: 'Travel', Icon: Plane, state: 'Coming Soon' },
  { name: 'iHospital', Icon: HeartPulse, state: 'Coming Soon' },
] as const;

type Business = (typeof businesses)[number];

function Identity({ business, parent = false }: { business?: Business; parent?: boolean }) {
  const Icon = business?.Icon;
  return <div className={`brand-lab-identity integrated${parent ? ' parent' : ''}`}>
    <div className="brand-lab-symbol-group">
      <span className="gateway-badge">
        <img src={gatewayLogo} alt="" width={684} height={679} loading="lazy" />
        {Icon && <span className="gateway-sector"><Icon aria-hidden="true" strokeWidth={2} /></span>}
      </span>
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
         <p className="brand-lab-kicker">Brand family / Integrated badge</p>
         <h1>One family.<br /><em>Many futures.</em></h1>
         <p>A gateway with an open centre represents possibility without spelling a letter. Each business carries the same symbol with its own icon set into the corner.</p>
      </div>

       <section className="brand-lab-direction" id="direction-02" aria-labelledby="heading-02">
        <div className="brand-lab-direction-heading">
           <span className="brand-lab-number">02</span>
           <div><h2 id="heading-02">Open Gateway · Integrated badge</h2><p>The master symbol stays consistent; each business icon is fitted into its corner.</p></div>
        </div>
        <div className="brand-lab-master-display">
          <div className="brand-lab-display-meta"><span>01 / Parent identity</span><span>ndh.com.ng</span></div>
           <Identity parent />
        </div>
        <div className="brand-lab-family-heading"><h3>One system, seven expressions</h3><span>Same palette · shared symbol · sector-specific icon</span></div>
        <div className="brand-lab-grid">
          {businesses.map((business) => <div className="brand-lab-tile" key={business.name}>
            <div className="brand-lab-tile-meta"><span>{business.state}</span><span>NDH / {business.name}</span></div>
             <Identity business={business} />
          </div>)}
          <div className="brand-lab-tile brand-lab-tile-future">
            <div className="brand-lab-tile-meta"><span>Expandable</span><span>NDH / Next</span></div>
            <div className="brand-lab-add"><Plus size={22} /><span>Room for what comes next</span></div>
          </div>
        </div>
       </section>
       <footer className="brand-lab-footer"><span>The Open Gateway identity is now on the NDH parent homepage. Subsidiary websites remain independent.</span><Link to="/">Return to NDH <ArrowUpRight size={16} /></Link></footer>
    </div>
  </main>;
}