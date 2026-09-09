import { createFileRoute, Outlet } from '@tanstack/react-router';
import { PortalShell } from '@/components/PortalShell';
import { RequireRole } from '@/components/RequireRole';

export const Route = createFileRoute('/_authenticated/portal/talent')({
  component: () => (
    <RequireRole role="talent">
      <PortalShell role="talent">
        <Outlet />
      </PortalShell>
    </RequireRole>
  ),
});
