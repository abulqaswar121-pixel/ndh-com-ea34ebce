import { useCallback, useEffect, useId, useRef, useState } from "react";
import { Check, ChevronDown, Globe } from "lucide-react";
import {
  DEFAULT_LANG,
  LANG_EVENT,
  TRANSLATE_LANGUAGES,
  changeLanguage,
  languageFor,
  readStoredLanguage,
  type TranslateLangId,
} from "@/lib/i18n/google-translate";

/**
 * The site's only language control. It drives Google's translation engine
 * (see `google-translate.ts`) and keeps every instance on the page in sync
 * through a `ndh:language` window event.
 */
export function useTranslateLanguage() {
  const [language, setLanguage] = useState<TranslateLangId>(DEFAULT_LANG);

  useEffect(() => {
    setLanguage(readStoredLanguage());
    const onChange = (event: Event) => {
      const next = (event as CustomEvent<TranslateLangId>).detail;
      if (next) setLanguage(next);
    };
    window.addEventListener(LANG_EVENT, onChange);
    return () => window.removeEventListener(LANG_EVENT, onChange);
  }, []);

  const select = useCallback((id: TranslateLangId) => {
    setLanguage(id);
    changeLanguage(id);
  }, []);

  return { language, select, current: languageFor(language) };
}

/** Compact globe control for the header (desktop and mobile top bar). */
export function LanguageSwitcher({ onPick }: { onPick?: () => void }) {
  const { language, select, current } = useTranslateLanguage();
  const [open, setOpen] = useState(false);
  const wrap = useRef<HTMLDivElement>(null);
  const listId = useId();

  useEffect(() => {
    if (!open) return;
    const onDown = (event: MouseEvent) => {
      if (!wrap.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div className="ndh-lang" ref={wrap}>
      <button
        type="button"
        className="ndh-lang-btn"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={listId}
        aria-label={`Language: ${current.english}. Change language`}
        onClick={() => setOpen((value) => !value)}
      >
        <Globe size={17} aria-hidden="true" />
        <span className="ndh-lang-code">{current.code}</span>
        <ChevronDown size={13} aria-hidden="true" className="ndh-lang-caret" />
      </button>

      {open ? (
        <div className="ndh-lang-menu" id={listId} role="group" aria-label="Choose a language">
          {TRANSLATE_LANGUAGES.map((option) => (
            <button
              key={option.id}
              type="button"
              aria-pressed={option.id === language}
              className={`ndh-lang-option${option.id === language ? " is-active" : ""}`}
              onClick={() => {
                select(option.id);
                setOpen(false);
                onPick?.();
              }}
            >
              <span className="ndh-lang-native" lang={option.id} dir={option.dir}>
                {option.native}
              </span>
              <span className="ndh-lang-en">{option.code}</span>
              {option.id === language ? <Check size={15} aria-hidden="true" /> : null}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}

/** Full-width picker for the mobile drawer and the family menu panel. */
export function LanguageList({
  className = "",
  onPick,
}: {
  className?: string;
  onPick?: () => void;
}) {
  const { language, select } = useTranslateLanguage();

  return (
    <div
      className={`ndh-lang-list${className ? ` ${className}` : ""}`}
      role="group"
      aria-label="Language"
    >
      {TRANSLATE_LANGUAGES.map((option) => (
        <button
          key={option.id}
          type="button"
          aria-pressed={option.id === language}
          className={`ndh-lang-chip${option.id === language ? " is-active" : ""}`}
          onClick={() => {
            select(option.id);
            onPick?.();
          }}
        >
          <span lang={option.id} dir={option.dir}>
            {option.native}
          </span>
          <small>{option.code}</small>
          {option.id === language ? <Check size={14} aria-hidden="true" /> : null}
        </button>
      ))}
    </div>
  );
}
