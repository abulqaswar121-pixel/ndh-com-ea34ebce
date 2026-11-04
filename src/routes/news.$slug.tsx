import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, CalendarDays, Link2, MessageCircle } from "lucide-react";
import { useState } from "react";
import { FamilyPage } from "@/components/ecosystem/FamilyPage";
import { BUSINESS_PROFILES } from "@/lib/business-profiles";
import { SUBSIDIARIES } from "@/lib/ecosystem";
import { formatNewsDate, mergeNews } from "@/lib/news";
import { listStudioPosts } from "@/lib/news.functions";
import { BRAND } from "@/lib/brand";

export const Route = createFileRoute("/news/$slug")({
  loader: async ({ params }) => {
    const studio = await listStudioPosts().catch(() => []);
    const post = mergeNews(studio).find((item) => item.slug === params.slug);
    if (!post) throw notFound();
    return { post };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [{ title: "Announcement | NDH" }, { name: "robots", content: "noindex" }],
      };
    }
    const { post } = loaderData;
    const url = `${BRAND.url}/news/${post.slug}`;
    return {
      meta: [
        { title: `${post.title} | NDH Newsroom` },
        { name: "description", content: post.excerpt },
        { property: "og:title", content: post.title },
        { property: "og:description", content: post.excerpt },
        { property: "og:type", content: "article" },
        { property: "og:url", content: url },
        { property: "article:published_time", content: post.publishedAt },
        { name: "twitter:card", content: "summary_large_image" },
      ],
      links: [{ rel: "canonical", href: url }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "NewsArticle",
            headline: post.title,
            description: post.excerpt,
            datePublished: post.publishedAt,
            publisher: { "@type": "Organization", name: BRAND.displayName, url: BRAND.url },
            mainEntityOfPage: url,
          }),
        },
      ],
    };
  },
  notFoundComponent: () => (
    <FamilyPage>
      <div className="nx-wrap nx-section">
        <h1>Announcement not found</h1>
        <p>This announcement may have been moved or unpublished.</p>
        <Link to="/news" className="ndh-head-link">
          Back to the newsroom <ArrowRight size={15} />
        </Link>
      </div>
    </FamilyPage>
  ),
  errorComponent: () => (
    <FamilyPage>
      <div className="nx-wrap nx-section">
        <h1>We couldn&apos;t load this announcement</h1>
        <Link to="/news" className="ndh-head-link">
          Back to the newsroom <ArrowRight size={15} />
        </Link>
      </div>
    </FamilyPage>
  ),
  component: NewsArticle,
});

function NewsArticle() {
  const { post } = Route.useLoaderData();
  const [copied, setCopied] = useState(false);
  const business = post.businessId
    ? SUBSIDIARIES.find((item) => item.id === post.businessId)
    : undefined;
  const shareUrl = `${BRAND.url}/news/${post.slug}`;
  const related = mergeNews([])
    .filter((item) => item.slug !== post.slug)
    .slice(0, 2);

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      setCopied(false);
    }
  }

  return (
    <FamilyPage>
      <article className="ndh-article">
        <header className="ndh-article-head">
          <div className="nx-wrap">
            <Link to="/news" className="nx-back">
              <ArrowLeft size={15} /> Newsroom
            </Link>
            <p className="ndh-news-meta is-on-dark">
              <span className="ndh-news-badge is-solid">{post.badge}</span>
              <span>{post.category}</span>
              <time dateTime={post.publishedAt}>
                <CalendarDays size={13} aria-hidden="true" />
                {formatNewsDate(post.publishedAt)}
              </time>
            </p>
            <h1>{post.title}</h1>
            <p className="ndh-article-lead">{post.excerpt}</p>
          </div>
        </header>

        <div className="nx-wrap ndh-article-body">
          {post.cover ? (
            <figure className="ndh-article-cover">
              <img src={post.cover} alt={post.coverAlt ?? ""} width={1200} height={675} />
            </figure>
          ) : null}

          {post.blocks.map((block, index) => (
            <section key={`${post.slug}-${index}`} className="ndh-article-block">
              {block.heading ? <h2>{block.heading}</h2> : null}
              {block.paragraphs?.map((text) => (
                <p key={text.slice(0, 48)}>{text}</p>
              ))}
              {block.bullets?.length ? (
                <ul>
                  {block.bullets.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              ) : null}
            </section>
          ))}

          {business ? (
            <aside className="ndh-article-product">
              <p className="nx-eyebrow">Platform</p>
              <h3>{BUSINESS_PROFILES[business.id].name}</h3>
              <p>{BUSINESS_PROFILES[business.id].role}</p>
              <Link
                to="/businesses/$id"
                params={{ id: business.id }}
                className="ndh-btn ndh-btn-ghost"
              >
                Read the overview <ArrowRight size={15} />
              </Link>
            </aside>
          ) : null}

          <div className="ndh-article-actions">
            <button type="button" className="ndh-btn ndh-btn-ghost" onClick={() => void copyLink()}>
              <Link2 size={15} /> {copied ? "Link copied" : "Copy link"}
            </button>
            <a
              className="ndh-btn ndh-btn-whatsapp"
              href={`https://wa.me/?text=${encodeURIComponent(`${post.title} — ${shareUrl}`)}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <MessageCircle size={15} /> Share on WhatsApp
            </a>
          </div>
        </div>
      </article>

      <section className="nx-section ndh-porcelain">
        <div className="nx-wrap">
          <h2 className="ndh-h2">More announcements</h2>
          <div className="ndh-news-grid">
            {related.map((item) => (
              <Link
                key={item.slug}
                to="/news/$slug"
                params={{ slug: item.slug }}
                className="ndh-news-card"
              >
                <span className="ndh-news-meta">
                  <span className="ndh-news-badge">{item.badge}</span>
                  <time dateTime={item.publishedAt}>{formatNewsDate(item.publishedAt)}</time>
                </span>
                <h3>{item.title}</h3>
                <p>{item.excerpt}</p>
                <span className="ndh-news-more">
                  Read announcement <ArrowRight size={14} aria-hidden="true" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </FamilyPage>
  );
}
