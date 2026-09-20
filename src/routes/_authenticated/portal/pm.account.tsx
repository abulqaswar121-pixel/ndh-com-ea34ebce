import { createFileRoute } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { AccountPage } from '@/components/portal/AccountPage';
import { SERVICE_AREAS } from '@/lib/service-areas';
import { getMyServiceAreas, setMyServiceAreas } from '@/lib/pm.functions';

export const Route = createFileRoute('/_authenticated/portal/pm/account')({
  component: PmAccount,
});

function PmAccount() {
  const [areas, setAreas] = useState<string[]>([]);
  const [saved, setSaved] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    void getMyServiceAreas().then(setAreas).catch(() => setAreas([]));
  }, []);

  function toggle(area: string) {
    setSaved(false);
    setAreas((cur) => (cur.includes(area) ? cur.filter((a) => a !== area) : [...cur, area]));
  }

  async function save() {
    setBusy(true);
    await setMyServiceAreas({ data: { areas } }).catch(() => undefined);
    setBusy(false);
    setSaved(true);
  }

  return (
    <>
      <AccountPage eyebrow="PROJECT MANAGER" />
      <section className="portal-section" style={{ maxWidth: 720, margin: '0 auto', padding: '0 20px 40px' }}>
        <h2 style={{ marginTop: 0 }}>Your service areas</h2>
        <p>You get an email the moment a client brief matches one of these areas.</p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, margin: '16px 0' }}>
          {SERVICE_AREAS.map((area) => (
            <label key={area} className="status-pill" style={{ cursor: 'pointer', display: 'flex', gap: 6, alignItems: 'center' }}>
              <input type="checkbox" checked={areas.includes(area)} onChange={() => toggle(area)} />
              {area}
            </label>
          ))}
        </div>
        <button className="button" onClick={save} disabled={busy}>
          {busy ? 'Saving…' : 'Save areas'}
        </button>
        {saved && <p className="form-success">Saved. You will be notified about matching briefs.</p>}
      </section>
    </>
  );
}
