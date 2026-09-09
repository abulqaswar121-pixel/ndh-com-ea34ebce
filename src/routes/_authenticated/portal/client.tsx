import { createFileRoute, Outlet } from '@tanstack/react-router';
import { PortalShell } from '@/components/PortalShell';
import { RequireRole } from '@/components/RequireRole';

export const Route = createFileRoute('/_authenticated/portal/client')({
  component: () => (
    <RequireRole role="client">
      <PortalShell role="client">
        <Outlet />
      </PortalShell>
    </RequireRole>
  ),
});
