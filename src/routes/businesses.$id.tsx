import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, ArrowUpRight, ArrowRight, Bell, Check, Layers, Rocket } from "lucide-react";
import { FamilyPage } from "@/components/ecosystem/FamilyPage";
import { BusinessCard } from "@/components/ecosystem/BusinessCard";
import { SUBSIDIARIES, STATE_LABEL, STATE_ACTION } from "@/lib/ecosystem";
import { BUSINESS_PROFILES } from "@/lib/business-profiles";
import { BUSINESS_DETAILS } from "@/lib/business-details";
import { BRAND } from "@/lib/brand";

export const Route = createFileRoute("/businesses/$id")({
  loader: ({ params }) => {
    const s = SUBSIDIARIES.find((x) => x.id === params.id);
    if (!s) throw notFound();
    return { id: s.id };
  },
  head: ({ loaderData }) => {
    if (!loaderData)
      return {
        meta: [{ title: "Business | NDH" }, { name: "robots", content: "noindex" }],
      };
    const p = BUSINESS_PROFILES[loaderData.id];
    const t = `${p.name} | NAJEEB DIGITAL HUB`;
    const url = `${BRAND.url}/businesses/${loaderData.id}`;
    return {
      meta: [
        { title: t },
        { name: "description", content: p.role },
        { property: "og:title", content: t },
        { property: "og:description", content: p.role },
        { property: "og:type", content: "website" },
        { property: "og:url", content: url },
        { name: "twitter:card", content: "summary_large_image" },
      ],
      links: [{ rel: "canonical", href: url }],
    };
  },
  notFoundComponent: () => (
    <FamilyPage>
      <div className="nx-wrap nx-section">
        <h1>Business not found</h1>
        <Link to="/businesses" className="ndh-head-link">
          See all businesses <ArrowRight size={15} />
        </Link>
      </div>
    </FamilyPage>
  ),
  errorComponent: () => (
    <FamilyPage>
      <div className="nx-wrap nx-section">
        <h1>Something went wrong</h1>
        <Link to="/businesses" className="ndh-head-link">
          See all businesses <ArrowRight size={15} />
        </Link>
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
  const live = s.state === "live";
  const others = SUBSIDIARIES.filter((x) => x.id !== id).slice(0, 3);

  return (
    <FamilyPage>
      <section className="nx-cover nx-cover-tall ndh-cover">
        <img src={d.cover} alt="" width={1280} height={720} />
        <div className="nx-cover-shade" aria-hidden="true" />
        <div className="nx-wrap nx-cover-inner">
          <Link to="/businesses" className="nx-back">
            <ArrowLeft size={15} /> All businesses
          </Link>
          <p className="nx-kicker">
            {live ? (
              <Rocket size={14} aria-hidden="true" />
            ) : (
              <Layers size={14} aria-hidden="true" />
            )}
            {STATE_LABEL[s.state]} · {p.category}
          </p>
          <h1>{p.name}</h1>
          <p>{p.role}</p>
          <div className="nx-hero-actions">
            {live ? (
              <a
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="nx-btn nx-btn-primary"
              >
                {STATE_ACTION[s.state]} <ArrowUpRight size={16} />
              </a>
            ) : (
              <Link to="/contact" className="nx-btn nx-btn-primary">
                <Bell size={16} /> Tell me when it opens
              </Link>
            )}
            <Link to="/contact" className="nx-btn nx-btn-glass">
              Ask a question
            </Link>
          </div>
        </div>
      </section>

      <section className="nx-section ndh-white">
        <div className="nx-wrap nx-detail">
          <div className="nx-detail-main">
            <p className="nx-eyebrow">About</p>
            <h2>What {p.name} does</h2>
            <p className="nx-detail-text">{p.description}</p>
            <ul className="nx-points">
              <li>
                <Check size={15} /> {p.point1}
              </li>
              <li>
                <Check size={15} /> {p.point2}
              </li>
            </ul>
          </div>
          <aside className="nx-detail-side">
            <p className="nx-eyebrow">Status</p>
            <p>{STATE_LABEL[s.state]}</p>
            <p className="nx-eyebrow">Who it&apos;s for</p>
            <p>{d.audience}</p>
            <p className="nx-eyebrow">Address</p>
            <p className="nx-mono">{s.domain}</p>
            {live ? (
              <a
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="ndh-btn ndh-btn-launch ndh-detail-launch"
              >
                {STATE_ACTION[s.state]} <ArrowUpRight size={15} />
              </a>
            ) : (
              <p className="nx-note">
                In development. Scope may still change before the platform opens.
              </p>
            )}
          </aside>
        </div>
      </section>

      <section className="nx-section ndh-porcelain">
        <div className="nx-wrap">
          <p className="nx-eyebrow">What&apos;s inside</p>
          <h2 className="nx-h2">{live ? "Key features" : "What we are building"}</h2>
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

      <section className="nx-section ndh-white">
        <div className="nx-wrap">
          <h2 className="nx-h2">More from NDH</h2>
          <div className="ndh-grid">
            {others.map((o) => (
              <BusinessCard key={o.id} s={o} compact />
            ))}
          </div>
        </div>
      </section>
    </FamilyPage>
  );
}
