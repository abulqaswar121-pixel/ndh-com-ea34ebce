import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { FamilyPage } from "@/components/ecosystem/FamilyPage";
import { BusinessCard } from "@/components/ecosystem/BusinessCard";
import { SUBSIDIARIES } from "@/lib/ecosystem";
import cover from "@/assets/covers/hero.jpg";

const title = "Our Businesses | Najeeb Digital Hub";
const description =
  "Every NDH business in one place: Agency, Academy, FarmFund, eStore, and Mall, Cloud, SchoolOS, Express, Pay, Travel, Health and Foundation coming soon.";

export const Route = createFileRoute("/businesses/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Businesses,
});

const TABS = [
  { id: "all", label: "All" },
  { id: "live", label: "Open now" },
  { id: "coming", label: "Coming soon" },
] as const;

function Businesses() {
  const [tab, setTab] = useState<(typeof TABS)[number]["id"]>("all");
  const list = SUBSIDIARIES.filter((s) =>
    tab === "all" ? true : tab === "coming" ? s.state === "coming" : s.state !== "coming",
  );
  return (
    <FamilyPage>
      <section className="nx-cover">
        <img src={cover} alt="" width={1600} height={912} />
        <div className="nx-cover-shade" aria-hidden="true" />
        <div className="nx-wrap nx-cover-inner">
          <p className="nx-kicker">The NDH family</p>
          <h1>Our businesses</h1>
          <p>Tap any business to read what it does and what's inside.</p>
        </div>
      </section>
      <section className="nx-section nx-porcelain">
        <div className="nx-wrap">
          <div className="nx-tabs" role="group" aria-label="Filter">
            {TABS.map((t) => (
              <button
                key={t.id}
                type="button"
                aria-pressed={tab === t.id}
                className={tab === t.id ? "is-active" : undefined}
                onClick={() => setTab(t.id)}
              >
                {t.label}
              </button>
            ))}
          </div>
          <div className="nx-grid">
            {list.map((s) => (
              <BusinessCard key={s.id} s={s} />
            ))}
          </div>
        </div>
      </section>
    </FamilyPage>
  );
}
