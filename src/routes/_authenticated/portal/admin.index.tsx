import { createFileRoute, Link } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { Settings2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { PortalPage } from '@/components/PortalShell';

export const Route = createFileRoute('/_authenticated/portal/admin/')({
  component: AdminDashboard,
});

function AdminDashboard() {
  const [counts, setCounts] = useState({ reviews: 0, enquiries: 0, payouts: 0, applications: 0 });

  useEffect(() => {
    void (async () => {
      const db = supabase as any;
      const [reviews, enquiries, payouts, applications] = await Promise.all([
        db.from('academy_submissions').select('id', { count: 'exact', head: true }).eq('status', 'submitted'),
        db.from('enquiries').select('id', { count: 'exact', head: true }),
        db.from('payout_requests').select('id', { count: 'exact', head: true }).eq('status', 'pending'),
        db.from('career_applications').select('id', { count: 'exact', head: true }).eq('status', 'pending'),
      ]);
      setCounts({
        reviews: reviews.count ?? 0,
        enquiries: enquiries.count ?? 0,
        payouts: payouts.count ?? 0,
        applications: applications.count ?? 0,
      });
    })();
  }, []);

  return (
    <PortalPage
      eyebrow="ADMIN PORTAL"
      title="Operate the hub."
      intro="Review work, manage access, and keep the Academy moving."
      icon={Settings2}
    >
      <div className="portal-stats">
        <div className="portal-stat">
          <small>Open reviews</small>
          <strong>{counts.reviews}</strong>
        </div>
        <div className="portal-stat">
          <small>Enquiries</small>
          <strong>{counts.enquiries}</strong>
        </div>
        <div className="portal-stat">
          <small>Pending payouts</small>
          <strong>{counts.payouts}</strong>
        </div>
        <div className="portal-stat">
          <small>Talent applications</small>
          <strong>{counts.applications}</strong>
        </div>
      </div>

      <section className="portal-section">
        <div className="portal-section-title">
          <h2>Jump to</h2>
        </div>
        <div className="portal-grid">
          <article className="portal-card">
            <h3>Review queue</h3>
            <Link className="button" to="/portal/admin/reviews">
              Open reviews
            </Link>
          </article>
          <article className="portal-card">
            <h3>Talent applications</h3>
            <Link className="button" to="/portal/admin/applications">
              Open applications
            </Link>
          </article>
          <article className="portal-card">
            <h3>Enquiries</h3>
            <Link className="button" to="/portal/admin/enquiries">
              Open enquiries
            </Link>
          </article>
        </div>
      </section>
    </PortalPage>
  );
}
