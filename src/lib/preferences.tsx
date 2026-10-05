/**
 * Language preference and silent region detection for the whole ecosystem.
 *
 * SSR contract: the root route reads the preference cookie on the server and
 * passes it in as `initial`, so the first paint already matches the visitor's
 * language — no flash of English, no hydration mismatch. Changing the language
 * writes the cookie directly from the click handler (never during render) so
 * the next request is server-rendered in the new language too.
 *
 * Region is detected automatically from the browser timezone and is never a
 * user-facing control: it only sharpens the Omni-Hub consultant's answers.
 */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  DEFAULT_LOCALE,
  localeDirection,
  translate,
  type LocaleId,
  type TranslationKey,
} from "@/lib/i18n/dictionary";
import { DEFAULT_REGION, detectRegion, type RegionId } from "@/lib/region";

export type Preferences = {
  locale: LocaleId;
  /** Auto-detected; travels with the consultant, never shown as a control. */
  region: RegionId;
};

export const DEFAULT_PREFERENCES: Preferences = {
  locale: DEFAULT_LOCALE,
  region: DEFAULT_REGION,
};

export const PREFERENCES_COOKIE = "ndh_prefs";

type PreferencesContextValue = {
  locale: LocaleId;
  region: RegionId;
  /** Text direction for the active locale. */
  dir: "ltr" | "rtl";
  /** True once the visitor has made an explicit language choice. */
  stored: boolean;
  setLocale: (locale: LocaleId) => void;
  /** Translate a key, with `{placeholder}` interpolation and English fallback. */
  t: (key: TranslationKey, vars?: Record<string, string | number>) => string;
};

const PreferencesContext = createContext<PreferencesContextValue | null>(null);

function writePreferencesCookie(prefs: Preferences) {
  if (typeof document === "undefined") return;
  const value = encodeURIComponent(JSON.stringify(prefs));
  const secure =
    typeof location !== "undefined" && location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${PREFERENCES_COOKIE}=${value}; Path=/; Max-Age=31536000; SameSite=Lax${secure}`;
}

export function PreferencesProvider({
  children,
  initial,
  stored = false,
}: {
  children: ReactNode;
  initial?: Preferences;
  stored?: boolean;
}) {
  const [prefs, setPrefs] = useState<Preferences>(initial ?? DEFAULT_PREFERENCES);
  const [hasStored, setHasStored] = useState(stored);

  const setLocale = useCallback(
    (locale: LocaleId) => {
      const next: Preferences = { ...prefs, locale };
      setPrefs(next);
      setHasStored(true);
      writePreferencesCookie(next);
    },
    [prefs],
  );

  /**
   * Match the visitor's region to the browser timezone. Runs after hydration so
   * SSR output stays deterministic, and once per visit: there is no control to
   * override it, so a detected value is simply kept.
   */
  useEffect(() => {
    let timeZone: string | undefined;
    try {
      timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    } catch {
      return;
    }
    const detected = detectRegion(timeZone);
    if (!detected) return;
    setPrefs((current) => {
      if (current.region === detected) return current;
      const next = { ...current, region: detected };
      // Only persist once the visitor has made a language choice; otherwise the
      // detected region simply applies to this visit.
      if (hasStored) writePreferencesCookie(next);
      return next;
    });
  }, [hasStored]);

  const dir = localeDirection(prefs.locale);

  /** Keep the document honest for screen readers and RTL layout. */
  useEffect(() => {
    if (typeof document === "undefined") return;
    const root = document.documentElement;
    root.lang = prefs.locale;
    root.dir = dir;
  }, [prefs.locale, dir]);

  const value = useMemo<PreferencesContextValue>(
    () => ({
      locale: prefs.locale,
      region: prefs.region,
      dir,
      stored: hasStored,
      setLocale,
      t: (key, vars) => translate(prefs.locale, key, vars),
    }),
    [prefs, dir, hasStored, setLocale],
  );

  return <PreferencesContext.Provider value={value}>{children}</PreferencesContext.Provider>;
}

export function usePreferences(): PreferencesContextValue {
  const context = useContext(PreferencesContext);
  if (!context) {
    throw new Error("usePreferences must be used inside <PreferencesProvider>");
  }
  return context;
}

/** Convenience hook for components that only need translation. */
export function useI18n() {
  const { t, locale, dir } = usePreferences();
  return { t, locale, dir };
}
