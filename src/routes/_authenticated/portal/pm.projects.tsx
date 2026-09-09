import { createFileRoute, Link } from '@tanstack/react-router';
import { FolderKanban } from 'lucide-react';
import { PortalPage } from '@/components/PortalShell';
import { usePmProjects } from '@/components/portal/pm-data';

export const Route = createFileRoute('/_authenticated/portal/pm/projects')({
  component: PmProjects,
});

function PmProjects() {
  const { projects } = usePmProjects();
  return (
    <PortalPage eyebrow="PROJECT MANAGER" title="My projects" intro="Projects assigned to you." icon={FolderKanban}>
      <section className="portal-section">
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
