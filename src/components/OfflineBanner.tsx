import { useEffect, useState } from 'react';
import { WifiOff } from 'lucide-react';

/**
 * Slim, dismiss-free connectivity banner. This only detects the browser's own
 * online/offline state (navigator.onLine + the online/offline events) — it does not
 * add offline page caching. True offline browsing would need a service worker /
 * app-shell cache, which is a bigger, separately-scoped project.
 */
export function OfflineBanner() {
  const [offline, setOffline] = useState(false);

  useEffect(() => {
    setOffline(typeof navigator !== 'undefined' && !navigator.onLine);
    const goOffline = () => setOffline(true);
    const goOnline = () => setOffline(false);
    window.addEventListener('offline', goOffline);
    window.addEventListener('online', goOnline);
    return () => {
      window.removeEventListener('offline', goOffline);
      window.removeEventListener('online', goOnline);
    };
  }, []);

  if (!offline) return null;

  return (
    <div className="offline-banner" role="status">
      <WifiOff size={15} />
      <span>You’re offline. Some pages and data may not load until your connection returns.</span>
    </div>
  );
}
