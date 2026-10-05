import { useEffect, useRef, useState } from "react";
import { Activity, Globe2, Radio } from "lucide-react";
import {
  ECOSYSTEM_METRICS,
  NETWORK_COUNTRIES,
  NETWORK_FLAGS,
  type Metric,
} from "@/lib/ecosystem";
import { useI18n } from "@/lib/preferences";

/**
 * Count-up that starts from the real value, so the server-rendered number is
 * always correct for crawlers and for anyone with JavaScript disabled. The
 * animation only rewinds and replays once the panel is actually in view.
 */
function useCountUp(metric: Metric, enabled: boolean) {
  const [display, setDisplay] = useState(metric.value);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!enabled) return;
    const node = ref.current;
    if (!node || typeof IntersectionObserver === "undefined") return;

    let frame = 0;
    let timer = 0;
    const prefersReducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry?.isIntersecting) return;
        observer.disconnect();

        const duration = 900;
        const start = performance.now();
        const tick = (now: number) => {
          const progress = Math.min(1, (now - start) / duration);
          const eased = 1 - Math.pow(1 - progress, 3);
          setDisplay(metric.value * eased);
          if (progress < 1) frame = requestAnimationFrame(tick);
        };
        // Rewind only after paint so hydration never sees a mismatched value.
        timer = window.setTimeout(() => {
          setDisplay(0);
          frame = requestAnimationFrame(tick);
        }, 120);
      },
      { threshold: 0.35 },
    );

    observer.observe(node);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
      window.clearTimeout(timer);
    };
  }, [metric.value, enabled]);

  const precision = metric.precision ?? 0;
  const value =
    precision > 0 ? display.toFixed(precision) : Math.round(display).toLocaleString("en-US");

  return { ref, value };
}

function MetricTile({ metric }: { metric: Metric }) {
  const { t } = useI18n();
  const [enabled, setEnabled] = useState(false);
  const { ref, value } = useCountUp(metric, enabled);

  useEffect(() => {
    // Defer the animation past hydration so the first paint matches the SSR
    // output exactly (real figures, not zeros).
    const handle = window.setTimeout(() => setEnabled(true), 250);
    return () => window.clearTimeout(handle);
  }, []);

  return (
    <div className="gw-metric">
      <span className="gw-metric-value" ref={ref}>
        {value}
        <i aria-hidden="true">{metric.suffix}</i>
      </span>
      <span className="gw-metric-label">{t(`metric.${metric.id}` as never)}</span>
    </div>
  );
}

export function LiveStatusBar() {
  const { t } = useI18n();

  return (
    <section className="ecosystem-status gw-section" id="status" aria-labelledby="gw-status-heading">
      <div className="gw-panel gw-status">
        <div className="gw-status-head">
          <p className="gw-eyebrow">
            <Activity size={14} aria-hidden="true" /> {t("home.stats.eyebrow")}
          </p>
          <h2 id="gw-status-heading">{t("home.stats.title")}</h2>
          <p className="gw-section-lead">{t("home.stats.lead")}</p>
        </div>

        <div className="gw-metrics">
          {ECOSYSTEM_METRICS.map((metric) => (
            <MetricTile key={metric.id} metric={metric} />
          ))}
        </div>

        <div className="gw-status-foot">
          <p className="gw-status-network">
            <Globe2 size={14} aria-hidden="true" />
            <b>{t("home.stats.countriesLabel")}</b>
            <span className="gw-country-list">
              {NETWORK_COUNTRIES.map((country, index) => (
                <span className="gw-country" key={country}>
                  <i aria-hidden="true">{NETWORK_FLAGS[index]}</i>
                  {country}
                </span>
              ))}
            </span>
          </p>
          <p className="gw-status-note">
            <Radio size={13} aria-hidden="true" /> {t("home.stats.updated")}
          </p>
        </div>
      </div>
    </section>
  );
}
