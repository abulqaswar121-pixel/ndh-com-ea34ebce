import { createFileRoute, Link } from '@tanstack/react-router';
import { ArrowRight } from 'lucide-react';
import { PageShell, PageIntro, Button } from '@/components/PageShell';
import { Reveal } from '@/components/Reveal';
import { listCaseStudies } from '@/lib/catalog.functions';
import { caseStudyImage } from '@/lib/editorial-assets';

const title = 'Selected work — Case studies | Najeeb Digital Hub';
const description = 'Projects delivered by Najeeb Digital Hub: the brief, the approach and the outcome.';

export const Route = createFileRoute('/work/')({
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
  const [featured, ...supporting] = studies;
  return (
    <PageShell>
      <PageIntro
        eyebrow="Selected work"
        title="What we have delivered."
        body="A closer look at briefs we have taken on: the problem, the route we chose and the result."
      />
      <main className="content work-page">
        {studies.length === 0 ? (
          <div className="empty-card">
            <p>Case studies are being prepared for publication.</p>
            <Button to="/contact">Talk to us about your project</Button>
          </div>
        ) : (
          <>
            {featured && (
              <Reveal>
                <Link className="case-feature" to="/work/$slug" params={{ slug: featured.slug }}>
                  {caseStudyImage(featured.slug, featured.cover_image_url) && (
                    <img src={caseStudyImage(featured.slug, featured.cover_image_url) ?? ''} alt={`Relevant visual for ${featured.title}`} width={1400} height={900} fetchPriority="high" decoding="async" />
                  )}
                  <div className="case-feature-copy">
                    <p className="case-kicker">{featured.category ?? 'Case study'} <span>Featured work</span></p>
                    <p className="case-client">{featured.client_name}</p>
                    <h2>{featured.title}</h2>
                    <p>{featured.summary}</p>
                    <span className="editorial-link">Read the case study <ArrowRight size={17} /></span>
                  </div>
                </Link>
              </Reveal>
            )}
            <div className="case-card-grid">
              {supporting.map((study, index) => {
                const image = caseStudyImage(study.slug, study.cover_image_url);
                return (
                  <Reveal key={study.slug} delay={(index % 2) * 70}>
                    <Link className="case-editorial-card" to="/work/$slug" params={{ slug: study.slug }}>
                      {image && <img src={image} alt={`Relevant visual for ${study.title}`} width={900} height={600} loading="lazy" decoding="async" />}
                      <div className="case-editorial-copy">
                        <p className="case-kicker">{study.category ?? 'Case study'}</p>
                        <p className="case-client">{study.client_name}</p>
                        <h2>{study.title}</h2>
                        <p>{study.summary}</p>
                        <span className="editorial-link">View case study <ArrowRight size={16} /></span>
                      </div>
                    </Link>
                  </Reveal>
                );
              })}
            </div>
          </>
        )}
      </main>
    </PageShell>
  );
}
