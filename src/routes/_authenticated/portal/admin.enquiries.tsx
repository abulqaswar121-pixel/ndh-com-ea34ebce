import { createFileRoute } from '@tanstack/react-router';
import { Mail } from 'lucide-react';
import { PortalPage } from '@/components/PortalShell';
import { EnquiriesInbox } from '@/components/admin/ContentManager';

export const Route = createFileRoute('/_authenticated/portal/admin/enquiries')({
  component: () => (
    <PortalPage eyebrow="ADMIN PORTAL" title="Enquiries" intro="Messages sent through the contact form." icon={Mail}>
      <section className="portal-section">
        <EnquiriesInbox />
      </section>
    </PortalPage>
  ),
});
