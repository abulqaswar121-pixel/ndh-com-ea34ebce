import { createFileRoute } from '@tanstack/react-router';
import { PageShell, PageIntro } from '@/components/PageShell';
import { TermsBody } from '@/components/portal/LegalContent';

const title = 'Terms of service — Najeeb Digital Hub';
const description = 'The terms that apply to using Najeeb Digital Hub services, the Academy and certification.';

export const Route = createFileRoute('/terms')({
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
  component: () => (
    <PageShell>
      <PageIntro
        eyebrow="Terms"
        title="Terms of service"
        body="These terms describe the basis for using Najeeb Digital Hub services and certification."
      />
      <main className="content prose">
        <TermsBody />
      </main>
    </PageShell>
  ),
});
