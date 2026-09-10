import { createFileRoute } from '@tanstack/react-router';
import { PageShell, PageIntro, Button } from '@/components/PageShell';

const title = 'Frequently asked questions — Najeeb Digital Hub';
const description =
  'Answers about NDH agency projects, pricing, the Academy, certificates, payments and the talent programme.';

const faqs: { group: string; items: [string, string][] }[] = [
  {
    group: 'Agency projects',
    items: [
      [
        'How does a project start?',
        'You send a brief through your client portal or the contact page. A project manager scopes the work with you, agrees milestones and cost, and assigns the right specialists. You follow progress, files and messages in your portal.',
      ],
      [
        'How is pricing agreed?',
        'Every engagement is scoped individually. After the scoping call you receive a clear quote and milestones before any work begins — no hidden extras.',
      ],
      [
        'How do payments work?',
        'Invoices are issued from your portal and paid securely online. Funds are held and released against agreed milestones, so you only release payment for work that has been delivered and reviewed.',
      ],
      [
        'Who works on my project?',
        'A dedicated project manager runs your project and assigns vetted talent from the NDH network. Work is reviewed before anything is handed over to you.',
      ],
    ],
  },
  {
    group: 'Academy',
    items: [
      [
        'How do I enrol in a course?',
        'Create a free account, open the Academy catalogue, choose a course and complete checkout. Paid courses are activated as soon as payment is confirmed; free courses start immediately.',
      ],
      [
        'Do you offer regional pricing?',
        'Yes. Course prices are shown for your region at checkout, in your local currency where supported.',
      ],
      [
        'How do I earn a certificate?',
        'Complete all lessons, pass the final exam and submit the course project. Once your project is reviewed and approved, your certificate is issued with a unique, publicly verifiable number.',
      ],
      [
        'Can a certificate be checked by an employer?',
        'Yes. Anyone can confirm a certificate on the verification page using the certificate number — no account needed.',
      ],
      [
        'Can I learn at my own pace?',
        'Yes. Lessons are available any time after enrolment and your progress is saved as you go.',
      ],
    ],
  },
  {
    group: 'Talent programme',
    items: [
      [
        'How do I join as talent?',
        'Apply through the Work with us page. The team reviews every application; accepted applicants receive an invitation to create their talent account.',
      ],
      [
        'How do I get paid?',
        'Approved work adds to your earnings. You request a payout from your talent portal and the team processes it.',
      ],
    ],
  },
  {
    group: 'Accounts & support',
    items: [
      [
        'I forgot my password — what do I do?',
        'Use the password reset link on the sign-in page and follow the email instructions.',
      ],
      [
        'How do I reach the team?',
        'Use the contact page, or message your project manager directly inside your portal once a project is running.',
      ],
    ],
  },
];

export const Route = createFileRoute('/faq')({
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
  component: Faq,
});

function Faq() {
  return (
    <PageShell>
      <PageIntro
        eyebrow="FAQ"
        title="Questions, answered."
        body="The essentials about agency projects, the Academy, certificates and working with NDH."
      />
      <main className="content faq-content">
        {faqs.map((section) => (
          <section key={section.group}>
            <div className="section-heading">
              <h2>{section.group}</h2>
            </div>
            <div className="faq-list">
              {section.items.map(([q, a]) => (
                <details key={q} className="faq-item">
                  <summary>{q}</summary>
                  <p>{a}</p>
                </details>
              ))}
            </div>
          </section>
        ))}
        <div className="cta-panel">
          <p className="eyebrow">Still unsure?</p>
          <h2>Ask us directly.</h2>
          <p>Send a message and the team will reply.</p>
          <div className="actions">
            <Button to="/contact">Contact us</Button>
          </div>
        </div>
      </main>
    </PageShell>
  );
}
