/**
 * Google-Translate powered language switching.
 *
 * The public site ships in English. Instead of maintaining five hand-written
 * dictionaries, the parent app mounts Google's own translation engine behind a
 * custom control: the visitor picks a language, the page is translated in
 * place, and the choice is stored in a first-party cookie so every later page
 * (and every later visit) opens in the same language.
 *
 * Everything Google injects into the page (banner frame, tooltips, "Powered by
 * Google" marks) is hidden by the `.ndh-translate` rules in `styles.css`, so the
 * translated site still reads as a native, hand-built experience.
 *
 * If the engine cannot load — offline, blocked, extension — the helpers below
 * fail quietly: the site keeps working in English and the chosen language is
 * still remembered.
 */

export type TranslateLangId = "en" | "ar" | "fr" | "es" | "zh";

export type TranslateLanguage = {
  id: TranslateLangId;
  /** Short code shown in the compact header control. */
  code: string;
  /** Endonym: the language written in itself. */
  native: string;
  english: string;
  dir: "ltr" | "rtl";
};

export const TRANSLATE_LANGUAGES: readonly TranslateLanguage[] = [
  { id: "en", code: "EN", native: "English", english: "English", dir: "ltr" },
  { id: "ar", code: "AR", native: "العربية", english: "Arabic", dir: "rtl" },
  { id: "fr", code: "FR", native: "Français", english: "French", dir: "ltr" },
  { id: "es", code: "ES", native: "Español", english: "Spanish", dir: "ltr" },
  { id: "zh", code: "ZH", native: "中文", english: "Chinese", dir: "ltr" },
];

export const DEFAULT_LANG: TranslateLangId = "en";
export const LANG_COOKIE = "ndh_lang";
export const LANG_EVENT = "ndh:language";
export const TRANSLATE_ELEMENT_ID = "google_translate_element";
const TRANSLATE_SCRIPT_ID = "ndh-google-translate";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

export function isTranslateLang(value: unknown): value is TranslateLangId {
  return TRANSLATE_LANGUAGES.some((language) => language.id === value);
}

export function languageFor(id: TranslateLangId): TranslateLanguage {
  return TRANSLATE_LANGUAGES.find((language) => language.id === id) ?? TRANSLATE_LANGUAGES[0];
}

/* ------------------------------------------------------------------ cookies */

function readCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp(`(?:^|;\\s*)${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

function writeCookie(name: string, value: string, maxAge = COOKIE_MAX_AGE) {
  if (typeof document === "undefined") return;
  const parts = [
    `${name}=${encodeURIComponent(value)}`,
    "path=/",
    `max-age=${maxAge}`,
    "SameSite=Lax",
  ];
  document.cookie = parts.join("; ");
  // Also write the registrable-domain variant so www and the apex share a choice.
  const host = window.location.hostname;
  const segments = host.split(".");
  if (segments.length > 2) {
    const parent = segments.slice(-2).join(".");
    document.cookie = [...parts, `domain=.${parent}`].join("; ");
  }
}

function clearCookie(name: string) {
  if (typeof document === "undefined") return;
  document.cookie = `${name}=; path=/; max-age=0`;
  const segments = window.location.hostname.split(".");
  if (segments.length > 2) {
    document.cookie = `${name}=; path=/; domain=.${segments.slice(-2).join(".")}; max-age=0`;
  }
}

/** The language the visitor picked (English when nothing is stored). */
export function readStoredLanguage(): TranslateLangId {
  const stored = readCookie(LANG_COOKIE);
  if (isTranslateLang(stored)) return stored;
  // Fall back to Google's own cookie, e.g. "/en/ar".
  const legacy = readCookie("googtrans");
  if (legacy) {
    const target = legacy.split("/").filter(Boolean).pop();
    if (isTranslateLang(target)) return target;
  }
  return DEFAULT_LANG;
}

/** Keep <html lang> and <html dir> truthful for screen readers and RTL. */
export function applyDocumentLanguage(id: TranslateLangId) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  root.lang = id;
  root.dir = languageFor(id).dir;
}

/** Store the choice, drive the engine, and broadcast it to every switcher. */
export function changeLanguage(id: TranslateLangId) {
  if (typeof document === "undefined") return;
  writeCookie(LANG_COOKIE, id);
  if (id === DEFAULT_LANG) {
    clearCookie("googtrans");
  } else {
    // Google reads `/source/target`; English is the page's source language.
    writeCookie("googtrans", `/en/${id}`);
  }
  applyDocumentLanguage(id);
  window.dispatchEvent(new CustomEvent<TranslateLangId>(LANG_EVENT, { detail: id }));
  if (id === DEFAULT_LANG) {
    clearTranslation();
  } else {
    void translatePage(id);
  }
}

/* ------------------------------------------------------- google translate */

type TranslateCombo = HTMLSelectElement;

type GoogleTranslateApi = {
  translate: {
    TranslateElement: new (
      options: Record<string, unknown>,
      element: string | HTMLElement,
    ) => unknown;
  };
};

declare global {
  interface Window {
    google?: Partial<GoogleTranslateApi> & { translate?: GoogleTranslateApi["translate"] };
    googleTranslateElementInit?: () => void;
  }
}

let loading: Promise<boolean> | null = null;

function elementContainer(): HTMLElement | null {
  if (typeof document === "undefined") return null;
  return document.getElementById(TRANSLATE_ELEMENT_ID);
}

let domPatched = false;
/**
 * Google wraps translated text in <font> tags behind React's back. When React
 * later removes or moves those nodes it throws and the whole page goes blank.
 * These guards make those calls safe no-ops instead of crashes.
 */
export function patchDomForTranslate() {
  if (domPatched || typeof Node === "undefined") return;
  domPatched = true;
  const origRemove = Node.prototype.removeChild;
  Node.prototype.removeChild = function <T extends Node>(this: Node, child: T): T {
    if (child.parentNode !== this) {
      if (child.parentNode) child.parentNode.removeChild(child);
      return child;
    }
    return origRemove.call(this, child) as T;
  };
  const origInsert = Node.prototype.insertBefore;
  Node.prototype.insertBefore = function <T extends Node>(
    this: Node,
    node: T,
    ref: Node | null,
  ): T {
    if (ref && ref.parentNode !== this) return origInsert.call(this, node, null) as T;
    return origInsert.call(this, node, ref) as T;
  };
}

/** Injects Google's script once and resolves when the widget exists. */
export function ensureTranslateEngine(): Promise<boolean> {
  if (typeof window === "undefined" || typeof document === "undefined") {
    return Promise.resolve(false);
  }
  patchDomForTranslate();
  if (loading) return loading;

  loading = new Promise<boolean>((resolve) => {
    const finish = () => resolve(Boolean(window.google?.translate?.TranslateElement));

    const mount = () => {
      const host = elementContainer();
      if (!host || !window.google?.translate?.TranslateElement) {
        finish();
        return;
      }
      try {
        new window.google.translate.TranslateElement(
          {
            pageLanguage: "en",
            includedLanguages: TRANSLATE_LANGUAGES.map((language) => language.id).join(","),
            autoDisplay: false,
            multilanguagePage: true,
          },
          host,
        );
        resolve(true);
      } catch {
        resolve(false);
      }
    };

    if (window.google?.translate?.TranslateElement) {
      mount();
      return;
    }
    if (document.getElementById(TRANSLATE_SCRIPT_ID)) {
      // Script already requested by an earlier mount: wait for it.
      const timer = window.setInterval(() => {
        if (window.google?.translate?.TranslateElement) {
          window.clearInterval(timer);
          mount();
        }
      }, 200);
      window.setTimeout(() => window.clearInterval(timer), 8000);
      return;
    }

    window.googleTranslateElementInit = mount;
    const script = document.createElement("script");
    script.id = TRANSLATE_SCRIPT_ID;
    script.src =
      "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
    script.async = true;
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
    // Never hold the caller hostage if Google is slow or blocked.
    window.setTimeout(finish, 8000);
  });

  return loading;
}

function combo(): TranslateCombo | null {
  return document.querySelector<TranslateCombo>("select.goog-te-combo");
}

/** Ask the engine to translate the current DOM into `id`. */
export async function translatePage(id: TranslateLangId): Promise<void> {
  if (typeof document === "undefined") return;
  applyDocumentLanguage(id);
  const ready = await ensureTranslateEngine();
  if (!ready) return;

  const attempt = (tries: number) => {
    const select = combo();
    if (!select) {
      if (tries > 0) window.setTimeout(() => attempt(tries - 1), 300);
      return;
    }
    if (select.value === id) {
      // Already pointing at the right language: nudge it so freshly rendered
      // content (client-side navigation) is translated too.
      select.dispatchEvent(new Event("change"));
      return;
    }
    select.value = id;
    select.dispatchEvent(new Event("change"));
  };

  window.setTimeout(() => attempt(6), 120);
}

/** Restore the original English text without a page reload. */
export function clearTranslation() {
  const select = combo();
  if (select && select.value) {
    select.value = "en";
    select.dispatchEvent(new Event("change"));
  }
  document.querySelectorAll(".goog-te-banner-frame").forEach((frame) => frame.remove());
  document.body.style.removeProperty("top");

  // Google does not always restore the source text in place. If the document
  // is still marked as translated a moment later, reload once — the cleared
  // cookie makes the fresh page English.
  if (typeof window === "undefined") return;
  window.setTimeout(() => {
    const root = document.documentElement;
    const stillTranslated =
      root.classList.contains("translated-ltr") || root.classList.contains("translated-rtl");
    if (!stillTranslated) return;
    try {
      if (window.sessionStorage.getItem("ndh_lang_reload") === "1") return;
      window.sessionStorage.setItem("ndh_lang_reload", "1");
    } catch {
      /* storage blocked: just reload */
    }
    window.location.reload();
  }, 900);
}

/** Re-run translation after a client-side route change. */
export function retranslateForRoute() {
  const id = readStoredLanguage();
  if (id === DEFAULT_LANG) return;
  void translatePage(id);
}
