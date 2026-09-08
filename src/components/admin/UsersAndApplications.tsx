import { useEffect, useState } from 'react';
import { BadgeCheck, UserRound, UsersRound } from 'lucide-react';
import { listUsers, setUserRole, listTalentApplications, reviewTalentApplication } from '@/lib/admin.functions';

const ROLES = ['client', 'student', 'talent', 'pm', 'admin'] as const;
type Role = (typeof ROLES)[number];

type UserRow = { id: string; full_name: string | null; email: string | null; roles: string[] };

export function UsersAndRoles() {
  const [q, setQ] = useState('');
  const [users, setUsers] = useState<UserRow[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  async function load() {
    setBusy(true);
    setError('');
    try {
      setUsers((await listUsers({ data: { q } })) as UserRow[]);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not load people.');
    } finally {
      setBusy(false);
    }
  }

  useEffect(() => {
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function toggle(userId: string, role: Role, grant: boolean) {
    setError('');
    try {
      await setUserRole({ data: { userId, role, grant } });
      setUsers((rows) =>
        rows.map((r) =>
          r.id === userId
            ? { ...r, roles: grant ? [...new Set([...r.roles, role])] : r.roles.filter((x) => x !== role) }
            : r,
        ),
      );
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not change access.');
    }
  }

  return (
    <>
      <div className="auth-form inline-form">
        <input
          placeholder="Search name or email"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') void load();
          }}
        />
        <button className="button" onClick={() => void load()} disabled={busy}>
          {busy ? 'Loading…' : 'Search'}
        </button>
      </div>
      {error && <div className="empty-card">{error}</div>}
      {users.length === 0 ? (
        <div className="empty-card">No people found.</div>
      ) : (
        <div className="portal-grid">
          {users.map((u) => (
            <article className="portal-card" key={u.id}>
              <UsersRound size={20} />
              <h3>{u.full_name || 'Unnamed user'}</h3>
              <p>{u.email}</p>
              <div className="role-toggles">
                {ROLES.map((role) => {
                  const has = u.roles.includes(role);
                  return (
                    <button
                      key={role}
                      type="button"
                      className={has ? 'role-chip active' : 'role-chip'}
                      onClick={() => void toggle(u.id, role, !has)}
                    >
                      {has && <BadgeCheck size={14} />}
                      {role}
                    </button>
                  );
                })}
              </div>
            </article>
          ))}
        </div>
      )}
    </>
  );
}

type Application = {
  id: string;
  full_name: string;
  email: string;
  role_applied: string;
  portfolio_url: string | null;
  cover_letter: string | null;
  created_at: string;
};

export function TalentApplications() {
  const [rows, setRows] = useState<Application[]>([]);
  const [notice, setNotice] = useState('');
  const [busyId, setBusyId] = useState('');

  async function load() {
    try {
      setRows((await listTalentApplications({ data: { status: 'pending' } })) as Application[]);
    } catch (e) {
      setNotice(e instanceof Error ? e.message : 'Could not load applications.');
    }
  }

  useEffect(() => {
    void load();
  }, []);

  async function decide(id: string, decision: 'accepted' | 'rejected') {
    setBusyId(id);
    setNotice('');
    try {
      const r = await reviewTalentApplication({ data: { applicationId: id, decision } });
      setNotice(
        decision === 'accepted'
          ? `Accepted. Invitation ${r.emailed ? 'emailed' : 'created'}${r.url ? ` — link: ${location.origin}${r.url}` : ''}`
          : 'Application declined and the applicant has been notified.',
      );
      setRows((list) => list.filter((x) => x.id !== id));
    } catch (e) {
      setNotice(e instanceof Error ? e.message : 'Could not update the application.');
    } finally {
      setBusyId('');
    }
  }

  return (
    <>
      {notice && <div className="empty-card">{notice}</div>}
      {rows.length === 0 ? (
        <div className="empty-card">No pending talent applications.</div>
      ) : (
        <div className="portal-grid">
          {rows.map((a) => (
            <article className="portal-card" key={a.id}>
              <UserRound size={20} />
              <h3>{a.full_name}</h3>
              <p>{a.role_applied}</p>
              <p>{a.email}</p>
              {a.portfolio_url && (
                <a href={a.portfolio_url} target="_blank" rel="noreferrer">
                  View portfolio
                </a>
              )}
              {a.cover_letter && <p className="admin-note">{a.cover_letter}</p>}
              <div className="project-actions">
                <button className="button" disabled={busyId === a.id} onClick={() => void decide(a.id, 'accepted')}>
                  Accept &amp; invite
                </button>
                <button disabled={busyId === a.id} onClick={() => void decide(a.id, 'rejected')}>
                  Decline
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </>
  );
}
