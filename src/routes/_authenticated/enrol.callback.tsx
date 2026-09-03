import { createFileRoute, Link, useSearch } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { CheckCircle2, Loader2, XCircle } from 'lucide-react';
import { PageShell } from '@/components/PageShell';
import { verifyCoursePayment } from '@/lib/payment.functions';

type Search = { reference?: string; trxref?: string };

export const Route = createFileRoute('/_authenticated/enrol/callback')({
  validateSearch: (search: Record<string, unknown>): Search => ({
    reference: typeof search['reference'] === 'string' ? search['reference'] : undefined,
    trxref: typeof search['trxref'] === 'string' ? search['trxref'] : undefined,
  }),
  component: EnrolCallback,
});

function EnrolCallback() {
  const search = useSearch({ from: '/_authenticated/enrol/callback' });
  const reference = search.reference ?? search.trxref ?? '';
  const [state, setState] = useState<'checking' | 'paid' | 'unpaid' | 'error'>('checking');
  const [slug, setSlug] = useState<string | null>(null);
  const [title, setTitle] = useState<string | null>(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!reference) {
      setState('error');
      setMessage('No payment reference was returned.');
      return;
    }
    let cancelled = false;
    void (async () => {
      try {
        const result = await verifyCoursePayment({ data: { reference } });
        if (cancelled) return;
        setSlug(result.slug);
        setTitle(result.title);
        setState(result.paid ? 'paid' : 'unpaid');
      } catch (err) {
        if (cancelled) return;
        setMessage(err instanceof Error ? err.message : 'We could not confirm this payment.');
        setState('error');
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [reference]);

  return (
    <PageShell>
      <main className="content enrol-callback">
        {state === 'checking' && (
          <div className="empty-card">
            <Loader2 className="spin" size={22} />
            <h1>Confirming your payment…</h1>
            <p>This takes a few seconds. Please do not close this page.</p>
          </div>
        )}

        {state === 'paid' && (
          <div className="empty-card">
            <CheckCircle2 size={26} />
            <h1>You are enrolled{title ? ` in ${title}` : ''}.</h1>
            <p>Your lessons are unlocked. Work through them in order, then sit the final assessment.</p>
            <div className="project-actions">
              {slug && (
                <Link className="button" to="/learning/$slug" params={{ slug }}>
                  Start learning
                </Link>
              )}
              <Link className="button button-secondary" to="/portal/student">
                My learning
              </Link>
            </div>
          </div>
        )}

        {state === 'unpaid' && (
          <div className="empty-card">
            <XCircle size={26} />
            <h1>Payment not completed</h1>
            <p>The payment was not confirmed. You have not been charged for an incomplete transaction.</p>
            <Link className="button" to="/academy">
              Back to courses
            </Link>
          </div>
        )}

        {state === 'error' && (
          <div className="empty-card">
            <XCircle size={26} />
            <h1>We could not confirm this payment</h1>
            <p>{message}</p>
            <Link className="button" to="/portal/student">
              Go to my learning
            </Link>
          </div>
        )}
      </main>
    </PageShell>
  );
}
