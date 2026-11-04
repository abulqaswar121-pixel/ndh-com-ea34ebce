import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  ArrowUpRight,
  BadgeCheck,
  Layers,
  Newspaper,
  Rocket,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";
import { FamilyPage } from "@/components/ecosystem/FamilyPage";
import { BusinessCard } from "@/components/ecosystem/BusinessCard";
import { BUSINESS_PROFILES } from "@/lib/business-profiles";
import { SITE_CONTACT } from "@/lib/site-contact";
import {
  LIVE_SUBSIDIARY_COUNT,
  COMING_SUBSIDIARY_COUNT,
  SUBSIDIARIES,
  LIVE_SUBSIDIARIES,
  COMING_SUBSIDIARIES,
  ACADEMY_SNAPSHOT,
} from "@/lib/ecosystem";
import { NEWS_POSTS, formatNewsDate } from "@/lib/news";
import { BRAND } from "@/lib/brand";
import heroImg from "@/assets/covers/hero-1280.webp";
import heroImgSmall from "@/assets/covers/hero-640.webp";

const title = "NAJEEB DIGITAL HUB (NDH) | One Gateway. Twelve Businesses.";
const description =
  "NDH is Nigeria's Open Gateway to digital business: Academy, Agency, ShopOS, SchoolOS and FarmFund are live today, with Mall, Cloud, Express, Pay, Travel, Health and Foundation in development.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: `${BRAND.url}/` },
      { property: "og:image", content: "https://ndhnet.com/og-image.jpg" },
      {
        property: "og:image:alt",
        content: "NAJEEB DIGITAL HUB (NDH) — One Gateway. Five Live Platforms.",
      },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: "https://ndhnet.com/og-image.jpg" },
      {
        name: "twitter:image:alt",
        content: "NAJEEB DIGITAL HUB (NDH) — One Gateway. Five Live Platforms.",
      },
    ],
    links: [{ rel: "canonical", href: `${BRAND.url}/` }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          name: BRAND.displayName,
          alternateName: BRAND.shortName,
          url: `${BRAND.url}/`,
          description,
          email: BRAND.email,
          telephone: SITE_CONTACT.telephone,
          address: {
            "@type": "PostalAddress",
            streetAddress: "Marmaron Nufawa Western Bye Pass",
            addressLocality: "Sokoto",
            addressRegion: "Sokoto",
            addressCountry: "NG",
          },
          sameAs: [SITE_CONTACT.facebook, SITE_CONTACT.instagram, SITE_CONTACT.whatsapp],
          subOrganization: SUBSIDIARIES.map((subsidiary) => ({
            "@type": "Organization",
            name: BUSINESS_PROFILES[subsidiary.id].name,
            description: BUSINESS_PROFILES[subsidiary.id].role,
            ...(subsidiary.state === "live" ? { url: subsidiary.href } : {}),
          })),
        }),
      },
    ],
  }),
  component: Home,
});

