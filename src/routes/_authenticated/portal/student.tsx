import { createFileRoute, Outlet } from '@tanstack/react-router';
import { PortalShell } from '@/components/PortalShell';
import { RequireRole } from '@/components/RequireRole';

export const Route = createFileRoute('/_authenticated/portal/student')({
  component: () => (
    <RequireRole role="student">
      <PortalShell role="student">
        <Outlet />
      </PortalShell>
    </RequireRole>
  ),
});
