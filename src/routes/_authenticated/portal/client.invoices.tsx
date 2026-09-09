import { createFileRoute } from '@tanstack/react-router';
import { Receipt } from 'lucide-react';
import { PortalPage } from '@/components/PortalShell';
import { useClientInvoices } from '@/components/portal/client-data';

export const Route = createFileRoute('/_authenticated/portal/client/invoices')({
  component: Invoices,
});

function Invoices() {
  const { invoices } = useClientInvoices();
  return (
    <PortalPage eyebrow="CLIENT PORTAL" title="Invoices" intro="Every invoice raised on your projects." icon={Receipt}>
      <section className="portal-section">
        {invoices.length === 0 ? (
          <div className="empty-card">No invoices yet.</div>
        ) : (
          <div className="invoice-list">
            {invoices.map((i) => (
              <div className="invoice-row" key={i.id}>
                <span>
                  <b>{i.invoice_number}</b>
                  <small>Due {i.due_date || 'Not set'}</small>
                </span>
                <strong>
                  {i.currency} {Number(i.amount).toLocaleString()}
                </strong>
                <span className="status-pill">{i.status}</span>
              </div>
            ))}
          </div>
        )}
      </section>
    </PortalPage>
  );
}
