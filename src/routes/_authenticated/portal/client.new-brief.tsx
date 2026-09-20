import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useState } from 'react';
import { PlusCircle } from 'lucide-react';
import { PortalPage } from '@/components/PortalShell';
import { useAuth } from '@/lib/auth';
import { SERVICE_AREAS } from '@/lib/service-areas';
import { submitBrief } from '@/lib/pm.functions';

export const Route = createFileRoute('/_authenticated/portal/client/new-brief')({
  component: NewBriefPage,
});

function NewBriefPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [brief, setBrief] = useState('');
  const [budget, setBudget] = useState('');
  const [serviceArea, setServiceArea] = useState('');
  const [state, setState] = useState<'idle' | 'saving' | 'done'>('idle');
  const [error, setError] = useState('');

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;
    setState('saving');
    setError('');
    try {
      await submitBrief({
        data: {
          title,
          brief,
          budget: budget ? Number(budget) : undefined,
          serviceArea: serviceArea || undefined,
        },
      });
    } catch (err) {
      setState('idle');
      setError(err instanceof Error ? err.message : 'Your brief could not be saved. Please try again or send it on WhatsApp.');
      return;
    }
    setTitle('');
    setBrief('');
    setBudget('');
    setServiceArea('');
    setState('done');
    setTimeout(() => void navigate({ to: '/portal/client/projects' }), 900);
  }

  return (
    <PortalPage
      eyebrow="CLIENT PORTAL"
      title="Start a new brief"
      intro="Tell us what you need and a project manager will pick it up."
      icon={PlusCircle}
    >
      <section className="portal-section">
        <form className="auth-form" onSubmit={submit}>
          <label>
            Project title
            <input required value={title} onChange={(e) => setTitle(e.target.value)} />
          </label>
          <label>
            What do you need?
            <textarea rows={5} required value={brief} onChange={(e) => setBrief(e.target.value)} />
          </label>
          <label>
            Service area
            <select required value={serviceArea} onChange={(e) => setServiceArea(e.target.value)}>
              <option value="">Choose one…</option>
              {SERVICE_AREAS.map((a) => (
                <option key={a} value={a}>
                  {a}
                </option>
              ))}
            </select>
          </label>
          <label>
            Budget in mind (optional)
            <input type="number" min="0" value={budget} onChange={(e) => setBudget(e.target.value)} />
          </label>
          <button className="button" disabled={state === 'saving'}>
            {state === 'saving' ? 'Sending…' : 'Submit brief'}
          </button>
          {state === 'done' && <p className="form-success">Brief received. Taking you to your projects…</p>}
          {error && <p className="form-error">{error}</p>}
        </form>
      </section>
    </PortalPage>
  );
}
