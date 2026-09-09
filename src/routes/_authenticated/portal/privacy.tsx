import { createFileRoute } from '@tanstack/react-router';
import { PortalFrame } from '@/components/PortalShell';
import { LegalPrivacy } from '@/components/portal/LegalContent';

export const Route = createFileRoute('/_authenticated/portal/privacy')({
  component: () => (
    <PortalFrame>
      <main className="portal portal-main">
        <LegalPrivacy />
      </main>
    </PortalFrame>
  ),
});
