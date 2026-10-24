import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, ArrowUpRight, Bell, Check } from "lucide-react";
import { FamilyPage } from "@/components/ecosystem/FamilyPage";
import { BusinessCard } from "@/components/ecosystem/BusinessCard";
import { SUBSIDIARIES, subsidiaryHref } from "@/lib/ecosystem";
import { BUSINESS_PROFILES } from "@/lib/business-profiles";
import { BUSINESS_DETAILS } from "@/lib/business-details";

export const Route = createFileRoute("/businesses/$id")({
  loader: ({ params }) => {
    const s = SUBSIDIARIES.find((x) => x.id === params.id);
    if (!s) throw notFound();
    return { id: s.id };
  },
  head: ({ loaderData }) => {
    if (!loaderData) return { meta: [{ title: "Business | Najeeb Digital Hub" }, { name: "robots", content: "noindex" }] };
    const p = BUSINESS_PROFILES[loaderData.id];
    const t = `${p.name} | Najeeb Digital Hub`;
    return {
      meta: [
        { title: t },
        { name: "description", content: p.tagline },
        { property: "og:title", content: t },
        { property: "og:description", content: p.tagline },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  notFoundComponent: () => (
    <FamilyPage>
      <div className="nx-wrap nx-section">
        <h1>Business not found</h1>
        <Link to="/businesses" className="nx-link">See all businesses</Link>
      </div>
    </FamilyPage>
  ),
  errorComponent: () => (
    <FamilyPage>
      <div className="nx-wrap nx-section">
        <h1>Something went wrong</h1>
        <Link to="/businesses" className="nx-link">See all businesses</Link>
      </div>
    </FamilyPage>
  ),
  component: BusinessPage,
});

function BusinessPage() {
  const { id } = Route.useLoaderData();
  const s = SUBSIDIARIES.find((x) => x.id === id)!;
  const p = BUSINESS_PROFILES[id];
  const d = BUSINESS_DETAILS[id];
  const Icon = s.icon;
  const soon = s.state === "coming";
  const href = subsidiaryHref(s);
  const others = SUBSIDIARIES.filter((x) => x.id !== id).slice(0, 3);

  return (
    <FamilyPage>
      <section className="nx-cover nx-cover-tall">
        <img src={d.cover} alt="" width={1280} height={720} />
        <div className="nx-cover-shade" aria-hidden="true" />
        <div className="nx-wrap nx-cover-inner">
          <Link to="/businesses" className="nx-back">
            <ArrowLeft size={15} /> All businesses
          </Link>
          <p className="nx-kicker">
            <Icon size={14} aria-hidden="true" /> {p.category}
          </p>
          <h1>{p.name}</h1>
          <p>{p.tagline}</p>
          <div className="nx-hero-actions">
            {soon ? (
              <Link to="/contact" className="nx-btn nx-btn-primary">
                <Bell size={16} /> Tell me when it opens
              </Link>
            ) : (
              <a href={href} rel="noreferrer" className="nx-btn nx-btn-primary">
                Visit {p.name} <ArrowUpRight size={16} />
              </a>
            )}
            <Link to="/contact" className="nx-btn nx-btn-glass">Ask a question</Link>
          </div>
        </div>
      </section>

      <section className="nx-section nx-white">
        <div className="nx-wrap nx-detail">
          <div className="nx-detail-main">
            <p className="nx-eyebrow">About</p>
            <h2>What {p.name} does</h2>
            <p className="nx-detail-text">{p.description}</p>
            <ul className="nx-points">
              <li><Check size={15} /> {p.point1}</li>
              <li><Check size={15} /> {p.point2}</li>
            </ul>
          </div>
          <aside className="nx-detail-side">
            <p className="nx-eyebrow">Who it's for</p>
            <p>{d.audience}</p>
            <p className="nx-eyebrow">Address</p>
            <p className="nx-mono">{s.domain}</p>
            {soon ? <p className="nx-note">This business is being planned. Details may change before launch.</p> : null}
          </aside>
        </div>
      </section>

      <section className="nx-section nx-porcelain">
        <div className="nx-wrap">
          <p className="nx-eyebrow">What's inside</p>
          <h2 className="nx-h2">{soon ? "What we are planning" : "Key features"}</h2>
          <div className="nx-features">
            {d.features.map((f, i) => (
              <div className="nx-feature" key={f.title}>
                <span>{String(i + 1).padStart(2, "0")}</span>
                <h3>{f.title}</h3>
                <p>{f.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="nx-section nx-white">
        <div className="nx-wrap">
          <h2 className="nx-h2">More from NDH</h2>
          <div className="nx-grid nx-grid-3">
            {others.map((o) => <BusinessCard key={o.id} s={o} />)}
          </div>
        </div>
      </section>
    </FamilyPage>
  );
}
