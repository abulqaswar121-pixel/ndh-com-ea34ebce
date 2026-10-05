/**
 * Server-side read of the visitor's language cookie.
 *
 * The root route calls this during SSR so the first paint is already in the
 * right language. The handler is defensive: any parsing problem falls back to
 * the defaults rather than failing the whole render. Region is stored alongside
 * the language purely so the consultant keeps the visitor's detected region
 * across requests — it is never a user-facing control.
 */
import { createServerFn } from "@tanstack/react-start";
import { DEFAULT_LOCALE, LOCALES, type LocaleId } from "@/lib/i18n/dictionary";
import { DEFAULT_REGION, REGIONS, type RegionId } from "@/lib/region";
import { DEFAULT_PREFERENCES, PREFERENCES_COOKIE, type Preferences } from "@/lib/preferences";

export type PreferencesPayload = {
  prefs: Preferences;
  /** Whether the visitor has already chosen a language. */
  stored: boolean;
};

function isLocale(value: unknown): value is LocaleId {
  return typeof value === "string" && LOCALES.some((item) => item.id === value);
}

function isRegion(value: unknown): value is RegionId {
  return typeof value === "string" && REGIONS.some((item) => item.id === value);
}

export const readPreferences = createServerFn({ method: "GET" }).handler(
  async (): Promise<PreferencesPayload> => {
    try {
      // Imported inside the handler so the server-only module never reaches the
      // browser bundle, even though the handler itself is statically analysable.
      const { getCookie } = await import("@tanstack/react-start/server");
      const raw = getCookie(PREFERENCES_COOKIE);
      if (!raw) return { prefs: DEFAULT_PREFERENCES, stored: false };

      const parsed = JSON.parse(decodeURIComponent(raw)) as Partial<Preferences>;
      const prefs: Preferences = {
        locale: isLocale(parsed.locale) ? parsed.locale : DEFAULT_LOCALE,
        region: isRegion(parsed.region) ? parsed.region : DEFAULT_REGION,
      };
      return { prefs, stored: true };
    } catch (error) {
      console.warn("Preference cookie unreadable, using defaults:", error);
      return { prefs: DEFAULT_PREFERENCES, stored: false };
    }
  },
);
