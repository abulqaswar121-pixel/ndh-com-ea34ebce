import { useEffect, useRef, useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { ArrowRight, ArrowUpRight, ChevronDown, Menu, X } from "lucide-react";
import { NdhFamilySymbol } from "@/components/NdhFamilySymbol";
import { SUBSIDIARIES } from "@/lib/ecosystem";
import { BUSINESS_PROFILES } from "@/lib/business-profiles";
import { BUSINESS_DETAILS } from "@/lib/business-details";

const LINKS = [
  { to: "/approach", label: "Our approach" },
  { to: "/about", label: "About" },
  { to: "/blog", label: "Journal" },
  { to: "/contact", label: "Contact" },
] as const;

/** Parent-site header: brand, a photo mega-menu of every business, page links, one action. */
export function SiteHeader() {
  const [mega, setMega] = useState(false);
  const [drawer, setDrawer] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const path = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    setMega(false);
    setDrawer(false);
  }, [path]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && (setMega(false), setDrawer(false));
    const onDown = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setMega(false);
    };
    window.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onDown);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onDown);
    };
  }, []);

  const live = SUBSIDIARIES.filter((s) => s.state !== "coming");
  const coming = SUBSIDIARIES.filter((s) => s.state === "coming");

  return (
    <div className={`nx-header-wrap${scrolled ? " is-scrolled" : ""}`} ref={ref}>
      <header className="nx-header">
        <Link to="/" className="nx-brand" aria-label="Najeeb Digital Hub home">
          <NdhFamilySymbol />
          <span>
            <strong>NAJEEB</strong>
            <small>DIGITAL HUB</small>
          </span>
        </Link>

        <nav className="nx-nav" aria-label="Main">
          <button
            type="button"
            className={`nx-nav-btn${mega ? " is-open" : ""}`}
            aria-expanded={mega}
            onClick={() => setMega((v) => !v)}
          >
            Businesses <ChevronDown size={14} aria-hidden="true" />
          </button>
          {LINKS.map((l) => (
            <Link key={l.to} to={l.to} className="nx-nav-link" activeProps={{ "aria-current": "page" }}>
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="nx-actions">
          <Link to="/contact" className="nx-cta">
            Talk to us <ArrowUpRight size={15} aria-hidden="true" />
          </Link>
          <button
            type="button"
            className="nx-burger"
            aria-label={drawer ? "Close menu" : "Open menu"}
            aria-expanded={drawer}
            onClick={() => setDrawer((v) => !v)}
          >
            {drawer ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </header>

      {mega && (
        <div className="nx-mega" role="region" aria-label="Our businesses">
          <div className="nx-mega-inner">
            <div className="nx-mega-col">
              <p className="nx-mega-title">Open now</p>
              <div className="nx-mega-feature">
                {live.map((s) => (
                  <Link key={s.id} to="/businesses/$id" params={{ id: s.id }} className="nx-mega-card">
                    <img src={BUSINESS_DETAILS[s.id].cover} alt="" loading="lazy" width={320} height={180} />
                    <span>
                      <strong>{BUSINESS_PROFILES[s.id].name}</strong>
                      <small>{BUSINESS_PROFILES[s.id].category}</small>
                    </span>
                  </Link>
                ))}
              </div>
            </div>
            <div className="nx-mega-col nx-mega-side">
              <p className="nx-mega-title">Coming soon</p>
              <ul>
                {coming.map((s) => {
                  const Icon = s.icon;
                  return (
                    <li key={s.id}>
                      <Link to="/businesses/$id" params={{ id: s.id }}>
                        <Icon size={15} aria-hidden="true" />
                        {BUSINESS_PROFILES[s.id].name}
                      </Link>
                    </li>
                  );
                })}
              </ul>
              <Link to="/businesses" className="nx-mega-all">
                See all {SUBSIDIARIES.length} businesses <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      )}

      {drawer && (
        <div className="nx-drawer">
          <Link to="/businesses" className="nx-drawer-main">
            All businesses <ArrowRight size={16} />
          </Link>
          <div className="nx-drawer-grid">
            {SUBSIDIARIES.map((s) => {
              const Icon = s.icon;
              return (
                <Link key={s.id} to="/businesses/$id" params={{ id: s.id }}>
                  <Icon size={15} aria-hidden="true" />
                  {BUSINESS_PROFILES[s.id].name.replace("NDH ", "")}
                </Link>
              );
            })}
          </div>
          {LINKS.map((l) => (
            <Link key={l.to} to={l.to} className="nx-drawer-link">
              {l.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
