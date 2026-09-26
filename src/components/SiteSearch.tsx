import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Search, X, CornerDownLeft, Loader2 } from 'lucide-react';
import { siteSearchIndex } from '@/lib/nav-data';

type Result = { to: string; label: string; group: string; keywords?: string };

export function SiteSearchTrigger({ onOpen }: { onOpen: () => void }) {
  return (
    <button type="button" className="search-trigger" onClick={onOpen} aria-label="Search the site">
      <Search size={16} />
      <span className="search-trigger-label">Search</span>
      <kbd className="search-trigger-kbd">⌘K</kbd>
    </button>
  );
}

export function SiteSearch({ open, onOpen, onClose }: { open: boolean; onOpen: () => void; onClose: () => void }) {
  const [query, setQuery] = useState('');
  const [courseResults, setCourseResults] = useState<Result[] | null>(null);
  const [loadingCourses, setLoadingCourses] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  // Global Cmd+K / Ctrl+K shortcut, works even if the trigger button isn't focused.
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (!open) onOpen();
      }
      if (e.key === 'Escape' && open) onClose();
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  useEffect(() => {
    if (open) {
      inputRef.current?.focus();
      document.body.style.overflow = 'hidden';
      // Lazily fetch live course titles once per session so results stay accurate to the real catalog,
      // without ever blocking the modal from opening (falls back silently to the static page index).
      if (courseResults === null && !loadingCourses) {
        setLoadingCourses(true);
        import('@/lib/catalog.functions')
          .then((mod) => mod.listCourses())
          .then((rows) =>
            setCourseResults(
              rows.map((c) => ({ to: `/academy/${c.slug}`, label: c.title, group: 'Courses', keywords: c.summary ?? '' })),
            ),
          )
          .catch(() => setCourseResults([]))
          .finally(() => setLoadingCourses(false));
      }
    } else {
      document.body.style.overflow = '';
      setQuery('');
      setActiveIndex(0);
    }
    return () => {
      document.body.style.overflow = '';
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const results = useMemo<Result[]>(() => {
    const all = [...siteSearchIndex, ...(courseResults ?? [])];
    const q = query.trim().toLowerCase();
    if (!q) return all.slice(0, 8);
    return all.filter((r) => `${r.label} ${r.group} ${r.keywords ?? ''}`.toLowerCase().includes(q)).slice(0, 20);
  }, [query, courseResults]);

  function go(to: string) {
    onClose();
    navigate({ to: to as never });
  }

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const r = results[activeIndex];
      if (r) go(r.to);
    }
  }

  if (!open) return null;

  let lastGroup = '';

  return (
    <div className="search-modal-backdrop" onClick={onClose}>
      <div className="search-modal" role="dialog" aria-modal="true" aria-label="Site search" onClick={(e) => e.stopPropagation()}>
        <div className="search-modal-input">
          <Search size={18} />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setActiveIndex(0);
            }}
            onKeyDown={onKeyDown}
            placeholder="Search pages, services and courses…"
            aria-label="Search"
          />
          {loadingCourses && <Loader2 size={16} className="search-spin" aria-hidden="true" />}
          <button type="button" onClick={onClose} aria-label="Close search">
            <X size={18} />
          </button>
        </div>
        <div className="search-modal-results" role="listbox">
          {results.length === 0 && <p className="search-modal-empty">No matches yet — try “academy”, “brand” or “contact”.</p>}
          {results.map((r, i) => {
            const showGroup = r.group !== lastGroup;
            lastGroup = r.group;
            return (
              <div key={`${r.to}-${i}`}>
                {showGroup && <p className="search-modal-group">{r.group}</p>}
                <button
                  type="button"
                  className={i === activeIndex ? 'search-result is-active' : 'search-result'}
                  onMouseEnter={() => setActiveIndex(i)}
                  onClick={() => go(r.to)}
                  role="option"
                  aria-selected={i === activeIndex}
                >
                  <span>{r.label}</span>
                  {i === activeIndex && <CornerDownLeft size={14} />}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
