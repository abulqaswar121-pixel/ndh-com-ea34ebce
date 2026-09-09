import { createFileRoute, Outlet } from '@tanstack/react-router';
import { PortalShell } from '@/components/PortalShell';
import { RequireRole } from '@/components/RequireRole';

export const Route = createFileRoute('/_authenticated/portal/admin')({
  component: () => (
    <RequireRole role="admin">
      <PortalShell role="admin">
        <Outlet />
      </PortalShell>
    </RequireRole>
  ),
});
