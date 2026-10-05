import {
  Globe2,
  Layers,
  LayoutGrid,
  LifeBuoy,
  School,
  ShieldCheck,
  ShoppingBag,
} from "lucide-react";
import { NdhFamilySymbol } from "@/components/NdhFamilySymbol";
import { SUBSIDIARIES } from "@/lib/ecosystem";
import { useI18n } from "@/lib/preferences";

/**
 * Parent-brand bento. The wide card is the identity system itself — the same
 * Open Gateway symbol wearing each business's sector icon — because that is the
 * clearest statement of what a holding brand actually offers. Every other card
 * speaks for the family as a whole rather than for any one subsidiary, and the
 * set deliberately reaches past digital work into commerce, schools, travel and
 * healthcare.
 */
const CARDS = [
  { id: "standard", icon: Layers, tone: "sky" },
  { id: "toolkit", icon: ShoppingBag, tone: "amber" },
  { id: "platforms", icon: School, tone: "cyan" },
  { id: "region", icon: Globe2, tone: "violet" },
] as const;

export function WhyNdhBento() {
  const { t } = useI18n();
  const live = SUBSIDIARIES.filter((item) => item.state !== "coming");

  return (
    <section className="ecosystem-why gw-section" id="why" aria-labelledby="gw-why-heading">
      <div className="gw-section-head">
        <div className="gw-section-head-copy">
          <p className="gw-eyebrow">{t("home.bento.eyebrow")}</p>
          <h2 id="gw-why-heading">{t("home.bento.title")}</h2>
        </div>
        <p className="gw-section-lead">{t("home.bento.lead")}</p>
      </div>

      <div className="gw-bento">
        <article className="gw-bento-card is-wide tone-iris">
          <div className="gw-bento-top">
            <span className="gw-bento-icon" aria-hidden="true">
              <LayoutGrid size={18} />
            </span>
            <h3>{t("bento.identity.title")}</h3>
          </div>
          <p>{t("bento.identity.body")}</p>

          {/* The identity system, shown as the family itself: one symbol, one
              sector icon per business, in the order they appear in the grid. */}
          <ul className="gw-family-strip" aria-hidden="true">
            {live.map((subsidiary) => (
              <li key={subsidiary.id} className={`accent-${subsidiary.accent}`}>
                <NdhFamilySymbol SectorIcon={subsidiary.icon} />
                <span>{t(`eco.${subsidiary.id}.name` as never)}</span>
              </li>
            ))}
          </ul>
        </article>

        {CARDS.map((card) => {
          const Icon = card.icon;
          return (
            <article key={card.id} className={`gw-bento-card tone-${card.tone}`}>
              <div className="gw-bento-top">
                <span className="gw-bento-icon" aria-hidden="true">
                  <Icon size={17} />
                </span>
                <h3>{t(`bento.${card.id}.title` as never)}</h3>
              </div>
              <p>{t(`bento.${card.id}.body` as never)}</p>
            </article>
          );
        })}
      </div>

      <ul className="gw-trust-row">
        <li>
          <Layers size={15} aria-hidden="true" /> {t("home.trust.identity")}
        </li>
        <li>
          <ShieldCheck size={15} aria-hidden="true" /> {t("home.trust.review")}
        </li>
        <li>
          <LifeBuoy size={15} aria-hidden="true" /> {t("home.trust.support")}
        </li>
      </ul>
    </section>
  );
}
