import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { Banknote, ClipboardCheck, WalletCards } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { PortalPage } from '@/components/PortalShell';
import { useAuth } from '@/lib/auth';
import { useTalentEarnings } from '@/components/portal/talent-data';

export const Route = createFileRoute('/_authenticated/portal/talent/earnings')({
  component: Earnings,
});

function Earnings() {
  const { user } = useAuth();
  const { amounts, reload } = useTalentEarnings();
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);

  async function payout() {
    if (!user || amounts.available <= 0) return;
    setBusy(true);
    await (supabase as any).from('payout_requests').insert({ talent_id: user.id, amount: amounts.available });
    setBusy(false);
    setDone(true);
    await reload();
  }

  return (
    <PortalPage
      eyebrow="TALENT PORTAL"
      title="Earnings"
      intro="What you have earned and what is ready to be paid out."
      icon={WalletCards}
    >
      <section className="portal-section">
        <div className="earnings-grid">
          <Stat icon={Banknote} label="Pending" value={amounts.pending} />
          <Stat icon={WalletCards} label="Available" value={amounts.available} />
          <Stat icon={ClipboardCheck} label="Total paid" value={amounts.paid} />
        </div>
        <button className="button payout-button" onClick={payout} disabled={busy || amounts.available <= 0}>
          {busy ? 'Requesting…' : 'Request payout'}
        </button>
        {done && <p className="form-success">Payout requested. Admin will review it shortly.</p>}
      </section>
    </PortalPage>
  );
}

function Stat({ icon: Icon, label, value }: { icon: typeof Banknote; label: string; value: number }) {
  return (
    <div className="stat-card">
      <Icon size={20} />
      <span>{label}</span>
      <strong>₦{value.toLocaleString()}</strong>
    </div>
  );
}
