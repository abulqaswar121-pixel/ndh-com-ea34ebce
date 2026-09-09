import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useState } from 'react';
import { PlusCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { PortalPage } from '@/components/PortalShell';
import { useAuth } from '@/lib/auth';

export const Route = createFileRoute('/_authenticated/portal/pm/new-project')({
  component: NewProjectPage,
});

function NewProjectPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [client, setClient] = useState<any>();
  const [title, setTitle] = useState('');
  const [brief, setBrief] = useState('');
  const [due, setDue] = useState('');
  const [state, setState] = useState<'idle' | 'saving' | 'done'>('idle');
  const [error, setError] = useState('');

  async function search() {
    const { data } = await (supabase as any)
      .from('profiles')
      .select('id, full_name, email')
      .or(`full_name.ilike.%${query}%,email.ilike.%${query}%`)
      .limit(10);
    setResults(data ?? []);
  }

  async function create(e: React.FormEvent) {
    e.preventDefault();
    if (!user || !client) return;
    setState('saving');
    setError('');
    const { error: insertError } = await (supabase as any).from('projects').insert({
      client_id: client.id,
      pm_id: user.id,
      title: title.trim(),
      brief: brief.trim(),
      due_date: due || null,
      status: 'active',
    });
    if (insertError) {
      setState('idle');
      setError('Project could not be created.');
      return;
    }
    setState('done');
    setTimeout(() => void navigate({ to: '/portal/pm/projects' }), 900);
  }

  return (
    <PortalPage
      eyebrow="PROJECT MANAGER"
      title="Create a project"
      intro="Find the client, then set up their project."
      icon={PlusCircle}
    >
      <section className="portal-section">
        <div className="auth-form inline-form">
          <input placeholder="Find client by name or email" value={query} onChange={(e) => setQuery(e.target.value)} />
          <button className="button button-secondary" type="button" onClick={search}>
            Search clients
          </button>
        </div>
        {results.length > 0 && (
          <div className="file-list">
            {results.map((r) => (
              <div className="file-row" key={r.id}>
                <span>
                  <b>{r.full_name || 'Unnamed user'}</b>
                  <small>{r.email}</small>
                </span>
                <button onClick={() => setClient(r)}>{client?.id === r.id ? 'Selected' : 'Select'}</button>
              </div>
            ))}
          </div>
        )}
        <form className="auth-form" onSubmit={create}>
          <label>
            Client
            <input readOnly value={client ? client.full_name || client.email : 'Search and select a client above'} />
          </label>
          <label>
            Project title
            <input required value={title} onChange={(e) => setTitle(e.target.value)} />
          </label>
          <label>
            Brief
            <textarea rows={4} value={brief} onChange={(e) => setBrief(e.target.value)} />
          </label>
          <label>
            Deadline
            <input type="date" value={due} onChange={(e) => setDue(e.target.value)} />
          </label>
          <button className="button" disabled={!client || state === 'saving'}>
            {state === 'saving' ? 'Creating…' : 'Create project'}
          </button>
          {state === 'done' && <p className="form-success">Project created. Taking you to your projects…</p>}
          {error && <p className="form-error">{error}</p>}
        </form>
      </section>
    </PortalPage>
  );
}
