import { createFileRoute, Link } from '@tanstack/react-router';
import { PageShell, PageIntro } from '@/components/PageShell';
import { Reveal } from '@/components/Reveal';
import { listPosts } from '@/lib/catalog.functions';

const title = 'Blog — Notes on digital delivery and AI skills | NDH';
const description =
  'Practical writing from Najeeb Digital Hub on running digital projects, AI tools and building useful skills.';

export const Route = createFileRoute('/blog')({
  head: () => ({
    meta: [
      { title },
      { name: 'description', content: description },
      { property: 'og:title', content: title },
      { property: 'og:description', content: description },
      { property: 'og:type', content: 'website' },
      { name: 'twitter:card', content: 'summary_large_image' },
    ],
  }),
  loader: () => listPosts(),
  errorComponent: () => (
    <PageShell>
      <main className="content">
        <h1>Blog unavailable</h1>
        <p>We could not load the articles just now. Please refresh the page.</p>
      </main>
    </PageShell>
  ),
  component: Blog,
});

function Blog() {
  const posts = Route.useLoaderData();
  return (
    <PageShell>
      <PageIntro
        eyebrow="Blog"
        title="Notes from the work."
        body="Short, practical writing on digital delivery, AI tools and building skills that hold up."
      />
      <main className="content">
        {posts.length === 0 ? (
          <div className="empty-card">The first articles are on the way. Check back shortly.</div>
        ) : (
          <div className="post-grid">
            {posts.map((p, i) => (
              <Reveal key={p.slug} delay={(i % 3) * 60}>
                <Link to="/blog/$slug" params={{ slug: p.slug }} className="post-card">
                  {p.cover_image_url && <img src={p.cover_image_url} alt="" loading="lazy" />}
                  <h2>{p.title}</h2>
                  <p>{p.excerpt}</p>
                  <span className="post-meta">
                    {p.author_name ?? 'NDH'}
                    {p.published_at ? ` · ${new Date(p.published_at).toLocaleDateString()}` : ''}
                  </span>
                </Link>
              </Reveal>
            ))}
          </div>
        )}
      </main>
    </PageShell>
  );
}
