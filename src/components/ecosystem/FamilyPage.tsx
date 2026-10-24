import type { ReactNode } from "react";
import { ArrowUpRight } from "lucide-react";
import { NdhFamilySymbol } from "@/components/NdhFamilySymbol";
import { SiteHeader } from "./SiteHeader";
import { FamilyFooter } from "./FamilyFooter";
import { useI18n } from "@/lib/preferences";

/** Public parent-brand pages, independent of subsidiary portals and auth redirects. */
export function FamilyPage({ children }: { children: ReactNode }) {
  const { t } = useI18n();
  return (
    <div className="ecosystem-page gw-page family-page nx-page" id="top">
      <a className="gw-skip" href="#page-content">
        {t("nav.skip")}
      </a>
      <SiteHeader />
      <main id="page-content">{children}</main>
      <FamilyFooter />
    </div>
  );
}

export function FamilyIntro({
  eyebrow,
  title,
  body,
  children,
}: {
  eyebrow: string;
  title: string;
  body: string;
  children?: ReactNode;
}) {
  return (
    <section className="family-hero">
      <div className="family-wrap family-hero-grid">
        <div>
          <p className="family-kicker">{eyebrow}</p>
          <h1>{title}</h1>
          <p className="family-hero-lead">{body}</p>
          {children}
        </div>
        <div className="family-hero-mark" aria-hidden="true">
          <NdhFamilySymbol />
          <span>
            ONE FAMILY.
            <br />
            MANY POSSIBILITIES.
          </span>
        </div>
      </div>
    </section>
  );
}

export function FamilyCta() {
  return (
    <section className="family-band">
      <div className="family-wrap family-card family-cta">
        <div>
          <p className="family-kicker">Your next step</p>
          <h2>You don’t need all the answers to begin.</h2>
          <p>
            Tell us what you’re exploring. We’ll help you find the right part of the NDH family.
          </p>
        </div>
        <a className="gw-button gw-button-primary" href="/contact">
          Talk to us <ArrowUpRight size={17} />
        </a>
      </div>
    </section>
  );
}
