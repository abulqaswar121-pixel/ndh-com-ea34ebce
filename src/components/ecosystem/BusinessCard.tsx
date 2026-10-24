import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import type { Subsidiary } from "@/lib/ecosystem";
import { BUSINESS_PROFILES } from "@/lib/business-profiles";
import { BUSINESS_DETAILS } from "@/lib/business-details";

/** One equal-size card for every business, live or coming. Always opens its reading page. */
export function BusinessCard({ s }: { s: Subsidiary }) {
  const p = BUSINESS_PROFILES[s.id];
  const Icon = s.icon;
  const soon = s.state === "coming";
  return (
    <Link to="/businesses/$id" params={{ id: s.id }} className={`nx-card${soon ? " is-soon" : ""}`}>
      <div className="nx-card-media">
        <img src={BUSINESS_DETAILS[s.id].cover} alt="" loading="lazy" width={640} height={360} />
        <span className={`nx-status${soon ? " is-soon" : ""}`}>{soon ? "Coming soon" : "Open now"}</span>
        <span className={`nx-card-icon tone-${s.accent}`} aria-hidden="true">
          <Icon size={18} />
        </span>
      </div>
      <div className="nx-card-body">
        <p className="nx-card-cat">{p.category}</p>
        <h3>{p.name}</h3>
        <p>{p.tagline}</p>
        <span className="nx-card-more">
          {soon ? "See what's coming" : "Explore"} <ArrowRight size={15} aria-hidden="true" />
        </span>
      </div>
    </Link>
  );
}
