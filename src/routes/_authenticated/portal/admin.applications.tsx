import { createFileRoute } from '@tanstack/react-router';
import { Inbox } from 'lucide-react';
import { PortalPage } from '@/components/PortalShell';
import { TalentApplications } from '@/components/admin/UsersAndApplications';

export const Route = createFileRoute('/_authenticated/portal/admin/applications')({
  component: () => (
    <PortalPage
      eyebrow="ADMIN PORTAL"
      title="Talent applications"
      intro="Accept an applicant to send them an invitation, or decline politely."
      icon={Inbox}
    >
      <section className="portal-section">
        <TalentApplications />
      </section>
    </PortalPage>
  ),
});
