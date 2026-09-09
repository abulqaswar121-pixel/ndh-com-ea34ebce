import { createFileRoute, Link } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { BookOpen, CirclePlay } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { PortalPage } from '@/components/PortalShell';
import { useAuth } from '@/lib/auth';

export const Route = createFileRoute('/_authenticated/portal/student/courses')({
  component: MyCourses,
});

function MyCourses() {
  const { user } = useAuth();
  const [courses, setCourses] = useState<any[]>([]);

  useEffect(() => {
    if (!user) return;
    void supabase
      .from('enrollments')
      .select('*, courses(title,summary,slug)')
      .eq('student_id', user.id)
      .then(({ data }) => setCourses(data ?? []));
  }, [user]);

  return (
    <PortalPage
      eyebrow="STUDENT PORTAL"
      title="My courses"
      intro="Every course you are enrolled in, with your progress."
      icon={BookOpen}
    >
      <section className="portal-section">
        {courses.length === 0 ? (
          <div className="empty-card">
            No courses yet — <Link to="/portal/student/catalogue">browse the courses</Link>.
          </div>
        ) : (
          <div className="portal-grid">
            {courses.map((e) => (
              <article className="portal-card" key={e.id}>
                <CirclePlay size={20} />
                <h3>{e.courses?.title || 'Course'}</h3>
                <p>{e.courses?.summary}</p>
                <div className="progress-track">
                  <span style={{ width: `${Math.max(0, Math.min(100, e.progress ?? 0))}%` }} />
                </div>
                <p>{e.progress ?? 0}% complete</p>
                {e.courses?.slug ? (
                  <Link className="button" to="/learning/$slug" params={{ slug: e.courses.slug }}>
                    {e.progress ? 'Continue learning' : 'Start learning'}
                  </Link>
                ) : null}
              </article>
            ))}
          </div>
        )}
      </section>
    </PortalPage>
  );
}
