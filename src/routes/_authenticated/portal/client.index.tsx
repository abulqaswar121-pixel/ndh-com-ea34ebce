import { createFileRoute, Link } from '@tanstack/react-router';
import { BriefcaseBusiness, FolderKanban } from 'lucide-react';
import { PortalPage } from '@/components/PortalShell';
import { useClientInvoices, useClientProjects } from '@/components/portal/client-data';

export const Route = createFileRoute('/_authenticated/portal/client/')({
  component: ClientDashboard,
});

function ClientDashboard() {
  const { projects } = useClientProjects();
  const { invoices } = useClientInvoices();

  return (
    <PortalPage
      eyebrow="CLIENT PORTAL"
      title="Your work, in view."
      intro="Track delivery, share files, and message your project manager."
      icon={BriefcaseBusiness}
    >
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

      <section className="portal-section">
        <div className="portal-section-title">
          <h2>Latest projects</h2>
          <FolderKanban size={22} />
        </div>
        {projects.length === 0 ? (
          <div className="empty-card">
            No projects yet. <Link to="/portal/client/new-brief">Start your first brief.</Link>
          </div>
        ) : (
          <div className="portal-grid">
            {projects.slice(0, 3).map((p) => (
              <article className="portal-card" key={p.id}>
                <FolderKanban size={20} />
                <h3>{p.title}</h3>
                <span className="status-pill">{p.status === 'active' ? 'In Progress' : p.status}</span>
                <Link to="/workspace/$id" params={{ id: p.id }} className="button">
                  Open workspace
                </Link>
              </article>
            ))}
          </div>
        )}
      </section>
    </PortalPage>
  );
}
