import { createFileRoute } from '@tanstack/react-router';
import { UserRound } from 'lucide-react';
import { PortalPage } from '@/components/PortalShell';
import { TalentProfileEditor } from '@/components/talent/TalentProfileEditor';

export const Route = createFileRoute('/_authenticated/portal/talent/profile')({
  component: () => (
    <PortalPage
      eyebrow="TALENT PORTAL"
      title="My profile"
      intro="How you appear when work is being assigned."
      icon={UserRound}
    >
      <section className="portal-section">
        <TalentProfileEditor />
      </section>
    </PortalPage>
  ),
});
