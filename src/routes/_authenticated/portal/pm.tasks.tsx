import { createFileRoute } from '@tanstack/react-router';
import { ClipboardCheck } from 'lucide-react';
import { PortalPage } from '@/components/PortalShell';
import { useMyTasks } from '@/components/portal/pm-data';

export const Route = createFileRoute('/_authenticated/portal/pm/tasks')({
  component: PmTasks,
});

function PmTasks() {
  const tasks = useMyTasks();
  return (
    <PortalPage
      eyebrow="PROJECT MANAGER"
      title="My tasks"
      intro="Tasks assigned to you across all projects."
      icon={ClipboardCheck}
    >
      <section className="portal-section">
        {tasks.length === 0 ? (
          <div className="empty-card">No tasks assigned yet.</div>
        ) : (
          <div className="portal-grid">
            {tasks.map((t) => (
              <article className="portal-card" key={t.id}>
                <ClipboardCheck size={20} />
                <h3>{t.title}</h3>
                <span className="status-pill">{t.status}</span>
                <p>Deadline: {t.due_date || 'Not set'}</p>
                {t.talent_fee != null && <p>Agreed fee: ₦{Number(t.talent_fee).toLocaleString()}</p>}
              </article>
            ))}
          </div>
        )}
      </section>
    </PortalPage>
  );
}
