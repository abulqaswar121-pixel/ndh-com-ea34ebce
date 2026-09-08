import { createFileRoute, Link } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { Award, BookOpen, CirclePlay } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { PortalShell } from '@/components/PortalShell';
import { RequireRole } from '@/components/RequireRole';
import { useAuth } from '@/lib/auth';
import { Reveal } from '@/components/Reveal';

export const Route = createFileRoute('/_authenticated/portal/student')({
  component: () => (
    <RequireRole role="student">
      <StudentPortal />
    </RequireRole>
  ),
});

function StudentPortal() {
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
      .order('issue_date', { ascending: false })
      .then(({ data }: any) => setCerts(data ?? []));
  }, [user]);

  return (
    <PortalShell
      role="student"
      eyebrow="STUDENT PORTAL"
      title="Keep learning, one skill at a time."
      intro="Continue your enrolled courses and keep your certificates together."
      icon={BookOpen}
    >
      <>
        <div className="portal-stats">
          <div className="portal-stat">
            <small>Courses</small>
            <strong>{courses.length}</strong>
          </div>
          <div className="portal-stat">
            <small>Average progress</small>
            <strong>
              {courses.length
                ? Math.round(courses.reduce((a, c) => a + (c.progress ?? 0), 0) / courses.length)
                : 0}
              %
            </strong>
          </div>
          <div className="portal-stat">
            <small>Certificates</small>
            <strong>{certs.length}</strong>
          </div>
        </div>

        <Reveal>
          <section className="portal-section" id="courses">
            <div className="portal-section-title">
              <h2>My courses</h2>
              <BookOpen size={22} />
            </div>
            {courses.length === 0 ? (
              <div className="empty-card">
                No courses yet — <Link to="/academy">browse the Academy to get started.</Link>
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
                    ) : (
                      <Link className="button" to="/academy">
                        Browse courses
                      </Link>
                    )}
                  </article>
                ))}
              </div>
            )}
          </section>
        </Reveal>

        <Reveal>
          <section className="portal-section" id="certificates">
            <div className="portal-section-title">
              <h2>Certificates</h2>
              <Award size={22} />
            </div>
            {certs.length === 0 ? (
              <div className="empty-card">No certificates yet.</div>
            ) : (
              <div className="portal-grid">
                {certs.map((c) => (
                  <article className="portal-card" key={c.id}>
                    <Award size={20} />
                    <h3>{c.certificate_number}</h3>
                    <p>Issued {new Date(c.issue_date).toLocaleDateString()}</p>
                    <Link className="button button-secondary" to="/certificate/$id" params={{ id: c.id }}>
                      View certificate
                    </Link>
                  </article>
                ))}
              </div>
            )}
          </section>
        </Reveal>
      </>
    </PortalShell>
  );
}
