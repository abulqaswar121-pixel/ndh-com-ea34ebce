import { useMemo } from "react";
import { ArrowUpRight, Check, Plus } from "lucide-react";
import { NdhFamilySymbol } from "@/components/NdhFamilySymbol";
import {
  ECOSYSTEM_CATEGORIES,
  filterSubsidiaries,
  SUBSIDIARIES,
  type CategoryId,
} from "@/lib/ecosystem";
import { useI18n } from "@/lib/preferences";

export type DirectoryFilter = CategoryId | "all";

/**
 * Interactive ecosystem directory: browse the family, or narrow it by what the
 * visitor is trying to do. The filter is controlled by the parent page so the
 * hero's quick paths can send someone straight into the right category, while
 * the catalogue itself is static and fully server-rendered.
 */
export function EcosystemDirectory({
  filter,
  onFilterChange,
}: {
  filter: DirectoryFilter;
  onFilterChange: (filter: DirectoryFilter) => void;
}) {
  const { t } = useI18n();
  const visible = useMemo(() => filterSubsidiaries(filter), [filter]);
  const count = visible.length;

  return (
    <section
      className="ecosystem-directory gw-section"
      id="businesses"
      aria-labelledby="gw-directory-heading"
    >
      <div className="gw-section-head">
        <div className="gw-section-head-copy">
          <p className="gw-eyebrow">{t("home.eco.eyebrow")}</p>
          <h2 id="gw-directory-heading">{t("home.eco.title")}</h2>
        </div>
        <p className="gw-section-lead">{t("home.eco.lead")}</p>
      </div>

      <div className="gw-filter" role="group" aria-label={t("home.eco.filterLabel")}>
        <button
          type="button"
          className={filter === "all" ? "gw-filter-chip is-active" : "gw-filter-chip"}
          aria-pressed={filter === "all"}
          onClick={() => onFilterChange("all")}
        >
          <span className="gw-filter-dot" aria-hidden="true" />
          {t("home.eco.filterAll")}
          <b>{SUBSIDIARIES.length}</b>
        </button>
        {ECOSYSTEM_CATEGORIES.map((category) => {
          const Icon = category.icon;
          const isActive = filter === category.id;
          const total = filterSubsidiaries(category.id).length;
          return (
            <button
              key={category.id}
              type="button"
              className={`gw-filter-chip tone-${category.tone}${isActive ? " is-active" : ""}`}
              aria-pressed={isActive}
              onClick={() => onFilterChange(category.id)}
              title={t(`eco.category.${category.id}.blurb` as never)}
            >
              <Icon size={15} aria-hidden="true" />
              {t(`eco.category.${category.id}.name` as never)}
              <b>{total}</b>
            </button>
          );
        })}
      </div>

      <p className="gw-filter-count" aria-live="polite">
        {count === 1 ? t("home.eco.resultOne") : t("home.eco.resultMany", { count })}
        {filter !== "all" ? (
          <button type="button" className="gw-filter-clear" onClick={() => onFilterChange("all")}>
            {t("home.eco.clear")}
          </button>
        ) : null}
      </p>

      {count === 0 ? (
        <p className="gw-empty">{t("home.eco.empty")}</p>
      ) : (
        <div className="gw-grid">
          {visible.map((subsidiary) => {
            const Icon = subsidiary.icon;
            const name = t(`eco.${subsidiary.id}.name` as never);
            const href = subsidiary.external
              ? (subsidiary.previewUrl ?? subsidiary.href)
              : subsidiary.href;
            const hasLink = subsidiary.state !== "coming" && Boolean(href);

            const body = (
              <>
                <div className="gw-card-top">
                  <NdhFamilySymbol SectorIcon={Icon} />
                  <span
                    className={`gw-pill tone-${subsidiary.accent} ${
                      subsidiary.state === "coming" ? "is-soon" : "is-live"
                    }`}
                  >
                    {subsidiary.state === "coming"
                      ? t("app.switcher.soon")
                      : t("app.switcher.preview")}
                  </span>
                </div>
                <p className="gw-card-label">{subsidiary.domain}</p>
                <h3>{name}</h3>
                <p className="gw-card-tagline">{t(`eco.${subsidiary.id}.tagline` as never)}</p>
                <p className="gw-card-body">{t(`eco.${subsidiary.id}.description` as never)}</p>
                <ul className="gw-card-points">
                  <li>
                    <Check size={13} aria-hidden="true" />
                    {t(`eco.${subsidiary.id}.point1` as never)}
                  </li>
                  <li>
                    <Check size={13} aria-hidden="true" />
                    {t(`eco.${subsidiary.id}.point2` as never)}
                  </li>
                </ul>
                <span className="gw-card-action">
                  {hasLink ? t("home.card.visit") : t("home.card.inDevelopment")}
                  {hasLink ? <ArrowUpRight size={16} aria-hidden="true" /> : null}
                </span>
              </>
            );

            return hasLink ? (
              <a
                key={subsidiary.id}
                className={`ecosystem-card gw-card accent-${subsidiary.accent}`}
                href={href}
                {...(subsidiary.external ? { rel: "noreferrer" } : {})}
              >
                {body}
              </a>
            ) : (
              <article
                key={subsidiary.id}
                className={`ecosystem-card gw-card is-muted accent-${subsidiary.accent}`}
              >
                {body}
              </article>
            );
          })}

          {filter === "all" ? (
            <article className="ecosystem-card gw-card is-next">
              <span className="gw-plus" aria-hidden="true">
                <Plus size={22} />
              </span>
              <p className="gw-card-label">{t("home.card.nextLabel")}</p>
              <h3>{t("home.card.nextTitle")}</h3>
              <p className="gw-card-body">{t("home.card.nextBody")}</p>
            </article>
          ) : null}
        </div>
      )}
    </section>
  );
}
