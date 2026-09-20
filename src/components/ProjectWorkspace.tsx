import { useCallback, useEffect, useRef, useState } from 'react';
import { ClipboardCheck, Download, MessageSquare, Paperclip, Send, Trash2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/lib/auth';
import { assignTask, listAssignableTalents } from '@/lib/pm.functions';

type Message = { id: string; project_id: string; sender_id: string; body: string; created_at: string };
type ProjectFile = {
  id: string;
  project_id: string;
  uploader_id: string;
  file_name: string;
  file_path: string;
  size_bytes: number | null;
  created_at: string;
};
type Task = { id: string; title: string; description: string | null; status: string; due_date: string | null; assignee_id: string | null; talent_fee: number | null };

const TASK_STATUSES = ['todo', 'in_progress', 'in_review', 'done'] as const;

function formatSize(bytes: number | null) {
  if (!bytes) return '';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function formatTime(value: string) {
  return new Date(value).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' });
}

export function ProjectMessages({ projectId }: { projectId: string }) {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [names, setNames] = useState<Record<string, string>>({});
  const [body, setBody] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const endRef = useRef<HTMLDivElement>(null);

  const load = useCallback(async () => {
    const { data } = await (supabase as any)
      .from('project_messages')
      .select('*')
      .eq('project_id', projectId)
      .order('created_at', { ascending: true });
    const rows: Message[] = data ?? [];
    setMessages(rows);
    const ids = Array.from(new Set(rows.map((m) => m.sender_id)));
    if (ids.length) {
      const { data: people } = await (supabase as any).from('profiles').select('id, full_name, email').in('id', ids);
      const map: Record<string, string> = {};
      (people ?? []).forEach((p: any) => {
        map[p.id] = p.full_name || p.email || 'Team member';
      });
      setNames(map);
    }
  }, [projectId]);

  useEffect(() => {
    void load();
    const timer = setInterval(() => void load(), 10000);
    return () => clearInterval(timer);
  }, [load]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ block: 'nearest' });
  }, [messages.length]);

  async function send(e: React.FormEvent) {
    e.preventDefault();
    if (!body.trim() || !user) return;
    setBusy(true);
    setError('');
    const { error: sendError } = await (supabase as any)
      .from('project_messages')
      .insert({ project_id: projectId, sender_id: user.id, body: body.trim() });
    if (sendError) setError('Message could not be sent. Please try again.');
    else {
      setBody('');
      await load();
    }
    setBusy(false);
  }

  return (
    <div className="workspace-block">
      <div className="portal-section-title">
        <h2>Messages</h2>
        <MessageSquare size={22} />
      </div>
      <div className="chat-thread">
        {messages.length === 0 ? (
          <p className="chat-empty">No messages yet. Say hello and share what you need.</p>
        ) : (
          messages.map((m) => (
            <div key={m.id} className={m.sender_id === user?.id ? 'chat-msg chat-mine' : 'chat-msg'}>
              <span className="chat-meta">
                {m.sender_id === user?.id ? 'You' : names[m.sender_id] || 'Team member'} · {formatTime(m.created_at)}
              </span>
              <p>{m.body}</p>
            </div>
          ))
        )}
        <div ref={endRef} />
      </div>
      <form className="chat-form" onSubmit={send}>
        <textarea
          rows={2}
          value={body}
          placeholder="Write a message…"
          onChange={(e) => setBody(e.target.value)}
        />
        <button className="button" disabled={busy || !body.trim()}>
          {busy ? 'Sending…' : <>Send <Send size={16} /></>}
        </button>
      </form>
      {error && <p className="error-text">{error}</p>}
    </div>
  );
}

