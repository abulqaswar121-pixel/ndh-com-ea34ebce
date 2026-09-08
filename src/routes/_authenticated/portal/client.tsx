import { createFileRoute, Link } from '@tanstack/react-router';
import { useCallback, useEffect, useState } from 'react';
import { BriefcaseBusiness, FolderKanban, PlusCircle, Receipt, ShieldCheck } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { PortalShell } from '@/components/PortalShell';
import { RequireRole } from '@/components/RequireRole';
import { useAuth } from '@/lib/auth';
import { Reveal } from '@/components/Reveal';

export const Route = createFileRoute('/_authenticated/portal/client')({
  component: () => (
    <RequireRole role="client">
      <ClientPortal />
    </RequireRole>
  ),
});

function ClientPortal() {
  const { user } = useAuth();
  const [projects, setProjects] = useState<any[]>([]);
  const [invoices, setInvoices] = useState<any[]>([]);
  const [escrow, setEscrow] = useState<any[]>([]);

  const load = useCallback(async () => {
    if (!user) return;
    const { data: projectRows } = await supabase
      .from('projects')
      .select('*')
      .eq('client_id', user.id)
      .order('created_at', { ascending: false });
    setProjects(projectRows ?? []);
    const { data: invoiceRows } = await supabase.from('invoices').select('*').eq('client_id', user.id);
    setInvoices(invoiceRows ?? []);
    const ids = (invoiceRows ?? []).map((i: any) => i.id);
    if (ids.length) {
      const { data: escrowRows } = await (supabase as any).from('escrow_status').select('*').in('invoice_id', ids);
      setEscrow(escrowRows ?? []);
    } else {
      setEscrow([]);
    }
  }, [user]);

  useEffect(() => {
    void load();
  }, [load]);

  return (
    <PortalShell
      role="client"
      eyebrow="CLIENT PORTAL"
      title="Your work, in view."
      intro="Track delivery, share files, and message your project manager."
      icon={BriefcaseBusiness}
    >
      <>
        <div className="portal-stats">
          <div className="portal-stat">
            <small>Projects</small>
            <strong>{projects.length}</strong>
          </div>
          <div className="portal-stat">
            <small>Active</small>
            <strong>{projects.filter((p) => p.status === 'active').length}</strong>
          </div>
          <div className="portal-stat">
            <small>Unpaid invoices</small>
            <strong>{invoices.filter((i) => i.status !== 'paid').length}</strong>
          </div>
        </div>

        <Reveal>
          <section className="portal-section" id="projects">
            <div className="portal-section-title">
              <h2>Projects</h2>
              <span>{projects.length} in view</span>
            </div>
            {projects.length === 0 ? (
              <div className="empty-card">No projects yet. Start your first brief below.</div>
            ) : (
              <div className="portal-grid">
                {projects.map((p) => (
                  <article className="portal-card" key={p.id}>
                    <div className="card-icon">
                      <FolderKanban size={20} />
                    </div>
                    <h3>{p.title}</h3>
                    <span className="status-pill">{p.status === 'active' ? 'In Progress' : p.status}</span>
                    <p>{p.brief || 'Project details will appear here.'}</p>
                    <div className="project-actions">
                      <Link to="/workspace/$id" params={{ id: p.id }} className="button">
                        Open workspace
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>
        </Reveal>

        <Reveal>
          <section className="portal-section" id="new-brief">
            <div className="portal-section-title">
              <h2>Start a new brief</h2>
              <PlusCircle size={22} />
            </div>
            <NewBrief onCreated={load} />
          </section>
        </Reveal>

        <Reveal>
          <section className="portal-section" id="invoices">
            <div className="portal-section-title">
              <h2>Invoices</h2>
              <Receipt size={22} />
            </div>
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
        </Reveal>

        <Reveal>
          <section className="portal-section" id="escrow">
            <div className="portal-section-title">
              <h2>Escrow</h2>
              <ShieldCheck size={22} />
            </div>
            {escrow.length === 0 ? (
              <div className="empty-card">Escrow updates for your projects will appear here.</div>
            ) : (
              <div className="invoice-list">
                {escrow.map((e) => (
                  <div className="invoice-row" key={e.id}>
                    <span>
                      <b>{e.currency} {Number(e.held_amount).toLocaleString()} held</b>
                      <small>Released {Number(e.released_amount).toLocaleString()}</small>
                    </span>
                    <span className="status-pill">{e.state}</span>
                  </div>
                ))}
              </div>
            )}
          </section>
        </Reveal>
      </>
    </PortalShell>
  );
}

function NewBrief({ onCreated }: { onCreated: () => void }) {
  const { user } = useAuth();
  const [title, setTitle] = useState('');
  const [brief, setBrief] = useState('');
  const [budget, setBudget] = useState('');
  const [state, setState] = useState<'idle' | 'saving' | 'done'>('idle');
  const [error, setError] = useState('');

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;
    setState('saving');
    setError('');
    const { error: insertError } = await (supabase as any).from('projects').insert({
      client_id: user.id,
      title: title.trim(),
      brief: brief.trim(),
      budget_amount: budget ? Number(budget) : null,
      status: 'draft',
    });
    if (insertError) {
      setState('idle');
      setError('Your brief could not be saved. Please try again or send it on WhatsApp.');
      return;
    }
    setTitle('');
    setBrief('');
    setBudget('');
    setState('done');
    onCreated();
  }

  return (
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
        Budget in mind (optional)
        <input type="number" min="0" value={budget} onChange={(e) => setBudget(e.target.value)} />
      </label>
      <button className="button" disabled={state === 'saving'}>
        {state === 'saving' ? 'Sending…' : 'Submit brief'}
      </button>
      {state === 'done' && <p className="form-success">Brief received. Your project manager will pick it up shortly.</p>}
      {error && <p className="form-error">{error}</p>}
    </form>
  );
}
