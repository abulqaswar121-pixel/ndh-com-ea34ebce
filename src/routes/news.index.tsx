import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowRight, CalendarDays, Megaphone } from "lucide-react";
import { FamilyPage } from "@/components/ecosystem/FamilyPage";
import { formatNewsDate, mergeNews } from "@/lib/news";
import { listStudioPosts } from "@/lib/news.functions";
import { BRAND } from "@/lib/brand";

const title = "Newsroom | NAJEEB DIGITAL HUB (NDH)";
const description =
  "Official NDH announcements: new product releases, platform updates, roadmap notes and company news from across the NDH family.";

export const Route = createFileRoute("/news/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: `${BRAND.url}/news` },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: `${BRAND.url}/news` }],
  }),
  loader: async () => {
    const studio = await listStudioPosts().catch(() => []);
    return { posts: mergeNews(studio) };
  },
  component: NewsPage,
});

function NewsPage() {
  const { posts } = Route.useLoaderData();
  const [category, setCategory] = useState("All");
  const categories = ["All", ...Array.from(new Set(posts.map((p) => p.category)))];
  const filtered = posts.filter((p) => category === "All" || p.category === category);
  const [featured, ...rest] = filtered;

  return (
    <FamilyPage>
      <section className="ndh-news-hero">
        <div className="nx-wrap">
          <p className="nx-kicker">
            <Megaphone size={14} aria-hidden="true" /> The NDH newsroom
          </p>
          <h1>Official announcements.</h1>
          <p>
            Product releases, platform updates and company notices — published by the NDH team, in
            public, with dates.
          </p>
        </div>
      </section>

      <section className="nx-section ndh-porcelain">
        <div className="nx-wrap">
          <div className="ndh-tabs" role="group" aria-label="Filter announcements">
            {categories.map((c) => (
              <button
                key={c}
                type="button"
                aria-pressed={category === c}
                className={category === c ? "is-active" : undefined}
                onClick={() => setCategory(c)}
              >
                {c}
                <span>
                  {c === "All" ? posts.length : posts.filter((p) => p.category === c).length}
                </span>
              </button>
            ))}
          </div>

          {featured ? (
            <Link to="/news/$slug" params={{ slug: featured.slug }} className="ndh-news-feature">
              <div className="ndh-news-feature-media">
                {featured.cover ? (
                  <img
                    src={featured.cover}
                    alt={featured.coverAlt ?? ""}
                    width={960}
                    height={600}
                    loading="eager"
                    fetchPriority="high"
                    decoding="sync"
                  />
                ) : (
                  <span className="ndh-news-fallback" aria-hidden="true" />
                )}
                <span className="ndh-news-badge is-solid">{featured.badge}</span>
              </div>
              <div className="ndh-news-feature-body">
                <span className="ndh-news-meta">
                  <span>{featured.category}</span>
                  <time dateTime={featured.publishedAt}>
                    <CalendarDays size={13} aria-hidden="true" />
                    {formatNewsDate(featured.publishedAt)}
                  </time>
                </span>
                <h2>{featured.title}</h2>
                <p>{featured.excerpt}</p>
                <span className="ndh-news-more">
                  Read the announcement <ArrowRight size={15} aria-hidden="true" />
                </span>
              </div>
            </Link>
          ) : (
            <p className="ndh-empty">No announcements in this category yet.</p>
          )}

          {rest.length > 0 ? (
            <div className="ndh-news-grid">
              {rest.map((post) => (
                <Link
                  key={post.slug}
                  to="/news/$slug"
                  params={{ slug: post.slug }}
                  className="ndh-news-card"
                >
                  <span className="ndh-news-meta">
                    <span className="ndh-news-badge">{post.badge}</span>
                    <time dateTime={post.publishedAt}>{formatNewsDate(post.publishedAt)}</time>
                  </span>
                  <h3>{post.title}</h3>
                  <p>{post.excerpt}</p>
                  <span className="ndh-news-more">
                    Read announcement <ArrowRight size={14} aria-hidden="true" />
                  </span>
                </Link>
              ))}
            </div>
          ) : null}
        </div>
      </section>
    </FamilyPage>
  );
}
