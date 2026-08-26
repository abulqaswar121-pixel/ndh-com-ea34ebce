import { createFileRoute } from '@tanstack/react-router';
import { PageShell, PageIntro } from '@/components/PageShell';

const title = 'Privacy notice — Najeeb Digital Hub';
const description = 'How Najeeb Digital Hub handles the information you share through the site, portals and Academy.';

export const Route = createFileRoute('/privacy')({
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
        eyebrow="Privacy"
        title="Privacy notice"
        body="This notice explains how information is handled when you use Najeeb Digital Hub."
      />
      <main className="content prose">
        <h2>Information we hold</h2>
        <p>We use information you provide to respond to enquiries, deliver services and operate the Academy.</p>
        <h2>Access</h2>
        <p>Portal data is restricted to your own account and the staff assigned to your work.</p>
        <h2>Questions</h2>
        <p>Contact NDH if you have a question about this notice.</p>
      </main>
    </PageShell>
  ),
});
