import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { KeyRound, UsersRound } from 'lucide-react';
import { PortalPage } from '@/components/PortalShell';
import { createInvite, setPMReviewAccess } from '@/lib/admin.functions';

export const Route = createFileRoute('/_authenticated/portal/admin/access')({
  component: Access,
});

function Access() {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [link, setLink] = useState('');
  const [emailed, setEmailed] = useState(false);
  const [pmId, setPmId] = useState('');

  async function invite(role: 'talent' | 'pm') {
    const r = await createInvite({ data: { role, email, fullName: name } });
    setLink(`${location.origin}${r.url}`);
    setEmailed(Boolean((r as any).emailed));
  }

  return (
    <PortalPage
      eyebrow="ADMIN PORTAL"
      title="Invitations & access"
      intro="Invite talent and project managers, and control review access."
      icon={KeyRound}
    >
      <section className="portal-section">
        <div className="portal-section-title">
          <h2>Send an invitation</h2>
          <KeyRound size={22} />
        </div>
        <div className="auth-form inline-form">
          <input placeholder="Full name" value={name} onChange={(e) => setName(e.target.value)} />
          <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <button className="button" onClick={() => invite('talent')}>
            Invite as talent
          </button>
          <button className="button button-secondary" onClick={() => invite('pm')}>
            Invite as PM
          </button>
        </div>
        {link && (
          <div className="empty-card">
            {emailed ? 'Invitation email sent. ' : 'Email could not be sent — share this link manually. '}
            Invite link: {link}
          </div>
        )}
      </section>

      <section className="portal-section">
        <div className="portal-section-title">
          <h2>PM review access</h2>
          <UsersRound size={22} />
        </div>
        <div className="auth-form inline-form">
          <input placeholder="PM user ID" value={pmId} onChange={(e) => setPmId(e.target.value)} />
          <button className="button" onClick={() => setPMReviewAccess({ data: { pmId, enabled: true } })}>
            Enable review queue
          </button>
          <button
            className="button button-secondary"
            onClick={() => setPMReviewAccess({ data: { pmId, enabled: false } })}
          >
            Disable
          </button>
        </div>
      </section>
    </PortalPage>
  );
}
