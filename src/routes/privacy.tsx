import { createFileRoute } from '@tanstack/react-router';
import { PageShell, PageIntro } from '@/components/PageShell';
import { PrivacyBody } from '@/components/portal/LegalContent';

const title = 'Privacy notice — Najeeb Digital Hub';
const description = 'How Najeeb Digital Hub handles the information you share through the site, portals and Academy.';

export const Route = createFileRoute('/privacy')({
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
        eyebrow="Privacy"
        title="Privacy notice"
        body="This notice explains how information is handled when you use Najeeb Digital Hub."
      />
      <main className="content prose">
        <PrivacyBody />
      </main>
    </PageShell>
  ),
});
