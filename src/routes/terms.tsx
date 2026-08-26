import { createFileRoute } from '@tanstack/react-router';
import { PageShell, PageIntro } from '@/components/PageShell';

const title = 'Terms of service — Najeeb Digital Hub';
const description = 'The terms that apply to using Najeeb Digital Hub services, the Academy and certification.';

export const Route = createFileRoute('/terms')({
  head: () => ({
    meta: [
      { title },
      { name: 'description', content: description },
      { property: 'og:title', content: title },
      { property: 'og:description', content: description },
    ],
  }),
  component: () => (
    <PageShell>
      <PageIntro
        eyebrow="Terms"
        title="Terms of service"
        body="These terms describe the basis for using Najeeb Digital Hub services and certification."
      />
      <main className="content prose">
        <h2>Using NDH</h2>
        <p>By using this site, you agree to provide accurate information and use the services lawfully.</p>
        <h2>Service work</h2>
        <p>Project scope, milestones, review and delivery are agreed for each engagement.</p>
        <h2>Academy</h2>
        <p>Certificates are issued only after the exam and project review are completed and signed off.</p>
      </main>
    </PageShell>
  ),
});
