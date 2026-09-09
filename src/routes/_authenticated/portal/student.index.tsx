import { createFileRoute, Link } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { BookOpen, CirclePlay } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { PortalPage } from '@/components/PortalShell';
import { useAuth } from '@/lib/auth';

export const Route = createFileRoute('/_authenticated/portal/student/')({
  component: StudentDashboard,
});

function StudentDashboard() {
  const { user } = useAuth();
  const [courses, setCourses] = useState<any[]>([]);
  const [certs, setCerts] = useState<any[]>([]);

  useEffect(() => {
    if (!user) return;
    void supabase
      .from('enrollments')
      .select('*, courses(title,summary,slug)')
      .eq('student_id', user.id)
      .then(({ data }) => setCourses(data ?? []));
    void (supabase as any)
      .from('certificates')
      .select('*')
      .eq('student_id', user.id)
      .then(({ data }: any) => setCerts(data ?? []));
  }, [user]);

  const next = courses.find((c) => (c.progress ?? 0) < 100) ?? courses[0];

  return (
    <PortalPage
      eyebrow="STUDENT PORTAL"
      title="Keep learning, one skill at a time."
      intro="Pick up where you stopped and track your certificates."
      icon={BookOpen}
    >
      <div className="portal-stats">
        <div className="portal-stat">
          <small>Courses</small>
          <strong>{courses.length}</strong>
        </div>
        <div className="portal-stat">
          <small>Average progress</small>
          <strong>
            {courses.length ? Math.round(courses.reduce((a, c) => a + (c.progress ?? 0), 0) / courses.length) : 0}%
          </strong>
        </div>
        <div className="portal-stat">
          <small>Certificates</small>
          <strong>{certs.length}</strong>
        </div>
      </div>

      <section className="portal-section">
        <div className="portal-section-title">
          <h2>Continue learning</h2>
          <CirclePlay size={22} />
        </div>
        {next ? (
          <article className="portal-card">
            <CirclePlay size={20} />
            <h3>{next.courses?.title || 'Course'}</h3>
            <div className="progress-track">
              <span style={{ width: `${Math.max(0, Math.min(100, next.progress ?? 0))}%` }} />
            </div>
            <p>{next.progress ?? 0}% complete</p>
            {next.courses?.slug ? (
              <Link className="button" to="/learning/$slug" params={{ slug: next.courses.slug }}>
                {next.progress ? 'Continue learning' : 'Start learning'}
              </Link>
            ) : null}
          </article>
        ) : (
          <div className="empty-card">
            You have not enrolled in a course yet —{' '}
            <Link to="/portal/student/catalogue">browse the courses</Link> to get started.
          </div>
        )}
      </section>
    </PortalPage>
  );
}
