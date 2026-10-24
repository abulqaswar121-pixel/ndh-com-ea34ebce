import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, ArrowUpRight, ShieldCheck, Sparkles, Users } from "lucide-react";
import { FamilyPage } from "@/components/ecosystem/FamilyPage";
import { BusinessCard } from "@/components/ecosystem/BusinessCard";
import { BUSINESS_PROFILES } from "@/lib/business-profiles";
import { SITE_CONTACT } from "@/lib/site-contact";
import { LIVE_SUBSIDIARY_COUNT, COMING_SUBSIDIARY_COUNT, SUBSIDIARIES, ACADEMY_SNAPSHOT } from "@/lib/ecosystem";
import heroImg from "@/assets/covers/hero.jpg";

const title = "Najeeb Digital Hub | The NDH Family of Businesses";
const description =
  "A family of Nigerian-born businesses spanning digital services, AI-skills education, farm investment and online shopping, with Mall, Cloud, SchoolOS, Express, Pay, Travel, Health and Foundation on the way.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://ndh.com.ng/" },
      { property: "og:image", content: "https://ndh-com.lovable.app/og-image.jpg" },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: "https://ndh-com.lovable.app/og-image.jpg" },
    ],
    links: [{ rel: "canonical", href: "https://ndh.com.ng/" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          name: "Najeeb Digital Hub",
          alternateName: "NDH",
          url: "https://ndh.com.ng/",
          description,
          telephone: SITE_CONTACT.telephone,
          email: SITE_CONTACT.support,
          address: {
            "@type": "PostalAddress",
            streetAddress: "Marmaron Nufawa Western Bye Pass",
            addressLocality: "Sokoto",
            addressRegion: "Sokoto",
            addressCountry: "NG",
          },
          sameAs: [
            "https://www.facebook.com/share/1Be6HN8zjS/",
            "https://www.instagram.com/njb_digital_hub",
          ],
          /* The family is published as structured data so search engines can
             discover each business from the parent domain. */
          subOrganization: SUBSIDIARIES.map((subsidiary) => ({
            "@type": "Organization",
            name: BUSINESS_PROFILES[subsidiary.id].name,
            description: BUSINESS_PROFILES[subsidiary.id].description,
            ...(subsidiary.state === "coming" ? {} : { url: subsidiary.href }),
          })),
        }),
      },
    ],
  }),
  component: Home,
});

function Home() {
  const live = SUBSIDIARIES.filter((s) => s.state !== "coming");
  const coming = SUBSIDIARIES.filter((s) => s.state === "coming");
  return (
    <FamilyPage>
      <section className="nx-hero">
        <img className="nx-hero-bg" src={heroImg} alt="" width={1600} height={912} fetchPriority="high" />
        <div className="nx-hero-shade" aria-hidden="true" />
        <div className="nx-wrap nx-hero-inner">
          <p className="nx-kicker">
            <Sparkles size={14} aria-hidden="true" /> Najeeb Digital Hub · Made in Nigeria
          </p>
          <h1>
            One family.
            <br />
            <span>Many businesses</span> built for real life.
          </h1>
          <p className="nx-hero-lead">
            From digital services and AI skills to farm investment and online shopping — every NDH
            business shares one standard of trust.
          </p>
          <div className="nx-hero-actions">
            <Link to="/businesses" className="nx-btn nx-btn-primary">
              Explore our businesses <ArrowRight size={17} />
            </Link>
            <Link to="/contact" className="nx-btn nx-btn-glass">
              Talk to us <ArrowUpRight size={16} />
            </Link>
          </div>
          <dl className="nx-hero-stats">
            <div><dt>{LIVE_SUBSIDIARY_COUNT}</dt><dd>Businesses open now</dd></div>
            <div><dt>{COMING_SUBSIDIARY_COUNT}</dt><dd>On the way</dd></div>
            <div><dt>{ACADEMY_SNAPSHOT.courses}</dt><dd>Academy courses</dd></div>
          </dl>
        </div>
      </section>

      <div className="nx-ticker" aria-label="Coming soon">
        <div className="nx-ticker-track">
          {[...coming, ...coming].map((s, i) => {
            const Icon = s.icon;
            return (
              <span key={`${s.id}-${i}`}>
                <Icon size={15} aria-hidden="true" /> {BUSINESS_PROFILES[s.id].name}
                <em>Coming soon</em>
              </span>
            );
          })}
        </div>
      </div>

      <section className="nx-section nx-porcelain">
        <div className="nx-wrap">
          <div className="nx-head">
            <div>
              <p className="nx-eyebrow">Open now</p>
              <h2>Start with what is ready today</h2>
            </div>
            <Link to="/businesses" className="nx-link">
              All {SUBSIDIARIES.length} businesses <ArrowRight size={15} />
            </Link>
          </div>
          <div className="nx-grid">
            {live.map((s) => (
              <BusinessCard key={s.id} s={s} />
            ))}
          </div>
        </div>
      </section>

      <section className="nx-section nx-white">
        <div className="nx-wrap nx-trust">
          {[
            { icon: ShieldCheck, t: "One standard of trust", b: "Every business follows the same rules for honesty, payments and support." },
            { icon: Users, t: "Real people behind it", b: "Project managers, teachers and operators — not faceless apps." },
            { icon: Sparkles, t: "Built to grow together", b: "Learn at the Academy, build with the Agency, sell on eStore." },
          ].map(({ icon: Icon, t, b }) => (
            <div className="nx-trust-item" key={t}>
              <span className="nx-trust-icon"><Icon size={20} aria-hidden="true" /></span>
              <h3>{t}</h3>
              <p>{b}</p>
            </div>
          ))}
          <Link to="/approach" className="nx-trust-more">
            Read our approach <ArrowRight size={15} />
          </Link>
        </div>
      </section>

      <section className="nx-band">
        <div className="nx-wrap nx-band-inner">
          <div>
            <h2>Not sure where to start?</h2>
            <p>Tell us what you need. We will point you to the right NDH business.</p>
          </div>
          <Link to="/contact" className="nx-btn nx-btn-primary">
            Talk to us <ArrowUpRight size={16} />
          </Link>
        </div>
      </section>
    </FamilyPage>
  );
}
