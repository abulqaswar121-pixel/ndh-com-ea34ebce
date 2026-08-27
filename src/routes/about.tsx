import { createFileRoute } from '@tanstack/react-router';
import { PageShell, PageIntro } from '@/components/PageShell';
import { Reveal } from '@/components/Reveal';

const title = 'About — Najeeb Digital Hub';
const description =
  'Najeeb Digital Hub is a digital agency and AI skills academy: managed delivery for businesses, practical certification for learners.';

export const Route = createFileRoute('/about')({
  head: () => ({
    meta: [
      { title },
      { name: 'description', content: description },
      { property: 'og:title', content: title },
      { property: 'og:description', content: description },
    ],
  }),
  component: About,
});

function About() {
  return (
    <PageShell>
      <PageIntro
        eyebrow="About"
        title="A digital agency and an AI skills academy."
        body="Najeeb Digital Hub helps businesses access digital delivery, and helps learners develop practical AI skills they can prove."
      />
      <main className="content">
        <div className="about-grid">
          <Reveal>
            <div className="prose">
              <h2>What we do</h2>
              <p>
                Businesses bring a brief. A project manager clarifies the scope, assigns the right
                capability, and reviews the work before it is handed over. Nothing ships unchecked.
              </p>
              <h2>How the academy works</h2>
              <p>
                Courses are short and specific. Each one ends with an AI-set exam and a reviewed project,
                so a certificate reflects work actually done rather than time spent watching.
              </p>
              <h2>Where we work</h2>
              <p>Based in Nigeria, working with clients and learners worldwide.</p>
            </div>
          </Reveal>
          <Reveal delay={100}>
            <img
              className="founder-photo"
              src="/ndh-about-new.png"
              alt="A minimal studio workspace for digital delivery and AI skills certification"
              loading="lazy"
              width={1280}
              height={1024}
            />
          </Reveal>
        </div>
      </main>
    </PageShell>
  );
}
