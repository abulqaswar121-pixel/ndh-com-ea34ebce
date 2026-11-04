import { Link } from "@tanstack/react-router";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { NdhFamilySymbol } from "@/components/NdhFamilySymbol";
import { STATE_ACTION, STATE_LABEL, type Subsidiary } from "@/lib/ecosystem";
import { BUSINESS_PROFILES } from "@/lib/business-profiles";
import { BUSINESS_DETAILS } from "@/lib/business-details";

/**
 * One portfolio card. Every card shows the Open Gateway mark with the sector
 * icon, real cover photography, a status badge and two clear actions:
 * launch the live platform in a new tab, or read the overview on this site.
 */
export function BusinessCard({ s, compact = false }: { s: Subsidiary; compact?: boolean }) {
  const p = BUSINESS_PROFILES[s.id];
  const d = BUSINESS_DETAILS[s.id];
  const Icon = s.icon;
  const live = s.state === "live";

  return (
    <article className={`ndh-card${live ? " is-live" : " is-dev"}${compact ? " is-compact" : ""}`}>
      <div className="ndh-card-media">
        <img
          src={d.coverSmall}
          srcSet={`${d.coverSmall} 640w, ${d.cover} 1280w`}
          sizes="(max-width: 700px) 100vw, (max-width: 1100px) 45vw, 360px"
          alt={`${p.name} — ${p.role}`}
          loading="lazy"
          decoding="async"
          width={640}
          height={400}
        />
        <span className={`ndh-badge${live ? " is-live" : " is-dev"}`}>
          <span className="ndh-badge-dot" aria-hidden="true" />
          {STATE_LABEL[s.state]}
        </span>
        <span className="ndh-card-marks">
          <NdhFamilySymbol />
          <span className={`ndh-card-sector tone-${s.accent}`}>
            <Icon size={13} aria-hidden="true" />
          </span>
        </span>
      </div>

      <div className="ndh-card-body">
        <p className="ndh-card-cat">{p.category}</p>
        <h3>{p.name}</h3>
        <p className="ndh-card-role">{p.role}</p>
        <div className="ndh-card-actions">
          {live ? (
            <a
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              className="ndh-btn ndh-btn-launch"
            >
              {STATE_ACTION[s.state]}
              <ArrowUpRight size={15} aria-hidden="true" />
            </a>
          ) : null}
          <Link
            to="/businesses/$id"
            params={{ id: s.id }}
            className={`ndh-btn ${live ? "ndh-btn-quiet" : "ndh-btn-ghost"}`}
          >
            {live ? "Read Overview" : STATE_ACTION[s.state]}
            <ArrowRight size={15} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </article>
  );
}
