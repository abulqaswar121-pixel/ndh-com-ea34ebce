import { createFileRoute, Link } from '@tanstack/react-router';
import { FolderKanban } from 'lucide-react';
import { PortalPage } from '@/components/PortalShell';
import { useMyTasks, useOpenBriefs, usePmProjects } from '@/components/portal/pm-data';

export const Route = createFileRoute('/_authenticated/portal/pm/')({
  component: PmDashboard,
});

function PmDashboard() {
  const { projects } = usePmProjects();
  const { briefs } = useOpenBriefs();
  const tasks = useMyTasks();

  return (
    <PortalPage
      eyebrow="PROJECT MANAGER"
      title="Your assigned work."
      intro="Create projects, message clients, share files and track tasks."
      icon={FolderKanban}
    >
      <div className="portal-stats">
        <div className="portal-stat">
          <small>My projects</small>
          <strong>{projects.length}</strong>
        </div>
        <div className="portal-stat">
          <small>Open briefs</small>
          <strong>{briefs.length}</strong>
        </div>
        <div className="portal-stat">
          <small>My tasks</small>
          <strong>{tasks.length}</strong>
        </div>
      </div>

      <section className="portal-section">
        <div className="portal-section-title">
          <h2>Latest projects</h2>
          <FolderKanban size={22} />
        </div>
        {projects.length === 0 ? (
          <div className="empty-card">
            No projects assigned yet. <Link to="/portal/pm/briefs">See open briefs.</Link>
          </div>
        ) : (
          <div className="portal-grid">
            {projects.slice(0, 3).map((p) => (
              <article className="portal-card" key={p.id}>
                <FolderKanban size={20} />
                <h3>{p.title}</h3>
                <span className="status-pill">{p.status}</span>
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
