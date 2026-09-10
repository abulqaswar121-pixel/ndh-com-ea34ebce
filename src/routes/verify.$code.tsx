import { createFileRoute, Link } from '@tanstack/react-router';
import { BadgeCheck, ShieldX } from 'lucide-react';
import { PageShell, PageIntro } from '@/components/PageShell';
import { verifyCertificate } from '@/lib/verify.functions';

export const Route = createFileRoute('/verify/$code')({
  loader: ({ params }) => verifyCertificate({ data: { code: params.code } }),
  head: ({ loaderData, params }) => {
    const cert = loaderData?.certificate;
    const title = cert
      ? `Valid certificate — ${cert.course_title} | NDH`
      : 'Certificate not found — NDH';
    const description = cert
      ? `Certificate ${params.code} issued to ${cert.student_name} for ${cert.course_title}.`
      : `No NDH Academy certificate matches ${params.code}.`;
    return {
      meta: [
        { title },
        { name: 'description', content: description },
        { property: 'og:title', content: title },
        { property: 'og:description', content: description },
        { property: 'og:type', content: 'website' },
        { name: 'robots', content: 'noindex' },
        { name: 'twitter:card', content: 'summary' },
      ],
    };
  },
  component: VerifyResult,
});

function VerifyResult() {
  const { certificate } = Route.useLoaderData();
  const { code } = Route.useParams();

  return (
    <PageShell allowSignedIn>
      <PageIntro
        eyebrow="Verification"
        title={certificate ? 'Certificate verified' : 'Certificate not found'}
        body={
          certificate
            ? 'This certificate number matches an NDH Academy record.'
            : `No NDH Academy certificate matches “${code}”. Check the number and try again.`
        }
      />
      <main className="content">
        {certificate ? (
          <div className="verify-card verify-valid">
            <BadgeCheck size={40} />
            <dl>
              <div>
                <dt>Issued to</dt>
                <dd>{certificate.student_name}</dd>
              </div>
              <div>
                <dt>Course</dt>
                <dd>{certificate.course_title}</dd>
              </div>
              <div>
                <dt>Certificate number</dt>
                <dd>{certificate.certificate_number}</dd>
              </div>
              <div>
                <dt>Issue date</dt>
                <dd>{new Date(certificate.issue_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</dd>
              </div>
            </dl>
            <p className="admin-note">
              Certificates are issued only after a student passes the final exam and their project
              is reviewed and approved.
            </p>
          </div>
        ) : (
          <div className="verify-card verify-invalid">
            <ShieldX size={40} />
            <p>
              This number is not in our records. It may be typed incorrectly, or the document may
              not be a genuine NDH certificate.
            </p>
            <Link to="/verify" className="button">
              Try another number
            </Link>
          </div>
        )}
      </main>
    </PageShell>
  );
}
