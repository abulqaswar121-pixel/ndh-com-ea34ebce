import { useEffect, useRef, useState, type ReactNode } from 'react';

export function Reveal({ children, delay = 0 }: { children: ReactNode; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  // Default to visible so content is never stuck hidden if JS is slow, an
  // observer never fires, or hydration is delayed — then let the observer
  // take over to play the entrance animation on first paint.
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    if (typeof IntersectionObserver === 'undefined') {
      setVisible(true);
      return;
    }

    // If it's already on screen at mount (e.g. above the fold), reveal
    // immediately rather than waiting for a scroll event that may never come.
    const rect = node.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.92 && rect.bottom > 0) {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.disconnect();
          }
        }
      },
      { threshold: 0.15, rootMargin: '0px 0px -8% 0px' },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className={visible ? 'reveal is-visible' : 'reveal'} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  );
}
