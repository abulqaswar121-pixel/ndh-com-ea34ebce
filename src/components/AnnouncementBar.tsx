import { useState } from 'react';
import { X } from 'lucide-react';
import { Link } from '@tanstack/react-router';

const messages: { text: string; to?: string }[] = [
  { text: 'New: real-time NG / international pricing on every Academy course', to: '/academy' },
  { text: 'Certified AI courses across 6 schools — finish, get assessed, get certified', to: '/academy' },
  { text: 'Full-service digital delivery: brief it, we scope, build and review it', to: '/agency' },
  { text: 'Browse recent client work and outcomes', to: '/work' },
];

const DISMISS_KEY = 'ndh-announcement-dismissed-v1';

export function AnnouncementBar() {
  const [dismissed, setDismissed] = useState(() => {
    if (typeof window === 'undefined') return false;
    try {
      return window.sessionStorage.getItem(DISMISS_KEY) === '1';
    } catch {
      return false;
    }
  });

  if (dismissed) return null;

  function dismiss() {
    setDismissed(true);
    try {
      window.sessionStorage.setItem(DISMISS_KEY, '1');
    } catch {
      /* ignore storage errors */
    }
  }

  // Duplicate the list so the CSS marquee loop is seamless.
  const loop = [...messages, ...messages];

  return (
    <div className="announcement-bar" role="region" aria-label="Announcements">
      <div className="announcement-track" aria-hidden={false}>
        <div className="announcement-track-inner">
          {loop.map((item, i) =>
            item.to ? (
              <Link key={i} to={item.to} className="announcement-item">
                {item.text}
              </Link>
            ) : (
              <span key={i} className="announcement-item">
                {item.text}
              </span>
            ),
          )}
        </div>
      </div>
      <button type="button" className="announcement-dismiss" aria-label="Dismiss announcement" onClick={dismiss}>
        <X size={14} />
      </button>
    </div>
  );
}
