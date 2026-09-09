import { createFileRoute, Outlet } from '@tanstack/react-router';
import { PortalShell } from '@/components/PortalShell';
import { RequireRole } from '@/components/RequireRole';

export const Route = createFileRoute('/_authenticated/portal/pm')({
  component: () => (
    <RequireRole role="pm">
      <PortalShell role="pm">
        <Outlet />
      </PortalShell>
    </RequireRole>
  ),
});
