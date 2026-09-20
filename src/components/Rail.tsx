import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export function Rail({
  children,
  label,
  className = '',
  autoPlay = false,
  autoPlayInterval = 5200,
}: {
  children: ReactNode;
  label: string;
  className?: string;
  autoPlay?: boolean;
  autoPlayInterval?: number;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const railRef = useRef<HTMLDivElement>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

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

  useEffect(() => {
    const el = railRef.current;
    if (!el || !autoPlay) return;
    const observer = new IntersectionObserver(([entry]) => setIsVisible(entry.isIntersecting), {
      threshold: 0.55,
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, [autoPlay]);

  useEffect(() => {
    if (!autoPlay || !isVisible || isPaused || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const interval = window.setInterval(() => {
      const el = trackRef.current;
      if (!el) return;
      const max = el.scrollWidth - el.clientWidth;
      if (el.scrollLeft >= max - 4) {
        el.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        el.scrollBy({ left: Math.max(260, el.clientWidth * 0.72), behavior: 'smooth' });
      }
    }, Math.max(3000, autoPlayInterval));
    return () => window.clearInterval(interval);
  }, [autoPlay, autoPlayInterval, isPaused, isVisible]);

  const nudge = (dir: 1 | -1) => {
    const el = trackRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * Math.max(280, el.clientWidth * 0.8), behavior: 'smooth' });
  };

  return (
    <div
      ref={railRef}
      className={`rail ${atEnd ? 'is-end' : ''} ${className}`.trim()}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocusCapture={() => setIsPaused(true)}
      onBlurCapture={() => setIsPaused(false)}
      onTouchStart={() => setIsPaused(true)}
      onPointerDown={() => setIsPaused(true)}
    >
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
