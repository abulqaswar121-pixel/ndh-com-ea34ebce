import { createFileRoute } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { WalletCards } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { PortalPage } from '@/components/PortalShell';

export const Route = createFileRoute('/_authenticated/portal/admin/payouts')({
  component: Payouts,
});

type Row = {
  id: string;
  talent_id: string;
  amount: number;
  currency: string;
  requested_at: string;
  name?: string;
  email?: string;
  available?: number;
};

function Payouts() {
  const [rows, setRows] = useState<Row[]>([]);

  useEffect(() => {
    void (async () => {
      const { data: requests } = await (supabase as any)
        .from('payout_requests')
        .select('id, talent_id, amount, currency, requested_at')
        .eq('status', 'pending')
        .order('requested_at', { ascending: true });
      const list = (requests ?? []) as Row[];
      const ids = [...new Set(list.map((r) => r.talent_id))];
      if (ids.length > 0) {
        const [{ data: profiles }, { data: earnings }] = await Promise.all([
          (supabase as any).from('profiles').select('id, full_name, email').in('id', ids),
          (supabase as any).from('talent_earnings').select('talent_id, available_amount').in('talent_id', ids),
        ]);
        const nameOf = new Map<string, string>((profiles ?? []).map((p: any) => [p.id as string, (p.full_name || p.email) as string]));
        const availOf = new Map<string, number>((earnings ?? []).map((e: any) => [e.talent_id as string, Number(e.available_amount)]));
        for (const r of list) {
          r.name = nameOf.get(r.talent_id);
          r.available = availOf.get(r.talent_id) ?? 0;
        }
      }
      setRows(list);
    })();
  }, []);

  async function decide(id: string, status: 'paid' | 'rejected') {
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
      intro="Payout requests waiting for approval. Mark as paid once the transfer is done."
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
                <p>{r.name || r.talent_id}</p>
                <p>
                  Available balance: {r.currency} {Number(r.available ?? 0).toLocaleString()}
                </p>
                <p>Requested: {new Date(r.requested_at).toLocaleDateString()}</p>
                <div className="project-actions">
                  <button className="button" onClick={() => decide(r.id, 'paid')}>
                    Mark as paid
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
