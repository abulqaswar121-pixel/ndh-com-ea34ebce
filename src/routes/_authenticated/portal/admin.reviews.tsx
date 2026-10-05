import { createFileRoute } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { ClipboardCheck } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { PortalPage } from '@/components/PortalShell';
import { reviewSubmission } from '@/lib/admin.functions';

export const Route = createFileRoute('/_authenticated/portal/admin/reviews')({
  component: Reviews,
});

function Reviews() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loadError, setLoadError] = useState('');

  async function load() {
    setLoadError('');
    const { data, error } = await (supabase as any)
      .from('student_projects')
      .select('*, courses(title)')
      .eq('status', 'submitted')
      .order('created_at', { ascending: false });
    if (error) {
      setLoadError('The review queue could not be loaded. Please try again.');
      setReviews([]);
      return;
    }
    const rows = data ?? [];
    const studentIds = [...new Set(rows.map((row: any) => row.student_id).filter(Boolean))];
    const { data: profiles } = studentIds.length
      ? await (supabase as any).from('profiles').select('id, full_name, email').in('id', studentIds)
      : { data: [] };
    const profilesById = new Map((profiles ?? []).map((profile: any) => [profile.id, profile]));
    setReviews(rows.map((row: any) => ({ ...row, profile: profilesById.get(row.student_id) })));
  }

  useEffect(() => {
    void load();
  }, []);

  return (
    <PortalPage
      eyebrow="ADMIN PORTAL"
      title="Review queue"
      intro="Student projects waiting for approval and signing."
      icon={ClipboardCheck}
    >
      <section className="portal-section">
        {loadError ? (
          <div className="empty-card is-error">{loadError}</div>
        ) : reviews.length === 0 ? (
          <div className="empty-card">No open project reviews.</div>
        ) : (
          <div className="portal-grid">
            {reviews.map((r) => (
              <article className="portal-card" key={r.id}>
                <ClipboardCheck size={20} />
                <h3>{r.profile?.full_name ?? 'Student'} — {r.courses?.title ?? 'Course project'}</h3>
                <p className="admin-note">{r.profile?.email}</p>
                <p>{r.brief}</p>
                {r.submission_text && <p>{r.submission_text}</p>}
                {r.submission_url && <a href={r.submission_url} target="_blank" rel="noreferrer">View submission</a>}
                <div className="project-actions">
                  <button
                    className="button"
                    onClick={async () => {
                      await reviewSubmission({ data: { submissionId: r.id, decision: 'approved' } });
                      await load();
                    }}
                  >
                    Approve &amp; sign
                  </button>
                  <button
                    onClick={async () => {
                      await reviewSubmission({
                        data: { submissionId: r.id, decision: 'rejected', note: 'Please revise and resubmit.' },
                      });
                      await load();
                    }}
                  >
                    Reject
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </PortalPage>
  );
}
