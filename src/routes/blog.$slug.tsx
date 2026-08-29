import { createFileRoute, Link, notFound } from '@tanstack/react-router';
import { PageShell } from '@/components/PageShell';
import { getPost } from '@/lib/catalog.functions';

export const Route = createFileRoute('/blog/$slug')({
  loader: async ({ params }) => {
    const post = await getPost({ data: { slug: params.slug } });
    if (!post) throw notFound();
    return post;
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return { meta: [{ title: 'Article unavailable — NDH' }, { name: 'robots', content: 'noindex' }] };
    }
    const t = `${loaderData.title} — NDH Blog`;
    const d = loaderData.excerpt ?? 'An article from Najeeb Digital Hub.';
    const meta: Record<string, string>[] = [
      { title: t },
      { name: 'description', content: d },
      { property: 'og:title', content: t },
      { property: 'og:description', content: d },
      { property: 'og:type', content: 'article' },
      { name: 'twitter:card', content: 'summary_large_image' },
    ];
    if (loaderData.cover_image_url?.startsWith('https://')) {
      meta.push({ property: 'og:image', content: loaderData.cover_image_url });
      meta.push({ name: 'twitter:image', content: loaderData.cover_image_url });
    }
    return { meta };
  },
  errorComponent: () => (
    <PageShell>
      <main className="content">
        <h1>Article unavailable</h1>
        <Link className="button" to="/blog">
          Back to the blog
        </Link>
      </main>
    </PageShell>
  ),
  notFoundComponent: () => (
    <PageShell>
      <main className="content">
        <h1>Article not found</h1>
        <Link className="button" to="/blog">
          Back to the blog
        </Link>
      </main>
    </PageShell>
  ),
  component: Post,
});

function Post() {
  const post = Route.useLoaderData();
  return (
    <PageShell>
      <main className="content article">
        <nav className="crumbs">
          <Link to="/blog">Blog</Link>
          <span>/</span>
          <span>{post.title}</span>
        </nav>
        <h1>{post.title}</h1>
        <p className="post-meta">
          {post.author_name ?? 'NDH'}
          {post.published_at ? ` · ${new Date(post.published_at).toLocaleDateString()}` : ''}
        </p>
        {post.cover_image_url && <img className="article-cover" src={post.cover_image_url} alt="" />}
        <div className="article-body">
          {(post.body ?? '')
            .split('\n')
            .filter((line) => line.trim())
            .map((line, i) => (
              <p key={i}>{line}</p>
            ))}
        </div>
      </main>
    </PageShell>
  );
}
