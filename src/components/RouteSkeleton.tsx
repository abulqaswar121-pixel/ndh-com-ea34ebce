import { PageShell } from '@/components/PageShell';

/** Branded loading state shown while a route's data is still in flight (TanStack pendingComponent). */
export function RouteSkeleton({ rows = 3 }: { rows?: number }) {
  return (
    <PageShell>
      <div className="route-skeleton" aria-busy="true" aria-label="Loading">
        <div className="route-skeleton-block" style={{ height: 22, width: '18%', marginBottom: 18 }} />
        <div className="route-skeleton-block" style={{ height: 44, width: '58%', marginBottom: 34 }} />
        <div style={{ display: 'grid', gap: 22, gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))' }}>
          {Array.from({ length: rows }).map((_, i) => (
            <div key={i} className="route-skeleton-block" style={{ height: 260 }} />
          ))}
        </div>
      </div>
    </PageShell>
  );
}
