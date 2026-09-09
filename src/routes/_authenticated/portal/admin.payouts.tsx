import { createFileRoute } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { WalletCards } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { PortalPage } from '@/components/PortalShell';

export const Route = createFileRoute('/_authenticated/portal/admin/payouts')({
  component: Payouts,
});

function Payouts() {
  const [rows, setRows] = useState<any[]>([]);

  useEffect(() => {
    void (supabase as any)
      .from('payout_requests')
      .select('*')
      .eq('status', 'pending')
      .then(({ data }: any) => setRows(data ?? []));
  }, []);

  async function decide(id: string, status: 'approved' | 'rejected') {
    await (supabase as any)
      .from('payout_requests')
      .update({ status, processed_at: new Date().toISOString() })
      .eq('id', id);
    setRows((x) => x.filter((r) => r.id !== id));
  }

  return (
    <PortalPage
      eyebrow="ADMIN PORTAL"
      title="Payouts"
      intro="Payout requests waiting for approval."
      icon={WalletCards}
    >
      <section className="portal-section">
        {rows.length === 0 ? (
          <div className="empty-card">No pending payout requests.</div>
        ) : (
          <div className="portal-grid">
            {rows.map((r) => (
              <article className="portal-card" key={r.id}>
                <WalletCards size={20} />
                <h3>
                  {r.currency} {Number(r.amount).toLocaleString()}
                </h3>
                <p>Talent: {r.talent_id}</p>
                <div className="project-actions">
                  <button className="button" onClick={() => decide(r.id, 'approved')}>
                    Approve
                  </button>
                  <button onClick={() => decide(r.id, 'rejected')}>Reject</button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </PortalPage>
  );
}
