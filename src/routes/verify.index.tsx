import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useState } from 'react';
import { BadgeCheck } from 'lucide-react';
import { PageShell, PageIntro } from '@/components/PageShell';

const title = 'Verify a certificate — Najeeb Digital Hub';
const description =
  'Confirm that an NDH Academy certificate is genuine. Enter the certificate number printed on the document.';

export const Route = createFileRoute('/verify/')({
  head: () => ({
    meta: [
      { title },
      { name: 'description', content: description },
      { property: 'og:title', content: title },
      { property: 'og:description', content: description },
      { property: 'og:type', content: 'website' },
      { name: 'twitter:card', content: 'summary' },
    ],
  }),
  component: VerifyIndex,
});

function VerifyIndex() {
  const navigate = useNavigate();
  const [code, setCode] = useState('');

  return (
    <PageShell allowSignedIn>
      <PageIntro
        eyebrow="Verification"
        title="Verify a certificate"
        body="Every NDH Academy certificate carries a unique number. Enter it below to confirm the holder, the course and the issue date."
      />
      <main className="content">
        <form
          className="verify-form"
          onSubmit={(e) => {
            e.preventDefault();
            const trimmed = code.trim();
            if (trimmed) navigate({ to: '/verify/$code', params: { code: trimmed } });
          }}
        >
          <BadgeCheck size={28} />
          <label htmlFor="cert-code">Certificate number</label>
          <input
            id="cert-code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="e.g. NDH-1736…-A1B2C3"
            autoComplete="off"
            required
          />
          <button type="submit" className="button">
            Verify certificate
          </button>
          <p className="admin-note">
            The number is printed on the certificate document and included in the issue email.
          </p>
        </form>
      </main>
    </PageShell>
  );
}
