import { createFileRoute } from '@tanstack/react-router';
import { UsersRound } from 'lucide-react';
import { PortalPage } from '@/components/PortalShell';
import { UsersAndRoles } from '@/components/admin/UsersAndApplications';

export const Route = createFileRoute('/_authenticated/portal/admin/users')({
  component: () => (
    <PortalPage
      eyebrow="ADMIN PORTAL"
      title="People & roles"
      intro="Search anyone and switch their access on or off."
      icon={UsersRound}
    >
      <section className="portal-section">
        <UsersAndRoles />
      </section>
    </PortalPage>
  ),
});
