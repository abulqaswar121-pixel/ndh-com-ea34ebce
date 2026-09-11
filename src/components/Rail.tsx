import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export function Rail({
  children,
  label,
  className = '',
}: {
  children: ReactNode;
  label: string;
  className?: string;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  const sync = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    setAtStart(el.scrollLeft <= 4);
    setAtEnd(max <= 4 || el.scrollLeft >= max - 4);
  }, []);

  useEffect(() => {
    sync();
    const el = trackRef.current;
    if (!el) return;
    const ro = new ResizeObserver(sync);
    ro.observe(el);
    return () => ro.disconnect();
  }, [sync]);

  const nudge = (dir: 1 | -1) => {
    const el = trackRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * Math.max(280, el.clientWidth * 0.8), behavior: 'smooth' });
  };

  return (
    <div className={`rail ${atEnd ? 'is-end' : ''} ${className}`.trim()}>
      <div className="rail-track" ref={trackRef} onScroll={sync} role="group" aria-label={label}>
        {children}
      </div>
      <div className="rail-nav">
        <button type="button" aria-label={`Scroll ${label} left`} onClick={() => nudge(-1)} disabled={atStart}>
          <ChevronLeft size={18} />
        </button>
        <button type="button" aria-label={`Scroll ${label} right`} onClick={() => nudge(1)} disabled={atEnd}>
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
}
