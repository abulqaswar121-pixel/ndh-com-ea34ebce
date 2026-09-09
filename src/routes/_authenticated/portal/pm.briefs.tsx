import { createFileRoute } from '@tanstack/react-router';
import { Inbox } from 'lucide-react';
import { PortalPage } from '@/components/PortalShell';
import { useOpenBriefs } from '@/components/portal/pm-data';

export const Route = createFileRoute('/_authenticated/portal/pm/briefs')({
  component: OpenBriefs,
});

function OpenBriefs() {
  const { briefs, claim } = useOpenBriefs();
  return (
    <PortalPage
      eyebrow="PROJECT MANAGER"
      title="Open briefs"
      intro="Client briefs waiting for a project manager."
      icon={Inbox}
    >
      <section className="portal-section">
        {briefs.length === 0 ? (
          <div className="empty-card">No unassigned briefs right now.</div>
        ) : (
          <div className="portal-grid">
            {briefs.map((p) => (
              <article className="portal-card" key={p.id}>
                <Inbox size={20} />
                <h3>{p.title}</h3>
                <span className="status-pill">{p.status}</span>
                <p>{p.brief || 'No brief added.'}</p>
                <button className="button" onClick={() => void claim(p.id)}>
                  Take this project
                </button>
              </article>
            ))}
          </div>
        )}
      </section>
    </PortalPage>
  );
}
