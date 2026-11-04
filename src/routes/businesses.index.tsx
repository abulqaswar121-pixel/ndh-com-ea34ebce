import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Layers, Rocket } from "lucide-react";
import { FamilyPage } from "@/components/ecosystem/FamilyPage";
import { BusinessCard } from "@/components/ecosystem/BusinessCard";
import { SUBSIDIARIES, LIVE_SUBSIDIARY_COUNT, COMING_SUBSIDIARY_COUNT } from "@/lib/ecosystem";
import { BRAND } from "@/lib/brand";
import cover from "@/assets/covers/hero-1280.webp";
import coverSmall from "@/assets/covers/hero-640.webp";

const title = "Our Businesses | NAJEEB DIGITAL HUB (NDH)";
const description =
  "Every NDH business in one place: Academy, Agency, ShopOS, SchoolOS and FarmFund are live, with Mall, Cloud, Express, Pay, Travel, Health and Foundation in development.";

export const Route = createFileRoute("/businesses/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: `${BRAND.url}/businesses` },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: `${BRAND.url}/businesses` }],
  }),
  component: Businesses,
});

const TABS = [
  { id: "all", label: "All", count: SUBSIDIARIES.length },
  { id: "live", label: "Active products", count: LIVE_SUBSIDIARY_COUNT },
  { id: "coming", label: "In development", count: COMING_SUBSIDIARY_COUNT },
] as const;

function Businesses() {
  const [tab, setTab] = useState<(typeof TABS)[number]["id"]>("all");
  const list = SUBSIDIARIES.filter((s) =>
    tab === "all" ? true : tab === "coming" ? s.state === "coming" : s.state === "live",
  );

  return (
    <FamilyPage>
      <section className="nx-cover ndh-cover">
        <img
          src={cover}
          srcSet={`${coverSmall} 640w, ${cover} 1280w`}
          sizes="100vw"
          alt=""
          width={1600}
          height={912}
          loading="eager"
          fetchPriority="high"
          decoding="sync"
        />
        <div className="nx-cover-shade" aria-hidden="true" />
        <div className="nx-wrap nx-cover-inner">
          <p className="nx-kicker">The NDH directory</p>
          <h1>Our businesses</h1>
          <p>
            Twelve platforms, one standard. Launch a live product, or read the overview of what is
            being built next.
          </p>
          <div className="ndh-cover-stats">
            <span>
              <Rocket size={15} aria-hidden="true" /> {LIVE_SUBSIDIARY_COUNT} active
            </span>
            <span>
              <Layers size={15} aria-hidden="true" /> {COMING_SUBSIDIARY_COUNT} in development
            </span>
          </div>
        </div>
      </section>

      <section className="nx-section ndh-porcelain">
        <div className="nx-wrap">
          <div className="ndh-tabs" role="group" aria-label="Filter businesses by status">
            {TABS.map((t) => (
              <button
                key={t.id}
                type="button"
                aria-pressed={tab === t.id}
                className={tab === t.id ? "is-active" : undefined}
                onClick={() => setTab(t.id)}
              >
                {t.label}
                <span>{t.count}</span>
              </button>
            ))}
          </div>
          <div className="ndh-grid">
            {list.map((s) => (
              <BusinessCard key={s.id} s={s} compact={s.state === "coming"} />
            ))}
          </div>
        </div>
      </section>
    </FamilyPage>
  );
}
