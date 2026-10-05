import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowDown, ArrowRight, ArrowUpRight } from "lucide-react";
import { NdhFamilySymbol } from "@/components/NdhFamilySymbol";
import {
  EcosystemDirectory,
  type DirectoryFilter,
} from "@/components/ecosystem/EcosystemDirectory";
import { FamilyFooter } from "@/components/ecosystem/FamilyFooter";
import { SITE_CONTACT } from "@/lib/site-contact";
import { FamilyMenu } from "@/components/ecosystem/FamilyMenu";
import { LiveStatusBar } from "@/components/ecosystem/LiveStatusBar";
import { WhyNdhBento } from "@/components/ecosystem/WhyNdhBento";
import { useI18n } from "@/lib/preferences";
import { LIVE_SUBSIDIARY_COUNT, NETWORK_COUNTRIES, SUBSIDIARIES } from "@/lib/ecosystem";

const title = "Najeeb Digital Hub | The NDH Family of Businesses";
const description =
  "A family of Nigerian-born businesses spanning digital services, practical AI education, digital products, school technology, ventures, travel and healthcare.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
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
          areaServed: NETWORK_COUNTRIES,
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
            name: subsidiary.domain,
            url: `https://${subsidiary.domain}`,
          })),
        }),
      },
    ],
  }),
  component: Home,
});

const QUICK_PATHS: { labelKey: string; filter: DirectoryFilter }[] = [
  { labelKey: "home.paths.build", filter: "enterprise" },
  { labelKey: "home.paths.learn", filter: "education" },
  { labelKey: "home.paths.tools", filter: "ventures" },
  { labelKey: "home.paths.services", filter: "infrastructure" },
];

