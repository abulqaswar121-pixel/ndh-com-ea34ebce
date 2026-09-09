import { createFileRoute, Link } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { Award } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { PortalPage } from '@/components/PortalShell';
import { useAuth } from '@/lib/auth';

export const Route = createFileRoute('/_authenticated/portal/student/certificates')({
  component: Certificates,
});

function Certificates() {
  const { user } = useAuth();
  const [certs, setCerts] = useState<any[]>([]);

  useEffect(() => {
    if (!user) return;
    void (supabase as any)
      .from('certificates')
      .select('*')
      .eq('student_id', user.id)
      .order('issue_date', { ascending: false })
      .then(({ data }: any) => setCerts(data ?? []));
  }, [user]);

  return (
    <PortalPage
      eyebrow="STUDENT PORTAL"
      title="Certificates"
      intro="Certificates issued after your project has been reviewed and signed off."
      icon={Award}
    >
      <section className="portal-section">
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
    </PortalPage>
  );
}
