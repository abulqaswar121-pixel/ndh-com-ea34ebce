import { createFileRoute } from '@tanstack/react-router';
import { listCourses, listCaseStudies, listPosts } from '@/lib/catalog.functions';

const SITE = 'https://ndh.com.ng';

const staticUrls: { path: string; changefreq: string; priority: string }[] = [
  { path: '/', changefreq: 'weekly', priority: '1.0' },
  { path: '/agency', changefreq: 'weekly', priority: '0.9' },
  { path: '/academy', changefreq: 'daily', priority: '0.9' },
  { path: '/work', changefreq: 'weekly', priority: '0.8' },
  { path: '/blog', changefreq: 'daily', priority: '0.7' },
  { path: '/about', changefreq: 'monthly', priority: '0.6' },
  { path: '/contact', changefreq: 'monthly', priority: '0.6' },
  { path: '/faq', changefreq: 'monthly', priority: '0.5' },
  { path: '/talent-application', changefreq: 'monthly', priority: '0.4' },
  { path: '/verify', changefreq: 'monthly', priority: '0.3' },
  { path: '/privacy', changefreq: 'yearly', priority: '0.2' },
  { path: '/terms', changefreq: 'yearly', priority: '0.2' },
  { path: '/agency/brand-identity', changefreq: 'monthly', priority: '0.6' },
  { path: '/agency/design-product', changefreq: 'monthly', priority: '0.6' },
  { path: '/agency/development', changefreq: 'monthly', priority: '0.6' },
  { path: '/agency/content-writing', changefreq: 'monthly', priority: '0.6' },
  { path: '/agency/marketing-growth', changefreq: 'monthly', priority: '0.6' },
  { path: '/agency/video-media', changefreq: 'monthly', priority: '0.6' },
  { path: '/agency/data-business', changefreq: 'monthly', priority: '0.6' },
  { path: '/agency/ai-automation', changefreq: 'monthly', priority: '0.6' },
];

function url(loc: string, changefreq: string, priority: string) {
  return `  <url>\n    <loc>${loc}</loc>\n    <changefreq>${changefreq}</changefreq>\n    <priority>${priority}</priority>\n  </url>`;
}

async function buildSitemap(): Promise<string> {
  const [courses, studies, posts] = await Promise.all([
    listCourses().catch(() => []),
    listCaseStudies().catch(() => []),
    listPosts().catch(() => []),
  ]);

  const entries = [
    ...staticUrls.map((u) => url(`${SITE}${u.path}`, u.changefreq, u.priority)),
    ...courses.map((c) => url(`${SITE}/academy/${c.slug}`, 'monthly', '0.7')),
    ...studies.map((s) => url(`${SITE}/work/${s.slug}`, 'monthly', '0.6')),
    ...posts.map((p) => url(`${SITE}/blog/${p.slug}`, 'monthly', '0.6')),
  ];

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries.join('\n')}\n</urlset>\n`;
}

// Generated on request from the live catalog (courses, case studies, posts) so the
// sitemap never drifts out of sync with what is actually published — no more
// hand-maintained URL lists that go stale as the catalog grows.
export const Route = createFileRoute('/sitemap.xml')({
  server: {
    handlers: {
      GET: async () => {
        const xml = await buildSitemap();
        return new Response(xml, {
          headers: {
            'Content-Type': 'application/xml; charset=utf-8',
            'Cache-Control': 'public, max-age=0, s-maxage=3600',
          },
        });
      },
    },
  },
});