export function ProjectFiles({ projectId }: { projectId: string }) {
  const { user } = useAuth();
  const [files, setFiles] = useState<ProjectFile[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    const { data } = await (supabase as any)
      .from('project_files')
      .select('*')
      .eq('project_id', projectId)
      .order('created_at', { ascending: false });
    setFiles(data ?? []);
  }, [projectId]);

  useEffect(() => {
    void load();
  }, [load]);

  async function upload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    setBusy(true);
    setError('');
    const path = `${projectId}/${crypto.randomUUID()}-${file.name.replace(/[^\w.\-]+/g, '_')}`;
    const { error: uploadError } = await supabase.storage.from('project-files').upload(path, file);
    if (uploadError) {
      setError('Upload failed. Please check the file size and try again.');
    } else {
      const { error: rowError } = await (supabase as any).from('project_files').insert({
        project_id: projectId,
        uploader_id: user.id,
        file_name: file.name,
        file_path: path,
        size_bytes: file.size,
        content_type: file.type || null,
      });
      if (rowError) setError('File uploaded but could not be listed. Please try again.');
      else await load();
    }
    e.target.value = '';
    setBusy(false);
  }

  async function download(f: ProjectFile) {
    const { data, error: signError } = await supabase.storage.from('project-files').createSignedUrl(f.file_path, 300);
    if (signError || !data) setError('Could not open that file.');
    else window.open(data.signedUrl, '_blank', 'noopener');
  }

  async function remove(f: ProjectFile) {
    setBusy(true);
    await supabase.storage.from('project-files').remove([f.file_path]);
    await (supabase as any).from('project_files').delete().eq('id', f.id);
    await load();
    setBusy(false);
  }

  return (
    <div className="workspace-block">
      <div className="portal-section-title">
        <h2>Files</h2>
        <Paperclip size={22} />
      </div>
      <label className="file-drop">
        <input type="file" onChange={upload} disabled={busy} />
        <span>{busy ? 'Uploading…' : 'Choose a file to share (up to 50 MB)'}</span>
      </label>
      {files.length === 0 ? (
        <div className="empty-card">No files shared yet.</div>
      ) : (
        <div className="file-list">
          {files.map((f) => (
            <div className="file-row" key={f.id}>
              <span>
                <b>{f.file_name}</b>
                <small>
                  {formatSize(f.size_bytes)} · {formatTime(f.created_at)}
                </small>
              </span>
              <div className="project-actions">
                <button onClick={() => download(f)}>
                  <Download size={16} /> Open
                </button>
                {f.uploader_id === user?.id && (
                  <button onClick={() => remove(f)}>
                    <Trash2 size={16} /> Remove
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
      {error && <p className="error-text">{error}</p>}
    </div>
  );
}

export function ProjectTasks({ projectId, canManage }: { projectId: string; canManage: boolean }) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState('');
  const [due, setDue] = useState('');
  const [assignee, setAssignee] = useState('');
  const [fee, setFee] = useState('');
  const [talents, setTalents] = useState<{ id: string; name: string }[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!canManage) return;
    void listAssignableTalents()
      .then(setTalents)
      .catch(() => setTalents([]));
  }, [canManage]);

  const load = useCallback(async () => {
    const { data } = await (supabase as any)
      .from('tasks')
      .select('*')
      .eq('project_id', projectId)
      .order('created_at', { ascending: true });
    setTasks(data ?? []);
  }, [projectId]);

  useEffect(() => {
    void load();
  }, [load]);

  async function add(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    setBusy(true);
    setError('');
    try {
      await assignTask({
        data: {
          projectId,
          title: title.trim(),
          dueDate: due || undefined,
          assigneeId: assignee || undefined,
          fee: assignee && fee ? Number(fee) : undefined,
        },
      });
      setTitle('');
      setDue('');
      setAssignee('');
      setFee('');
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Task could not be added.');
    }
    setBusy(false);
  }

  async function setStatus(id: string, status: string) {
    await (supabase as any).from('tasks').update({ status }).eq('id', id);
    await load();
  }

  return (
    <div className="workspace-block">
      <div className="portal-section-title">
        <h2>Tasks</h2>
        <ClipboardCheck size={22} />
      </div>
      {canManage && (
        <form className="auth-form inline-form" onSubmit={add}>
          <input placeholder="New task" value={title} onChange={(e) => setTitle(e.target.value)} />
          <input type="date" value={due} onChange={(e) => setDue(e.target.value)} />
          <select value={assignee} onChange={(e) => setAssignee(e.target.value)} aria-label="Assign to talent">
            <option value="">Assign to…</option>
            {talents.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>
          {assignee && (
            <input
              type="number"
              min="0"
              placeholder="Agreed fee (₦)"
              value={fee}
              onChange={(e) => setFee(e.target.value)}
              aria-label="Agreed fee in naira"
            />
          )}
          <button className="button" disabled={busy}>
            Add task
          </button>
        </form>
      )}
      {tasks.length === 0 ? (
        <div className="empty-card">No tasks yet.</div>
      ) : (
        <div className="file-list">
          {tasks.map((t) => (
            <div className="file-row" key={t.id}>
              <span>
                <b>{t.title}</b>
                <small>Due {t.due_date || 'not set'}</small>
              </span>
              {canManage ? (
                <select value={t.status} onChange={(e) => setStatus(t.id, e.target.value)}>
                  {TASK_STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {s.replace('_', ' ')}
                    </option>
                  ))}
                </select>
              ) : (
                <span className="status-pill">{t.status.replace('_', ' ')}</span>
              )}
            </div>
          ))}
        </div>
      )}
      {error && <p className="error-text">{error}</p>}
    </div>
  );
}
