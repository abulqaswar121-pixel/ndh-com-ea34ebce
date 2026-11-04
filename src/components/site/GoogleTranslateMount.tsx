import { useEffect } from "react";
import { useRouterState } from "@tanstack/react-router";
import {
  DEFAULT_LANG,
  TRANSLATE_ELEMENT_ID,
  applyDocumentLanguage,
  ensureTranslateEngine,
  readStoredLanguage,
  translatePage,
} from "@/lib/i18n/google-translate";

/**
 * Mounts Google's translation engine once, invisibly.
 *
 * The widget host itself is hidden by CSS; visitors only ever see their chosen
 * language. Because the app navigates client-side, the engine is re-asked to
 * translate whenever the route changes — otherwise pages opened from the menu
 * would stay in English.
 */
export function GoogleTranslateMount() {
  const pathname = useRouterState({ select: (state) => state.location.pathname });

  useEffect(() => {
    const stored = readStoredLanguage();
    applyDocumentLanguage(stored);
    if (stored === DEFAULT_LANG) return;
    void translatePage(stored);
  }, []);

  useEffect(() => {
    const stored = readStoredLanguage();
    if (stored === DEFAULT_LANG) return;
    // Let React finish painting the new route, then translate its text nodes.
    const timer = window.setTimeout(() => {
      void ensureTranslateEngine().then(() => translatePage(stored));
    }, 260);
    return () => window.clearTimeout(timer);
  }, [pathname]);

  return (
    <div
      id={TRANSLATE_ELEMENT_ID}
      className="ndh-translate-host"
      aria-hidden="true"
      // Never let the engine rewrite its own control.
      translate="no"
    />
  );
}
