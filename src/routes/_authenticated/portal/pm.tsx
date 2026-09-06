import { createFileRoute, Link } from '@tanstack/react-router';
import { useCallback, useEffect, useState } from 'react';
import { ClipboardCheck, FolderKanban, PlusCircle, UsersRound } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { PageShell } from '@/components/PageShell';
import { RequireRole } from '@/components/RequireRole';
import { useAuth } from '@/lib/auth';
import { Reveal } from '@/components/Reveal';

export const Route = createFileRoute('/_authenticated/portal/pm')({
  component: () => (
    <RequireRole role="pm">
      <PMPortal />
    </RequireRole>
  ),
});

function PMPortal() {
  const { user } = useAuth();
  const [projects, setProjects] = useState<any[]>([]);
  const [unassigned, setUnassigned] = useState<any[]>([]);
  const [tasks, setTasks] = useState<any[]>([]);

  const load = useCallback(async () => {
    if (!user) return;
    const { data: mine } = await supabase
      .from('projects')
      .select('*')
      .eq('pm_id', user.id)
      .order('created_at', { ascending: false });
    setProjects(mine ?? []);
    const { data: open } = await (supabase as any)
      .from('projects')
      .select('*')
      .is('pm_id', null)
      .order('created_at', { ascending: false });
    setUnassigned(open ?? []);
    const { data: taskRows } = await supabase.from('tasks').select('*').eq('assignee_id', user.id).order('due_date');
    setTasks(taskRows ?? []);
  }, [user]);

  useEffect(() => {
    void load();
  }, [load]);

  async function claim(projectId: string) {
    if (!user) return;
    await (supabase as any).from('projects').update({ pm_id: user.id, status: 'active' }).eq('id', projectId);
    await load();
  }

  return (
    <PageShell>
      <main className="portal">
        <div className="portal-head">
          <div>
            <p className="eyebrow">PROJECT MANAGER PORTAL</p>
            <h1>Your assigned work.</h1>
            <p>Create projects, message clients, share files and track tasks.</p>
          </div>
          <FolderKanban size={42} />
        </div>

        <Reveal>
          <section className="portal-section">
            <div className="portal-section-title">
              <h2>Assigned projects</h2>
              <span>{projects.length} projects</span>
            </div>
            {projects.length === 0 ? (
              <div className="empty-card">No projects assigned yet.</div>
            ) : (
              <div className="portal-grid">
                {projects.map((p) => (
                  <article className="portal-card" key={p.id}>
                    <FolderKanban size={20} />
                    <h3>{p.title}</h3>
                    <span className="status-pill">{p.status}</span>
                    <p>{p.brief || 'No brief added.'}</p>
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
          <section className="portal-section">
            <div className="portal-section-title">
              <h2>New client briefs</h2>
              <UsersRound size={22} />
            </div>
            {unassigned.length === 0 ? (
              <div className="empty-card">No unassigned briefs right now.</div>
            ) : (
              <div className="portal-grid">
                {unassigned.map((p) => (
                  <article className="portal-card" key={p.id}>
                    <FolderKanban size={20} />
                    <h3>{p.title}</h3>
                    <span className="status-pill">{p.status}</span>
                    <p>{p.brief || 'No brief added.'}</p>
                    <div className="project-actions">
                      <button className="button" onClick={() => claim(p.id)}>
                        Take this project
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>
        </Reveal>

        <Reveal>
          <section className="portal-section">
            <div className="portal-section-title">
              <h2>Create a project</h2>
              <PlusCircle size={22} />
            </div>
            <NewProject onCreated={load} />
          </section>
        </Reveal>

        <Reveal>
          <section className="portal-section">
            <div className="portal-section-title">
              <h2>Assigned tasks</h2>
              <ClipboardCheck size={22} />
            </div>
            {tasks.length === 0 ? (
              <div className="empty-card">No tasks assigned yet.</div>
            ) : (
              <div className="portal-grid">
                {tasks.map((t) => (
                  <article className="portal-card" key={t.id}>
                    <ClipboardCheck size={20} />
                    <h3>{t.title}</h3>
                    <span className="status-pill">{t.status}</span>
                    <p>Deadline: {t.due_date || 'Not set'}</p>
                  </article>
                ))}
              </div>
            )}
          </section>
        </Reveal>
      </main>
    </PageShell>
  );
}

function NewProject({ onCreated }: { onCreated: () => void }) {
  const { user } = useAuth();
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
    setTitle('');
    setBrief('');
    setDue('');
    setClient(undefined);
    setResults([]);
    setQuery('');
    setState('done');
    onCreated();
  }

  return (
    <div className="editor">
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
        {state === 'done' && <p className="form-success">Project created.</p>}
        {error && <p className="form-error">{error}</p>}
      </form>
    </div>
  );
}
