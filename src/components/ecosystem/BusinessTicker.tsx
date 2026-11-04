import { useCallback, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { BUSINESS_PROFILES } from "@/lib/business-profiles";
import { SUBSIDIARIES, type SubsidiaryId } from "@/lib/ecosystem";

/**
 * One-line description for every business in the family. Kept beside the
 * ticker because it is the only place that needs the short form — the full
 * role lives in `BUSINESS_PROFILES`.
 */
const DESCRIPTORS: Record<SubsidiaryId, string> = {
  academy: "Skills & AI Training",
  agency: "Managed Tech & Media",
  shopos: "Store Builder Platform",
  schoolos: "Integrated School SaaS",
  farmfund: "Verified Agri-Investment",
  mall: "Online Marketplace",
  cloud: "Software & AI Infrastructure",
  express: "Logistics & Deliveries",
  pay: "Payments & Wallet",
  travel: "Travel & Mobility",
  health: "Digital Health Systems",
  foundation: "Tech Social Impact",
};

/**
 * The twelve-business ticker under the hero.
 *
 * The track holds two identical runs and slides by exactly half its width, so
 * the loop is seamless. The second run is decorative (hidden from assistive
 * tech, removed from the tab order). Motion pauses on hover, on touch and while
 * anything inside is focused, and disappears entirely for visitors who ask for
 * reduced motion — the bar then simply scrolls sideways.
 */
export function BusinessTicker() {
  const [paused, setPaused] = useState(false);
  const timer = useRef<number | null>(null);

  const hold = useCallback(() => {
    if (timer.current) {
      window.clearTimeout(timer.current);
      timer.current = null;
    }
    setPaused(true);
  }, []);

  const release = useCallback((delay = 0) => {
    if (timer.current) window.clearTimeout(timer.current);
    if (delay === 0) {
      setPaused(false);
      return;
    }
    timer.current = window.setTimeout(() => {
      setPaused(false);
      timer.current = null;
    }, delay);
  }, []);

  const run = (copy: number) => (
    <ul className="ndh-ticker-run" aria-hidden={copy === 1 ? "true" : undefined}>
      {SUBSIDIARIES.map((subsidiary) => {
        const Icon = subsidiary.icon;
        const name = BUSINESS_PROFILES[subsidiary.id].name;
        const live = subsidiary.state === "live";
        return (
          <li key={`${copy}-${subsidiary.id}`}>
            <Link
              to="/businesses/$id"
              params={{ id: subsidiary.id }}
              className="ndh-ticker-pill"
              tabIndex={copy === 1 ? -1 : undefined}
              aria-label={`${name} — ${DESCRIPTORS[subsidiary.id]} — ${live ? "Live" : "Coming soon"}`}
            >
              <Icon size={15} aria-hidden="true" className="ndh-ticker-icon" />
              <span className="ndh-ticker-name">{name}</span>
              <span className={`ndh-ticker-badge ${live ? "is-live" : "is-soon"}`}>
                {live ? "Live" : "Soon"}
              </span>
            </Link>
          </li>
        );
      })}
    </ul>
  );

  return (
    <section className="ndh-ticker" aria-label="Every NDH business">
      <div
        className="ndh-ticker-mask"
        onMouseEnter={hold}
        onMouseLeave={() => release()}
        onTouchStart={hold}
        onTouchEnd={() => release(1800)}
        onTouchCancel={() => release(1800)}
        onFocusCapture={hold}
        onBlurCapture={() => release()}
      >
        <div
          className="ndh-ticker-track"
          style={{ animationPlayState: paused ? "paused" : "running" }}
        >
          {run(0)}
          {run(1)}
        </div>
      </div>
    </section>
  );
}
