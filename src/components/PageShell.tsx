import { Link, Navigate } from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";
import { ArrowUpRight } from "lucide-react";
import { roleHome, useAuth } from "@/lib/auth";
import { NdhFamilySymbol } from "@/components/NdhFamilySymbol";
import { FamilyFooter } from "@/components/ecosystem/FamilyFooter";
import { FamilyMenu } from "@/components/ecosystem/FamilyMenu";
import { useI18n } from "@/lib/preferences";

export function PageShell({
  children,
  title,
  allowSignedIn = false,
}: {
  children?: ReactNode;
  title?: string;
  allowSignedIn?: boolean;
}) {
  const [scrolled, setScrolled] = useState(false);
  const { user, role, loading } = useAuth();
  const { t } = useI18n();

  /** Navigation lives in the shared family dropdown — the directory, the
   *  language switcher and the app links are all in the one panel. */
  const links = [
    { label: t("nav.work"), href: "/work" },
    { label: t("nav.blog"), href: "/blog" },
    { label: t("nav.about"), href: "/about" },
    { label: t("nav.contact"), href: "/contact" },
  ];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!allowSignedIn && !loading && user && role) {
    return <Navigate to={roleHome(role) as never} replace />;
  }

  return (
    <div className="precision-public-shell">
      <header id="top" className={scrolled ? "site-header is-scrolled" : "site-header"}>
        <Link to="/" className="brand precision-brand" aria-label="Najeeb Digital Hub home">
          <NdhFamilySymbol />
          <span><strong>NAJEEB</strong><small>DIGITAL HUB</small></span>
        </Link>
        <nav className="desktop-nav">
          <FamilyMenu links={links} cta={{ label: t("nav.talkToUs"), href: "/contact" }} />
          {/* Flat links on desktop; on small screens the same links live in
              the dropdown, so the header stays uncluttered. */}
          {links.map((link) => (
            <Link key={link.href} to={link.href as never} className="nav-flat-link">
              {link.label}
            </Link>
          ))}
        </nav>
        <Link to="/contact" className="nav-action desktop-action">
          {t("nav.talkToUs")}
        </Link>
      </header>

      {title ? (
        <main className="content">
          <h1>{title}</h1>
        </main>
      ) : null}

      {children}

      <FamilyFooter />
    </div>
  );
}

export function PageIntro({
  eyebrow,
  title,
  body,
  image,
  imageAlt,
}: {
  eyebrow: string;
  title: string;
  body: string;
  image?: string;
  imageAlt?: string;
}) {
  return (
    <section className={image ? "page-intro page-intro-image" : "page-intro"}>
      <div className="page-intro-inner">
        <p className="eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
        <p className="lede">{body}</p>
        {eyebrow === "Agency" && (
          <Link className="intro-link" to="/contact">
            Start a project <ArrowUpRight size={17} />
          </Link>
        )}
        {eyebrow === "Academy" && (
          <a className="intro-link" href="#courses">
            Explore courses <ArrowUpRight size={17} />
          </a>
        )}
      </div>
      {image && (
        <img
          className="page-intro-media"
          src={image}
          alt={imageAlt ?? ""}
          loading="eager"
          decoding="async"
        />
      )}
    </section>
  );
}

export function Button({
  to,
  children,
  secondary = false,
}: {
  to: string;
  children: ReactNode;
  secondary?: boolean;
}) {
  return (
    <Link to={to} className={secondary ? "button button-secondary" : "button"}>
      {children}
    </Link>
  );
}
