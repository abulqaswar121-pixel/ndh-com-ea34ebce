import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useQueryClient } from '@tanstack/react-query';
import { LogOut, UserRound } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/lib/auth';
import { PortalPage } from '@/components/PortalShell';

const ROLE_TEXT: Record<string, string> = {
  student: 'Student',
  client: 'Client',
  pm: 'Project manager',
  talent: 'Talent',
  admin: 'Admin',
};

export function AccountPage({ eyebrow }: { eyebrow: string }) {
  const { user, roles } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [fullName, setFullName] = useState((user?.user_metadata?.['full_name'] as string) ?? '');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function saveName(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setMessage('');
    setError('');
    const { error: updateError } = await supabase.auth.updateUser({ data: { full_name: fullName.trim() } });
    setBusy(false);
    if (updateError) setError('Your name could not be saved. Please try again.');
    else setMessage('Your name has been updated.');
  }

  async function changePassword(e: React.FormEvent) {
    e.preventDefault();
    if (password.length < 8) {
      setError('Use at least 8 characters for your new password.');
      return;
    }
    setBusy(true);
    setMessage('');
    setError('');
    const { error: updateError } = await supabase.auth.updateUser({ password });
    setBusy(false);
    setPassword('');
    if (updateError) setError('Your password could not be changed. Please try again.');
    else setMessage('Your password has been changed.');
  }

  async function signOut() {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    void navigate({ to: '/login', replace: true });
  }

  return (
    <PortalPage eyebrow={eyebrow} title="Your account" intro="Update your details or sign out." icon={UserRound}>
      <section className="portal-section">
        <div className="portal-section-title">
          <h2>Your details</h2>
        </div>
        <form className="auth-form" onSubmit={saveName}>
          <label>
            Email
            <input readOnly value={user?.email ?? ''} />
          </label>
          <label>
            Full name
            <input value={fullName} onChange={(e) => setFullName(e.target.value)} />
          </label>
          <p className="portal-muted">
            Access: {roles.map((r) => ROLE_TEXT[r] ?? r).join(', ') || 'Not set'}
          </p>
          <button className="button" disabled={busy}>
            Save name
          </button>
        </form>
      </section>

      <section className="portal-section">
        <div className="portal-section-title">
          <h2>Change password</h2>
        </div>
        <form className="auth-form" onSubmit={changePassword}>
          <label>
            New password
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 8 characters"
            />
          </label>
          <button className="button button-secondary" disabled={busy}>
            Update password
          </button>
        </form>
        {message && <p className="form-success">{message}</p>}
        {error && <p className="form-error">{error}</p>}
      </section>

      <section className="portal-section">
        <div className="portal-section-title">
          <h2>Sign out</h2>
        </div>
        <p className="portal-muted">Signing out returns you to the sign-in page and the public site.</p>
        <button className="button" onClick={signOut}>
          <LogOut size={16} /> Sign out
        </button>
      </section>
    </PortalPage>
  );
}