function Home() {
  const latest = [...NEWS_POSTS]
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt))
    .slice(0, 3);

  return (
    <FamilyPage>
      {/* ---------------------------------------------------------------- HERO */}
      <section className="nx-hero ndh-hero">
        <img
          className="nx-hero-bg"
          src={heroImg}
          srcSet={`${heroImgSmall} 640w, ${heroImg} 1280w`}
          sizes="100vw"
          alt=""
          width={1600}
          height={912}
          loading="eager"
          fetchPriority="high"
          decoding="sync"
        />
        <div className="nx-hero-shade" aria-hidden="true" />
        <div className="nx-wrap nx-hero-inner">
          <p className="nx-kicker">
            <Sparkles size={14} aria-hidden="true" /> NAJEEB DIGITAL HUB · Open Gateway
          </p>
          <h1>
            One gateway.
            <br />
            <span>Twelve businesses</span> built for real life.
          </h1>
          <p className="nx-hero-lead">
            Practical digital skills, managed engineering, cloud storefronts, school systems and
            verified farm investment — five platforms live today, seven more being built. Every NDH
            product shares one standard of trust.
          </p>
          <div className="nx-hero-actions">
            <Link to="/businesses" className="nx-btn nx-btn-primary">
              Explore the ecosystem <ArrowRight size={17} />
            </Link>
            <Link to="/news" className="nx-btn nx-btn-glass">
              <Newspaper size={16} /> Read the newsroom
            </Link>
          </div>
          <dl className="nx-hero-stats">
            <div>
              <dt>{SUBSIDIARIES.length}</dt>
              <dd>Businesses</dd>
            </div>
            <div>
              <dt>{ACADEMY_SNAPSHOT.courses}</dt>
              <dd>Academy courses</dd>
            </div>
            <div>
              <dt>{ACADEMY_SNAPSHOT.schools}</dt>
              <dd>Academy schools</dd>
            </div>
          </dl>
        </div>
      </section>

      {/* ------------------------------------------------------- PRODUCT STATUS */}
      <section className="ndh-status-strip" aria-label="Platform status">
        <div className="nx-wrap ndh-status-inner">
          <span className="ndh-status-pill is-live">
            <span className="ndh-badge-dot" aria-hidden="true" /> {LIVE_SUBSIDIARY_COUNT} active
            products
          </span>
          <span className="ndh-status-pill is-dev">
            <Layers size={13} aria-hidden="true" /> {COMING_SUBSIDIARY_COUNT} in development
          </span>
          <span className="ndh-status-note">
            <BadgeCheck size={14} aria-hidden="true" /> Status is updated as each platform opens
          </span>
        </div>
      </section>

      {/* --------------------------------------------------- ACTIVE PRODUCTS */}
      <section className="nx-section ndh-porcelain" id="businesses">
        <div className="nx-wrap">
          <div className="ndh-head">
            <div>
              <p className="nx-eyebrow">Ready &amp; active</p>
              <h2>Five platforms you can use today</h2>
              <p className="ndh-head-lead">
                Every card below launches the real product in a new tab. Read the overview first if
                you want the detail.
              </p>
            </div>
            <Link to="/businesses" className="ndh-head-link">
              Directory <ArrowRight size={15} />
            </Link>
          </div>
          <div className="ndh-grid">
            {LIVE_SUBSIDIARIES.map((s) => (
              <BusinessCard key={s.id} s={s} />
            ))}
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------- IN DEVELOPMENT */}
      <section className="nx-section ndh-ink">
        <div className="nx-wrap">
          <div className="ndh-head is-dark">
            <div>
              <p className="nx-eyebrow">In build · launching soon</p>
              <h2>Seven platforms on the way</h2>
              <p className="ndh-head-lead">
                Each of these is scoped and in development. We announce the opening day in the
                newsroom instead of publishing a date we cannot keep.
              </p>
            </div>
          </div>
          <div className="ndh-grid">
            {COMING_SUBSIDIARIES.map((s) => (
              <BusinessCard key={s.id} s={s} compact />
            ))}
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------- WHY NDH */}
      <section className="nx-section ndh-porcelain">
        <div className="nx-wrap">
          <p className="nx-eyebrow">Why the family holds together</p>
          <h2 className="ndh-h2">One standard, twelve products</h2>
          <div className="ndh-trust">
            {[
              {
                icon: ShieldCheck,
                t: "Written scope, then money",
                b: "Every engagement, subscription and investment has terms before payment — never after.",
              },
              {
                icon: Users,
                t: "Real people on support",
                b: "Project managers, instructors, operators and consultants you can actually reach.",
              },
              {
                icon: Rocket,
                t: "Built to hand off",
                b: "Exports, certificates and records stay yours. Nothing is locked behind NDH forever.",
              },
            ].map(({ icon: Icon, t, b }) => (
              <div className="ndh-trust-item" key={t}>
                <span className="ndh-trust-icon">
                  <Icon size={20} aria-hidden="true" />
                </span>
                <h3>{t}</h3>
                <p>{b}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* -------------------------------------------------------------- NEWSROOM */}
      <section className="nx-section ndh-white">
        <div className="nx-wrap">
          <div className="ndh-head">
            <div>
              <p className="nx-eyebrow">Newsroom</p>
              <h2>Official announcements</h2>
              <p className="ndh-head-lead">
                Product releases, platform updates and company notices — published by the NDH team.
              </p>
            </div>
            <Link to="/news" className="ndh-head-link">
              All news <ArrowRight size={15} />
            </Link>
          </div>
          <div className="ndh-news-grid">
            {latest.map((post) => (
              <Link
                key={post.slug}
                to="/news/$slug"
                params={{ slug: post.slug }}
                className="ndh-news-card"
              >
                <span className="ndh-news-meta">
                  <span className="ndh-news-badge">{post.badge}</span>
                  <time dateTime={post.publishedAt}>{formatNewsDate(post.publishedAt)}</time>
                </span>
                <h3>{post.title}</h3>
                <p>{post.excerpt}</p>
                <span className="ndh-news-more">
                  Read announcement <ArrowRight size={14} aria-hidden="true" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------- CONTACT */}
      <section className="ndh-band">
        <div className="nx-wrap ndh-band-inner">
          <div>
            <h2>Not sure which platform fits?</h2>
            <p>Tell us the outcome you need. We will point you to the right NDH business.</p>
          </div>
          <div className="ndh-band-actions">
            <Link to="/contact" className="ndh-btn ndh-btn-light">
              Talk to us <ArrowUpRight size={16} />
            </Link>
            <a href={`mailto:${BRAND.email}`} className="ndh-band-mail">
              {BRAND.email}
            </a>
          </div>
        </div>
      </section>
    </FamilyPage>
  );
}
