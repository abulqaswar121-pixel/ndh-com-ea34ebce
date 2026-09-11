import { createFileRoute } from '@tanstack/react-router';
import { ArrowUpRight } from 'lucide-react';
import { PageShell, PageIntro, Button } from '@/components/PageShell';
import { Reveal } from '@/components/Reveal';
import { listCaseStudies } from '@/lib/catalog.functions';

const title = 'Selected work — Case studies | Najeeb Digital Hub';
const description = 'Projects delivered by Najeeb Digital Hub: the brief, the approach and the outcome.';

export const Route = createFileRoute('/work')({
  head: () => ({
    meta: [
      { title },
      { name: 'description', content: description },
      { property: 'og:title', content: title },
      { property: 'og:description', content: description },
      { property: 'og:type', content: 'website' },
      { property: 'og:image', content: 'https://ndh.com.ng/og-image.png' },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:image', content: 'https://ndh.com.ng/og-image.png' },
    ],
  }),
  loader: () => listCaseStudies(),
  errorComponent: () => (
    <PageShell>
      <main className="content">
        <h1>Work unavailable</h1>
        <p>We could not load the case studies. Please refresh the page.</p>
      </main>
    </PageShell>
  ),
  component: Work,
});

function Work() {
  const studies = Route.useLoaderData();
  return (
    <PageShell>
      <PageIntro
        eyebrow="Selected work"
        title="What we have delivered."
        body="A closer look at briefs we have taken on: the problem, the route we chose and the result."
      />
      <main className="content">
        {studies.length === 0 ? (
          <div className="empty-card">
            <p>Case studies are being prepared for publication.</p>
            <Button to="/contact">Talk to us about your project</Button>
          </div>
        ) : (
          <div className="case-list">
            {studies.map((s, i) => (
              <Reveal key={s.slug} delay={(i % 2) * 80}>
                <article className="case-card">
                  {s.cover_image_url && <img src={s.cover_image_url} alt={`Project cover for ${s.title}`} width={1200} height={800} loading="lazy" decoding="async" />}
                  <div>
                    {s.category && <p className="tag-pill">{s.category}</p>}
                    <p className="eyebrow">{s.client_name}</p>
                    <h2>{s.title}</h2>
                    <p>{s.summary}</p>
                    {s.challenge && (
                      <p className="case-detail">
                        <strong>Challenge.</strong> {s.challenge}
                      </p>
                    )}
                    {s.approach && (
                      <p className="case-detail">
                        <strong>Approach.</strong> {s.approach}
                      </p>
                    )}
                    {s.result && (
                      <p className="case-detail">
                        <strong>Result.</strong> {s.result}
                      </p>
                    )}
                    {s.live_url && (
                      <p>
                        <a className="text-link" href={s.live_url} target="_blank" rel="noopener noreferrer">
                          View live project <ArrowUpRight size={15} />
                        </a>
                      </p>
                    )}
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        )}
      </main>
    </PageShell>
  );
}
