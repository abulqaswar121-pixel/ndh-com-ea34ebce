import { createFileRoute, Link } from '@tanstack/react-router';
import { FolderKanban } from 'lucide-react';
import { PortalPage } from '@/components/PortalShell';
import { useClientProjects } from '@/components/portal/client-data';

export const Route = createFileRoute('/_authenticated/portal/client/projects')({
  component: ClientProjects,
});

function ClientProjects() {
  const { projects } = useClientProjects();
  return (
    <PortalPage
      eyebrow="CLIENT PORTAL"
      title="Projects"
      intro="Open a project to message your manager, share files and follow tasks."
      icon={FolderKanban}
    >
      <section className="portal-section">
        {projects.length === 0 ? (
          <div className="empty-card">
            No projects yet. <Link to="/portal/client/new-brief">Start your first brief.</Link>
          </div>
        ) : (
          <div className="portal-grid">
            {projects.map((p) => (
              <article className="portal-card" key={p.id}>
                <FolderKanban size={20} />
                <h3>{p.title}</h3>
                <span className="status-pill">{p.status === 'active' ? 'In Progress' : p.status}</span>
                <p>{p.brief || 'Project details will appear here.'}</p>
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
