import { useEffect, useId, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowUpRight, Check, ChevronDown, Languages } from "lucide-react";
import { ECOSYSTEM_CATEGORIES, SUBSIDIARIES, type Subsidiary } from "@/lib/ecosystem";
import { LOCALES } from "@/lib/i18n/dictionary";
import { usePreferences } from "@/lib/preferences";

export type FamilyMenuLink = { label: string; href: string };
export type FamilyMenuAction = { label: string; href: string };

/**
 * The single navigation dropdown for the whole site.
 *
 * It holds the family directory, the page links, the language switcher and an
 * optional page action, so the header itself only needs a brand, this trigger
 * and one call to action. It server-renders closed and needs no browser API
 * until it is opened, and it becomes the full menu on small screens.
 */
export function FamilyMenu({
  links = [],
  action,
  cta,
}: {
  /** Page links shown in the "on this site" column. */
  links?: FamilyMenuLink[];
  /** Optional external/internal action shown under the links. */
  cta?: FamilyMenuAction;
  /** Optional secondary button in the panel footer. */
  action?: FamilyMenuAction;
}) {
  const { t, locale, setLocale } = usePreferences();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const panelId = useId();

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: MouseEvent | TouchEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("touchstart", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("touchstart", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const groups = ECOSYSTEM_CATEGORIES.map((category) => ({
    category,
    items: SUBSIDIARIES.filter((subsidiary) => subsidiary.categories[0] === category.id),
  })).filter((group) => group.items.length > 0);

  function close() {
    setOpen(false);
  }

  function hrefFor(subsidiary: Subsidiary) {
    if (subsidiary.state === "coming") return "";
    return subsidiary.external ? (subsidiary.previewUrl ?? subsidiary.href) : subsidiary.href;
  }

  return (
    <div className="gw-menu" ref={rootRef}>
      <button
        type="button"
        className="gw-menu-trigger"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((value) => !value)}
      >
        {t("nav.menu")}
        <ChevronDown size={14} aria-hidden="true" className={open ? "is-open" : undefined} />
      </button>

      {open && (
        <div className="gw-menu-panel" id={panelId} role="group" aria-label={t("nav.menu")}>
          <div className="gw-menu-grid">
            <section className="gw-menu-families">
              <p className="gw-menu-title">{t("nav.family")}</p>
              <p className="gw-menu-lead">{t("nav.familyLead")}</p>
              <div className="gw-menu-groups">
                {groups.map(({ category, items }) => {
                  const CategoryIcon = category.icon;
                  return (
                    <div className="gw-menu-group" key={category.id}>
                      <p className={`gw-menu-group-title tone-${category.tone}`}>
                        <CategoryIcon size={13} aria-hidden="true" />
                        {t(`eco.category.${category.id}.name` as never)}
                      </p>
                      <ul>
                        {items.map((subsidiary) => {
                          const Icon = subsidiary.icon;
                          const href = hrefFor(subsidiary);
                          const label = t(`eco.${subsidiary.id}.name` as never);
                          const tagline = t(`eco.${subsidiary.id}.tagline` as never);
                          const inner = (
                            <>
                              <span
                                className={`gw-menu-icon tone-${subsidiary.accent}`}
                                aria-hidden="true"
                              >
                                <Icon size={15} />
                              </span>
                              <span className="gw-menu-copy">
                                <strong>{label}</strong>
                                <small>{tagline}</small>
                              </span>
                              {href ? (
                                <ArrowUpRight
                                  size={15}
                                  aria-hidden="true"
                                  className="gw-menu-item-arrow"
                                />
                              ) : (
                                <span className="gw-menu-item-state">{t("app.switcher.soon")}</span>
                              )}
                            </>
                          );

                          return (
                            <li key={subsidiary.id}>
                              {href ? (
                                subsidiary.external ? (
                                  <a
                                    className="gw-menu-item"
                                    href={href}
                                    rel="noreferrer"
                                    onClick={close}
                                  >
                                    {inner}
                                  </a>
                                ) : (
                                  <Link className="gw-menu-item" to={href as never} onClick={close}>
                                    {inner}
                                  </Link>
                                )
                              ) : (
                                <span className="gw-menu-item is-soon" aria-disabled="true">
                                  {inner}
                                </span>
                              )}
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  );
                })}
              </div>
            </section>

            <section className="gw-menu-side">
              {links.length > 0 ? (
                <>
                  <p className="gw-menu-title">{t("nav.onThisSite")}</p>
                  <ul className="gw-menu-links">
                    {links.map((link) => (
                      <li key={link.href}>
                        {link.href.startsWith("/") ? (
                          <Link to={link.href as never} onClick={close}>
                            {link.label}
                          </Link>
                        ) : (
                          <a href={link.href} onClick={close}>
                            {link.label}
                          </a>
                        )}
                      </li>
                    ))}
                  </ul>
                </>
              ) : null}

              <div className="gw-menu-lang">
                <p className="gw-menu-title">
                  <Languages size={13} aria-hidden="true" /> {t("prefs.title")}
                </p>
                <div className="gw-menu-lang-list">
                  {LOCALES.map((option) => (
                    <button
                      key={option.id}
                      type="button"
                      className={option.id === locale ? "is-active" : undefined}
                      aria-pressed={option.id === locale}
                      onClick={() => setLocale(option.id)}
                    >
                      {option.native}
                      {option.id === locale ? <Check size={13} aria-hidden="true" /> : null}
                    </button>
                  ))}
                </div>
              </div>

              <Link className="gw-menu-all" to="/" hash="businesses" onClick={close}>
                {t("nav.familyAll", { count: SUBSIDIARIES.length })}
                <ArrowUpRight size={14} aria-hidden="true" />
              </Link>
            </section>
          </div>

          {(cta || action) && (
            <div className="gw-menu-foot">
              {cta ? (
                cta.href.startsWith("/") ? (
                  <Link className="gw-menu-cta" to={cta.href as never} onClick={close}>
                    {cta.label}
                    <ArrowUpRight size={14} aria-hidden="true" />
                  </Link>
                ) : (
                  <a className="gw-menu-cta" href={cta.href} onClick={close}>
                    {cta.label}
                    <ArrowUpRight size={14} aria-hidden="true" />
                  </a>
                )
              ) : (
                <span />
              )}
              {action ? (
                action.href.startsWith("/") ? (
                  <Link className="gw-menu-action" to={action.href as never} onClick={close}>
                    {action.label}
                  </Link>
                ) : (
                  <a className="gw-menu-action" href={action.href} onClick={close}>
                    {action.label}
                  </a>
                )
              ) : null}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
