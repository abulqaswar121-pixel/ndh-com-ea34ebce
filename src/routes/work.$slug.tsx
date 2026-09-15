import { ArrowLeft, ArrowUpRight } from 'lucide-react';
import { createFileRoute, Link, notFound } from '@tanstack/react-router';
import { PageShell, Button } from '@/components/PageShell';
import { getCaseStudy } from '@/lib/catalog.functions';
import { caseStudyImage } from '@/lib/editorial-assets';

export const Route = createFileRoute('/work/$slug')({
  loader: async ({ params }) => {
    const study = await getCaseStudy({ data: { slug: params.slug } });
    if (!study) throw notFound();
    return study;
  },
  head: ({ loaderData }) => {
    const title = loaderData ? `${loaderData.title} — NDH case study` : 'Case study — Najeeb Digital Hub';
    const description = loaderData?.summary ?? 'A case study from Najeeb Digital Hub.';
    return { meta: [
      { title }, { name: 'description', content: description },
      { property: 'og:title', content: title }, { property: 'og:description', content: description },
      { property: 'og:type', content: 'article' }, { name: 'twitter:card', content: 'summary_large_image' },
    ] };
  },
  notFoundComponent: () => <PageShell><main className="content editorial-empty"><h1>Case study not found</h1><Button to="/work">View all work</Button></main></PageShell>,
  component: CaseStudy,
});

function CaseStudy() {
  const study = Route.useLoaderData();
  const image = caseStudyImage(study.slug, study.cover_image_url);
  return (
    <PageShell>
      <main className="case-study-page">
        <Link className="editorial-back" to="/work"><ArrowLeft size={16} /> All work</Link>
        <header className="case-study-header">
          <div><p className="eyebrow">{study.category ?? 'Case study'}</p><h1>{study.title}</h1></div>
          <div className="case-study-summary">{study.client_name && <p className="case-study-client">For {study.client_name}</p>}<p>{study.summary}</p></div>
        </header>
        {image && <figure className="case-study-cover"><img src={image} alt={`Editorial visual for ${study.title}`} width={1400} height={900} fetchPriority="high" decoding="async" /><figcaption>Editorial representation of the project context.</figcaption></figure>}
        <div className="case-study-story">
          <p className="case-study-index">01</p><section><p className="eyebrow">The challenge</p><h2>What needed to change.</h2><p>{study.challenge}</p></section>
          <p className="case-study-index">02</p><section><p className="eyebrow">The approach</p><h2>How the work was shaped.</h2><p>{study.approach}</p></section>
          <p className="case-study-index">03</p><section><p className="eyebrow">The result</p><h2>What was delivered.</h2><p>{study.result}</p></section>
        </div>
        <aside className="case-study-next"><div><p className="eyebrow">Have a similar brief?</p><h2>Let’s map the clearest route through it.</h2></div><div className="actions"><Button to="/contact">Start a conversation</Button>{study.live_url && <a className="button button-secondary" href={study.live_url} target="_blank" rel="noopener noreferrer">View live project <ArrowUpRight size={16} /></a>}</div></aside>
      </main>
    </PageShell>
  );
}
