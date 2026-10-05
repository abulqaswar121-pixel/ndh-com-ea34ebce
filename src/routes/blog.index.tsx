import { useState } from "react";
import { ArrowRight, ArrowUpRight, BookOpen } from "lucide-react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { FamilyPage, FamilyIntro, FamilyCta } from "@/components/ecosystem/FamilyPage";
import { listPosts } from "@/lib/catalog.functions";
import { FAMILY_ARTICLES, journalCover } from "@/lib/family-journal";

const title = "The NDH Journal — Ideas for your next step";
const description =
  "Practical notes from across the NDH family: learning, digital work, useful tools, school systems and the ideas that connect them.";
export const Route = createFileRoute("/blog/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
    ],
    links: [{ rel: "canonical", href: "https://ndh.com.ng/blog" }],
  }),
  loader: async () => {
    const posts = await listPosts().catch(() => []);
    return [
      ...FAMILY_ARTICLES.map(({ sections: _sections, ...article }) => article),
      ...posts
        .filter((post) => !FAMILY_ARTICLES.some((article) => article.slug === post.slug))
        .map((post) => ({ ...post, category: "Learning & digital work" })),
    ];
  },
  component: Blog,
});

function Blog() {
  const posts = Route.useLoaderData();
  const [category, setCategory] = useState("All notes");
  const [featured] = posts;
  const categories = ["All notes", ...new Set(posts.map((post) => post.category))];
  const filtered = posts.filter((post) => category === "All notes" || post.category === category);
  return (
    <FamilyPage>
      <FamilyIntro
        eyebrow="The NDH journal"
        title="Useful ideas for what comes next."
        body="Practical notes on learning, building, choosing tools and making everyday systems work better. Perspectives from across the family — without the unnecessary jargon."
      />
      <section className="family-band is-white">
        <div className="family-wrap">
          <Link to="/blog/$slug" params={{ slug: featured.slug }} className="family-feature">
            <div className="family-feature-image">
              <img
                src={featured.cover_image_url ?? "/images/ndh-hero-960.webp"}
                alt="A workspace for exploring digital ideas"
                width={960}
                height={640}
                fetchPriority="high"
              />
            </div>
            <div className="family-feature-copy">
              <p className="family-kicker">Start here · The NDH family</p>
              <h2>{featured.title}</h2>
              <p>{featured.excerpt}</p>
              <span className="family-small">{featured.author_name} · A practical guide</span>
              <span className="family-text-link">
                Read the story <ArrowUpRight size={19} />
              </span>
            </div>
          </Link>
        </div>
      </section>
      <section className="family-band" id="articles">
        <div className="family-wrap">
          <div className="family-section-heading">
            <div>
              <p className="family-kicker">Explore the journal</p>
              <h2>A little clarity goes a long way.</h2>
            </div>
            <BookOpen size={29} aria-hidden="true" />
          </div>
          <div
            className="family-journal-filters"
            role="group"
            aria-label="Filter articles by topic"
          >
            {categories.map((item) => (
              <button
                type="button"
                key={item}
                aria-pressed={category === item}
                onClick={() => setCategory(item)}
              >
                {item}
              </button>
            ))}
          </div>
          <p className="family-small" role="status">
            {filtered.length} {filtered.length === 1 ? "article" : "articles"}
            {category !== "All notes" ? ` in ${category}` : " across the family"}
          </p>
          <div className="family-journal-grid">
            {filtered.map((post) => (
              <Link
                to="/blog/$slug"
                params={{ slug: post.slug }}
                className="family-card family-post"
                key={post.slug}
              >
                <img
                  src={journalCover(post.slug, post.cover_image_url)}
                  onError={(event) => {
                    event.currentTarget.onerror = null;
                    event.currentTarget.src = "/images/ndh-hero-960.webp";
                  }}
                  alt=""
                  width={960}
                  height={640}
                  loading="lazy"
                  decoding="async"
                />
                <div className="family-post-copy">
                  <p className="family-kicker">{post.category}</p>
                  <h3>{post.title}</h3>
                  <p>{post.excerpt}</p>
                  <span className="family-small">{post.author_name ?? "NDH Editorial"}</span>
                  <span className="family-text-link">
                    Read article <ArrowRight size={16} />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <FamilyCta />
    </FamilyPage>
  );
}
