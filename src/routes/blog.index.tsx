import { ArrowRight } from 'lucide-react';
import { createFileRoute, Link } from '@tanstack/react-router';
import { PageShell, PageIntro } from '@/components/PageShell';
import { Reveal } from '@/components/Reveal';
import { listPosts } from '@/lib/catalog.functions';
import { blogImage } from '@/lib/editorial-assets';

const title = 'Blog — Notes on digital delivery and AI skills | NDH';
const description =
  'Practical writing from Najeeb Digital Hub on running digital projects, AI tools and building useful skills.';

export const Route = createFileRoute('/blog/')({
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
  const [featured, ...supporting] = posts;
  return (
    <PageShell>
      <PageIntro
        eyebrow="Blog"
        title="Notes from the work."
        body="Short, practical writing on digital delivery, AI tools and building skills that hold up."
      />
      <main className="content journal-page">
        {posts.length === 0 ? (
          <div className="empty-card">The first articles are on the way. Check back shortly.</div>
        ) : (
          <>
            {featured && (
              <Reveal>
                <Link to="/blog/$slug" params={{ slug: featured.slug }} className="journal-feature">
                  <img src={blogImage(featured.slug, featured.cover_image_url) ?? ''} alt={`Editorial photograph for ${featured.title}`} width={1400} height={900} fetchPriority="high" decoding="async" />
                  <div>
                    <p className="case-kicker">Featured note</p>
                    <h2>{featured.title}</h2>
                    <p>{featured.excerpt}</p>
                    <span className="post-meta">{featured.author_name ?? 'NDH'}{featured.published_at ? ` · ${new Date(featured.published_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}` : ''}</span>
                    <span className="editorial-link">Read article <ArrowRight size={16} /></span>
                  </div>
                </Link>
              </Reveal>
            )}
            <div className="journal-grid">
              {supporting.map((post, index) => (
                <Reveal key={post.slug} delay={(index % 2) * 70}>
                  <Link to="/blog/$slug" params={{ slug: post.slug }} className="journal-card">
                    <img src={blogImage(post.slug, post.cover_image_url) ?? ''} alt={`Editorial photograph for ${post.title}`} width={900} height={600} loading="lazy" decoding="async" />
                    <div>
                      <p className="case-kicker">NDH journal</p>
                      <h2>{post.title}</h2>
                      <p>{post.excerpt}</p>
                      <span className="editorial-link">Read article <ArrowRight size={16} /></span>
                    </div>
                  </Link>
                </Reveal>
              ))}
            </div>
          </>
        )}
      </main>
    </PageShell>
  );
}
