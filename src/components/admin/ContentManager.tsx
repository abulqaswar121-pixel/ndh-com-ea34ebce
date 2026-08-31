import { useEffect, useState } from 'react';
import { FileText, Inbox, Quote, Star } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

type Row = Record<string, any>;

function slugify(s: string) {
  return s
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

function useTable(table: string, order = 'created_at') {
  const [rows, setRows] = useState<Row[]>([]);
  const [error, setError] = useState('');

  async function load() {
    const { data, error: e } = await (supabase as any).from(table).select('*').order(order, { ascending: false });
    if (e) setError(e.message);
    setRows(data ?? []);
  }
  useEffect(() => {
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [table]);

  return {
    rows,
    error,
    reload: load,
    async insert(values: Row) {
      const { error: e } = await (supabase as any).from(table).insert(values);
      if (e) setError(e.message);
      else await load();
    },
    async update(id: string, values: Row) {
      const { error: e } = await (supabase as any).from(table).update(values).eq('id', id);
      if (e) setError(e.message);
      else await load();
    },
    async remove(id: string) {
      const { error: e } = await (supabase as any).from(table).delete().eq('id', id);
      if (e) setError(e.message);
      else await load();
    },
  };
}

export function TestimonialsManager() {
  const t = useTable('testimonials');
  const [form, setForm] = useState({ author_name: '', author_role: '', company: '', quote: '' });

  return (
    <div className="cms-block">
      <form
        className="auth-form"
        onSubmit={async (e) => {
          e.preventDefault();
          await t.insert({ ...form, is_published: true });
          setForm({ author_name: '', author_role: '', company: '', quote: '' });
        }}
      >
        <label>
          Client name
          <input required value={form.author_name} onChange={(e) => setForm({ ...form, author_name: e.target.value })} />
        </label>
        <label>
          Role
          <input value={form.author_role} onChange={(e) => setForm({ ...form, author_role: e.target.value })} />
        </label>
        <label>
          Company
          <input value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} />
        </label>
        <label>
          Testimonial
          <textarea required rows={3} value={form.quote} onChange={(e) => setForm({ ...form, quote: e.target.value })} />
        </label>
        <button className="button">Publish testimonial</button>
      </form>
      {t.error && <p className="form-error">{t.error}</p>}
      {t.rows.length === 0 ? (
        <div className="empty-card">No testimonials yet.</div>
      ) : (
        <div className="portal-grid">
          {t.rows.map((r) => (
            <article className="portal-card" key={r.id}>
              <Quote size={18} />
              <h3>{r.author_name}</h3>
              <p>{r.quote}</p>
              <div className="project-actions">
                <button onClick={() => t.update(r.id, { is_published: !r.is_published })}>
                  {r.is_published ? 'Unpublish' : 'Publish'}
                </button>
                <button onClick={() => t.remove(r.id)}>Delete</button>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

export function CaseStudiesManager() {
  const cs = useTable('case_studies');
  const [form, setForm] = useState({
    title: '',
    client_name: '',
    summary: '',
    challenge: '',
    approach: '',
    result: '',
    cover_image_url: '',
  });

  return (
    <div className="cms-block">
      <form
        className="auth-form"
        onSubmit={async (e) => {
          e.preventDefault();
          await cs.insert({ ...form, slug: slugify(form.title), is_published: true });
          setForm({ title: '', client_name: '', summary: '', challenge: '', approach: '', result: '', cover_image_url: '' });
        }}
      >
        <label>
          Title
          <input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
        </label>
        <label>
          Client
          <input value={form.client_name} onChange={(e) => setForm({ ...form, client_name: e.target.value })} />
        </label>
        <label>
          Summary
          <textarea rows={2} value={form.summary} onChange={(e) => setForm({ ...form, summary: e.target.value })} />
        </label>
        <label>
          Challenge
          <textarea rows={2} value={form.challenge} onChange={(e) => setForm({ ...form, challenge: e.target.value })} />
        </label>
        <label>
          Approach
          <textarea rows={2} value={form.approach} onChange={(e) => setForm({ ...form, approach: e.target.value })} />
        </label>
        <label>
          Result
          <textarea rows={2} value={form.result} onChange={(e) => setForm({ ...form, result: e.target.value })} />
        </label>
        <label>
          Cover image URL
          <input value={form.cover_image_url} onChange={(e) => setForm({ ...form, cover_image_url: e.target.value })} />
        </label>
        <button className="button">Publish case study</button>
      </form>
      {cs.error && <p className="form-error">{cs.error}</p>}
      {cs.rows.length === 0 ? (
        <div className="empty-card">No case studies yet.</div>
      ) : (
        <div className="portal-grid">
          {cs.rows.map((r) => (
            <article className="portal-card" key={r.id}>
              <Star size={18} />
              <h3>{r.title}</h3>
              <p>{r.summary}</p>
              <div className="project-actions">
                <button onClick={() => cs.update(r.id, { is_published: !r.is_published })}>
                  {r.is_published ? 'Unpublish' : 'Publish'}
                </button>
                <button onClick={() => cs.remove(r.id)}>Delete</button>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

export function PostsManager() {
  const p = useTable('posts');
  const [form, setForm] = useState({ title: '', excerpt: '', body: '', cover_image_url: '', author_name: '' });

  return (
    <div className="cms-block">
      <form
        className="auth-form"
        onSubmit={async (e) => {
          e.preventDefault();
          await p.insert({
            ...form,
            slug: slugify(form.title),
            is_published: true,
            published_at: new Date().toISOString(),
          });
          setForm({ title: '', excerpt: '', body: '', cover_image_url: '', author_name: '' });
        }}
      >
        <label>
          Title
          <input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
        </label>
        <label>
          Excerpt
          <textarea rows={2} value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} />
        </label>
        <label>
          Article
          <textarea rows={8} value={form.body} onChange={(e) => setForm({ ...form, body: e.target.value })} />
        </label>
        <label>
          Cover image URL
          <input value={form.cover_image_url} onChange={(e) => setForm({ ...form, cover_image_url: e.target.value })} />
        </label>
        <label>
          Author
          <input value={form.author_name} onChange={(e) => setForm({ ...form, author_name: e.target.value })} />
        </label>
        <button className="button">Publish article</button>
      </form>
      {p.error && <p className="form-error">{p.error}</p>}
      {p.rows.length === 0 ? (
        <div className="empty-card">No articles yet.</div>
      ) : (
        <div className="portal-grid">
          {p.rows.map((r) => (
            <article className="portal-card" key={r.id}>
              <FileText size={18} />
              <h3>{r.title}</h3>
              <p>{r.excerpt}</p>
              <div className="project-actions">
                <button onClick={() => p.update(r.id, { is_published: !r.is_published })}>
                  {r.is_published ? 'Unpublish' : 'Publish'}
                </button>
                <button onClick={() => p.remove(r.id)}>Delete</button>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

export function EnquiriesInbox() {
  const q = useTable('enquiries');
  return (
    <div className="cms-block">
      {q.error && <p className="form-error">{q.error}</p>}
      {q.rows.length === 0 ? (
        <div className="empty-card">No enquiries yet.</div>
      ) : (
        <div className="portal-grid">
          {q.rows.map((r) => (
            <article className="portal-card" key={r.id}>
              <Inbox size={18} />
              <h3>{r.full_name}</h3>
              <p>
                <a href={`mailto:${r.email}`}>{r.email}</a>
                {r.phone ? ` · ${r.phone}` : ''}
              </p>
              <p>{r.message}</p>
              <p className="admin-note">
                {r.source} · {r.status} · {new Date(r.created_at).toLocaleString()}
              </p>
              <div className="project-actions">
                <button onClick={() => q.update(r.id, { status: r.status === 'new' ? 'handled' : 'new' })}>
                  {r.status === 'new' ? 'Mark handled' : 'Mark new'}
                </button>
                <button onClick={() => q.remove(r.id)}>Delete</button>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
