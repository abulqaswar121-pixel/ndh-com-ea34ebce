import { type ReactNode } from 'react';

export function Reveal({ children, delay = 0 }: { children: ReactNode; delay?: number }) {
  // Content must never be invisible while hydration or an observer is delayed.
  void delay;
  return <div className="reveal is-visible">{children}</div>;
}