function Home() {
  const { t } = useI18n();
  const [filter, setFilter] = useState<DirectoryFilter>("all");

  function jumpTo(filterId: DirectoryFilter) {
    setFilter(filterId);
    if (typeof document !== "undefined") {
      document.getElementById("businesses")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  return (
    <div className="ecosystem-page gw-page">
      <a className="gw-skip" href="#top">
        {t("nav.skip")}
      </a>

      <header className="ecosystem-header gw-header">
        <a className="ecosystem-brand" href="#top" aria-label="Najeeb Digital Hub home">
          <NdhFamilySymbol />
          <span>
            <strong>NAJEEB</strong>
            <small>DIGITAL HUB</small>
          </span>
        </a>

        <nav className="gw-nav" aria-label={t("nav.menu")}>
          <FamilyMenu
            links={[
              { label: t("nav.businesses"), href: "#businesses" },
              { label: t("nav.approach"), href: "#why" },
              { label: t("nav.status"), href: "#status" },
              { label: t("nav.about"), href: "/about" },
              { label: t("nav.blog"), href: "/blog" },
              { label: t("nav.contact"), href: "/contact" },
            ]}
            cta={{ label: t("nav.talkToUs"), href: "/contact" }}
          />
          {/* Section links sit on the left, next to the menu, so the header
              reads brand → navigation → action instead of one crowded row.
              At ≤900px they step into the dropdown above. */}
          <a className="gw-nav-link" href="#businesses">
            {t("nav.businesses")}
          </a>
          <a className="gw-nav-link" href="#why">
            {t("nav.approach")}
          </a>
          <a className="gw-nav-link" href="#status">
            {t("nav.status")}
          </a>
        </nav>

        <a className="ecosystem-header-link gw-header-cta" href="/contact">
          {t("nav.talkToUs")} <ArrowUpRight size={15} aria-hidden="true" />
        </a>
      </header>

      <main id="top">
        <div className="gw-band gw-band-hero">
          <section className="ecosystem-hero gw-hero">
            <div className="ecosystem-hero-art" aria-hidden="true">
              <NdhFamilySymbol />
            </div>
            <div className="ecosystem-hero-inner">
              <p className="ecosystem-kicker gw-kicker">
                {t("home.hero.kicker")} <span /> {t("home.hero.origin")}
              </p>
              <h1>
                {t("home.hero.titleTop")}
                <br />
                {t("home.hero.titleBottom")}
                <span className="ecosystem-hero-period">.</span>
              </h1>
              <p className="ecosystem-hero-lead">{t("home.hero.lead")}</p>
              <p className="ecosystem-hero-detail">{t("home.hero.detail")}</p>

              <div className="gw-hero-badges">
                <span className="gw-hero-badge">
                  <b>{LIVE_SUBSIDIARY_COUNT}</b> {t("home.hero.badgeLive")}
                </span>
                <span className="gw-hero-badge">
                  <b>{SUBSIDIARIES.length}</b> {t("home.hero.badgeBrands")}
                </span>
                <span className="gw-hero-badge">
                  <b>{NETWORK_COUNTRIES.length}</b> {t("home.hero.badgeCountries")}
                </span>
              </div>

              <div className="ecosystem-hero-actions">
                <a className="ecosystem-primary-link" href="#businesses">
                  {t("home.hero.primary")} <ArrowUpRight size={18} />
                </a>
                <a className="ecosystem-secondary-link" href="#why">
                  {t("nav.approach")} <ArrowDown size={16} />
                </a>
              </div>
            </div>
            <div className="ecosystem-hero-bottom" aria-hidden="true">
              <span>{t("home.hero.footerLeft")}</span>
              <span>{t("home.hero.scroll")} ↓</span>
            </div>
          </section>
        </div>

        {/* Pure white strip: where to start, as a row of quick paths. */}
        <div className="gw-band gw-band-white" id="explore">
          <section className="ecosystem-paths gw-paths" aria-label={t("home.paths.title")}>
            <p className="gw-paths-title">{t("home.paths.title")}</p>
            <div className="gw-paths-grid">
              {QUICK_PATHS.map((path, index) => (
                <button
                  type="button"
                  className="gw-path"
                  key={path.labelKey}
                  onClick={() => jumpTo(path.filter)}
                >
                  <span className="gw-path-index" aria-hidden="true">{`0${index + 1}`}</span>
                  <span className="gw-path-label">{t(path.labelKey as never)}</span>
                  <ArrowUpRight size={16} aria-hidden="true" />
                </button>
              ))}
            </div>
          </section>
        </div>

        {/* Light porcelain: the full directory of businesses. */}
        <div className="gw-band gw-band-porcelain">
          <EcosystemDirectory filter={filter} onFilterChange={setFilter} />
        </div>

        {/* White: the family argument, then the numbers behind it. */}
        <div className="gw-band gw-band-white">
          <WhyNdhBento />
        </div>

        <div className="gw-band gw-band-porcelain">
          <LiveStatusBar />
        </div>

        {/* White section holding the one dark island: the idea behind NDH. */}
        <div className="gw-band gw-band-white">
          <section
            className="ecosystem-about gw-section"
            id="purpose"
            aria-labelledby="gw-purpose-heading"
          >
            <div className="gw-panel gw-foundation">
              <div className="gw-foundation-intro">
                <p className="gw-eyebrow">{t("home.foundation.eyebrow")}</p>
                <h2 id="gw-purpose-heading">{t("home.foundation.title")}</h2>
              </div>
              <div className="gw-foundation-body">
                <p>{t("home.foundation.p1")}</p>
                <p>{t("home.foundation.p2")}</p>
                <a className="gw-inline-link" href="#businesses">
                  {t("home.foundation.cta")} <ArrowRight size={16} aria-hidden="true" />
                </a>
              </div>
              <ul className="gw-pillars">
                {(["pillar1", "pillar2", "pillar3"] as const).map((pillar) => (
                  <li key={pillar}>
                    <h3>{t(`home.foundation.${pillar}.title` as never)}</h3>
                    <p>{t(`home.foundation.${pillar}.body` as never)}</p>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        </div>

        <div className="gw-band gw-band-porcelain">
          <section
            className="ecosystem-cta gw-section gw-section-last"
            aria-labelledby="gw-cta-heading"
          >
            <div className="gw-panel gw-cta">
              <div>
                <h2 id="gw-cta-heading">{t("home.cta.title")}</h2>
                <p>{t("home.cta.body")}</p>
              </div>
              <div className="gw-cta-actions">
                <a className="gw-button gw-button-primary" href="/contact">
                  {t("nav.talkToUs")} <ArrowUpRight size={16} aria-hidden="true" />
                </a>
                <a className="gw-button gw-button-ghost" href="#businesses">
                  {t("home.hero.primary")} <ArrowUpRight size={15} aria-hidden="true" />
                </a>
              </div>
            </div>
          </section>
        </div>
      </main>

      <FamilyFooter />
    </div>
  );
}
