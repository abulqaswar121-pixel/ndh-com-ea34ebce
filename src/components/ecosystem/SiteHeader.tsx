import { useEffect, useRef, useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { ArrowRight, ArrowUpRight, ChevronDown, Globe, Menu, Sparkles, X } from "lucide-react";
import { NdhFamilySymbol } from "@/components/NdhFamilySymbol";
import { SUBSIDIARIES, LIVE_SUBSIDIARIES, COMING_SUBSIDIARIES } from "@/lib/ecosystem";
import { BUSINESS_PROFILES } from "@/lib/business-profiles";
import { BUSINESS_DETAILS } from "@/lib/business-details";
import { LanguageList, LanguageSwitcher } from "@/components/site/LanguageSwitcher";

const LINKS = [
  { to: "/businesses", label: "Businesses" },
  { to: "/news", label: "Newsroom" },
  { to: "/approach", label: "Our approach" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
] as const;

/** Parent-site header: brand, photo mega-menu of every business, page links, one action. */
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
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setMega(false);
      setDrawer(false);
    };
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

  // Lock the page behind the mobile drawer so it cannot scroll underneath.
  useEffect(() => {
    document.body.style.overflow = drawer ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [drawer]);

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
            Products <ChevronDown size={14} aria-hidden="true" />
          </button>
          {LINKS.filter((l) => l.to !== "/businesses").map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="nx-nav-link"
              activeProps={{ "aria-current": "page" }}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="nx-actions">
          <LanguageSwitcher />
          <Link to="/contact" className="nx-cta">
            Talk to us <ArrowUpRight size={15} aria-hidden="true" />
          </Link>
          <button
            type="button"
            className="nx-burger"
            aria-label={drawer ? "Close menu" : "Open menu"}
            aria-expanded={drawer}
            aria-controls="ndh-mobile-drawer"
            onClick={() => setDrawer((v) => !v)}
          >
            {drawer ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </header>

      {mega && (
        <div className="nx-mega" role="region" aria-label="Our products">
          <div className="nx-mega-inner">
            <div className="nx-mega-col">
              <p className="nx-mega-title">Active products</p>
              <div className="nx-mega-feature">
                {LIVE_SUBSIDIARIES.map((s) => (
                  <Link
                    key={s.id}
                    to="/businesses/$id"
                    params={{ id: s.id }}
                    className="nx-mega-card"
                  >
                    <img
                      src={BUSINESS_DETAILS[s.id].coverSmall}
                      alt=""
                      loading="lazy"
                      decoding="async"
                      width={320}
                      height={180}
                    />
                    <span>
                      <strong>{BUSINESS_PROFILES[s.id].name}</strong>
                      <small>{BUSINESS_PROFILES[s.id].category}</small>
                    </span>
                  </Link>
                ))}
              </div>
            </div>
            <div className="nx-mega-col nx-mega-side">
              <p className="nx-mega-title">In development</p>
              <ul>
                {COMING_SUBSIDIARIES.map((s) => {
                  const Icon = s.icon;
                  return (
                    <li key={s.id}>
                      <Link to="/businesses/$id" params={{ id: s.id }}>
                        <Icon size={15} aria-hidden="true" />
                        {BUSINESS_PROFILES[s.id].name.replace("NDH ", "")}
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

      <div
        id="ndh-mobile-drawer"
        className={`nx-drawer${drawer ? " is-open" : ""}`}
        aria-hidden={!drawer}
      >
        <div className="nx-drawer-inner">
          <Link to="/businesses" className="nx-drawer-main" tabIndex={drawer ? 0 : -1}>
            All {SUBSIDIARIES.length} businesses <ArrowRight size={16} />
          </Link>
          <div className="nx-drawer-grid">
            {SUBSIDIARIES.map((s) => {
              const Icon = s.icon;
              return (
                <Link
                  key={s.id}
                  to="/businesses/$id"
                  params={{ id: s.id }}
                  tabIndex={drawer ? 0 : -1}
                  className={s.state === "live" ? "is-live" : "is-dev"}
                >
                  <Icon size={15} aria-hidden="true" />
                  {BUSINESS_PROFILES[s.id].name.replace("NDH ", "")}
                </Link>
              );
            })}
          </div>
          <div className="nx-drawer-lang">
            <p className="nx-drawer-lang-title">
              <Globe size={14} aria-hidden="true" /> Choose your language
            </p>
            <LanguageList onPick={() => setDrawer(false)} />
          </div>

          {LINKS.map((l) => (
            <Link key={l.to} to={l.to} className="nx-drawer-link" tabIndex={drawer ? 0 : -1}>
              {l.label}
            </Link>
          ))}
          <Link to="/contact" className="nx-drawer-cta" tabIndex={drawer ? 0 : -1}>
            Talk to us <ArrowUpRight size={15} />
          </Link>
          <p className="nx-drawer-foot">
            <Sparkles size={13} aria-hidden="true" /> NAJEEB DIGITAL HUB · ndhnet.com
          </p>
        </div>
      </div>
    </div>
  );
}
