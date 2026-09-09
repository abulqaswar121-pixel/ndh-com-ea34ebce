import { createFileRoute } from '@tanstack/react-router';
import { ShieldCheck } from 'lucide-react';
import { PortalPage } from '@/components/PortalShell';
import { useClientInvoices } from '@/components/portal/client-data';

export const Route = createFileRoute('/_authenticated/portal/client/escrow')({
  component: Escrow,
});

function Escrow() {
  const { escrow } = useClientInvoices();
  return (
    <PortalPage
      eyebrow="CLIENT PORTAL"
      title="Escrow"
      intro="Funds held and released as milestones are approved."
      icon={ShieldCheck}
    >
      <section className="portal-section">
        {escrow.length === 0 ? (
          <div className="empty-card">Escrow updates for your projects will appear here.</div>
        ) : (
          <div className="invoice-list">
            {escrow.map((e) => (
              <div className="invoice-row" key={e.id}>
                <span>
                  <b>
                    {e.currency} {Number(e.held_amount).toLocaleString()} held
                  </b>
                  <small>Released {Number(e.released_amount).toLocaleString()}</small>
                </span>
                <span className="status-pill">{e.state}</span>
              </div>
            ))}
          </div>
        )}
      </section>
    </PortalPage>
  );
}
