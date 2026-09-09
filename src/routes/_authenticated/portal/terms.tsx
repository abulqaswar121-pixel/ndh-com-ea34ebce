import { createFileRoute } from '@tanstack/react-router';
import { PortalFrame } from '@/components/PortalShell';
import { LegalTerms } from '@/components/portal/LegalContent';

export const Route = createFileRoute('/_authenticated/portal/terms')({
  component: () => (
    <PortalFrame>
      <main className="portal portal-main">
        <LegalTerms />
      </main>
    </PortalFrame>
  ),
});
