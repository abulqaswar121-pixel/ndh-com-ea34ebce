import { createFileRoute, Link } from '@tanstack/react-router';
import { CalendarClock, ClipboardCheck, WalletCards } from 'lucide-react';
import { PortalPage } from '@/components/PortalShell';
import { useTalentEarnings, useTalentTasks } from '@/components/portal/talent-data';

export const Route = createFileRoute('/_authenticated/portal/talent/')({
  component: TalentDashboard,
});

function TalentDashboard() {
  const tasks = useTalentTasks();
  const { amounts } = useTalentEarnings();

  return (
    <PortalPage
      eyebrow="TALENT PORTAL"
      title="Your assignments, clearly organized."
      intro="See assigned work and track what you have earned."
      icon={WalletCards}
    >
      <div className="portal-stats">
        <div className="portal-stat">
          <small>Open tasks</small>
          <strong>{tasks.filter((t) => t.status !== 'done').length}</strong>
        </div>
        <div className="portal-stat">
          <small>Available</small>
          <strong>₦{amounts.available.toLocaleString()}</strong>
        </div>
        <div className="portal-stat">
          <small>Total paid</small>
          <strong>₦{amounts.paid.toLocaleString()}</strong>
        </div>
      </div>

      <section className="portal-section">
        <div className="portal-section-title">
          <h2>Next deadlines</h2>
          <CalendarClock size={22} />
        </div>
        {tasks.length === 0 ? (
          <div className="empty-card">No tasks assigned yet. New assignments will appear here.</div>
        ) : (
          <div className="portal-grid">
            {tasks.slice(0, 3).map((t) => (
              <article className="portal-card" key={t.id}>
                <ClipboardCheck size={20} />
                <h3>{t.title}</h3>
                <span className="status-pill">{t.status}</span>
                <p>Deadline: {t.due_date || 'Not set'}</p>
              </article>
            ))}
          </div>
        )}
        <p className="portal-muted">
          <Link to="/portal/talent/tasks">See all tasks</Link>
        </p>
      </section>
    </PortalPage>
  );
}
