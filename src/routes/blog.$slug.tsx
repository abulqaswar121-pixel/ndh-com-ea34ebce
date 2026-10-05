import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { FamilyPage, FamilyIntro, FamilyCta } from "@/components/ecosystem/FamilyPage";
import { getPost } from "@/lib/catalog.functions";
import { familyArticle, FAMILY_ARTICLES, journalCover } from "@/lib/family-journal";

export const Route = createFileRoute("/blog/$slug")({
  loader: async ({ params }) => {
    const post = familyArticle(params.slug) ?? (await getPost({ data: { slug: params.slug } }));
    if (!post) throw notFound();
    return post;
  },
  head: ({ loaderData }) => {
    if (!loaderData)
      return {
        meta: [{ title: "Article unavailable — NDH" }, { name: "robots", content: "noindex" }],
      };
    const title = `${loaderData.title} — NDH Journal`;
    const description = loaderData.excerpt ?? "A practical guide from the NDH family.";
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "article" },
      ],
      links: [{ rel: "canonical", href: `https://ndh.com.ng/blog/${loaderData.slug}` }],
    };
  },
  errorComponent: () => <ArticleUnavailable />,
  notFoundComponent: () => <ArticleUnavailable notFound />,
  component: Post,
});

function ArticleUnavailable({ notFound = false }: { notFound?: boolean }) {
  return (
    <FamilyPage>
      <FamilyIntro
        eyebrow="NDH journal"
        title={
          notFound ? "We couldn’t find that article." : "This article is unavailable right now."
        }
        body="Explore another note from across the NDH family."
      >
        <Link className="gw-button gw-button-primary" to="/blog">
          Back to the journal <ArrowLeft size={17} />
        </Link>
      </FamilyIntro>
    </FamilyPage>
  );
}

function Post() {
  const post = Route.useLoaderData();
  const editorial = FAMILY_ARTICLES.find((article) => article.slug === post.slug);
  const image = journalCover(post.slug, post.cover_image_url);
  return (
    <FamilyPage>
      <FamilyIntro
        eyebrow={editorial?.category ?? "Learning & digital work"}
        title={post.title}
        body={post.excerpt ?? "A note from the NDH family."}
      >
        <p className="family-article-byline">
          {post.author_name ?? "NDH Editorial"}
          {post.published_at
            ? ` · ${new Date(post.published_at).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" })}`
            : " · A practical guide"}
        </p>
      </FamilyIntro>
      <section className="family-band is-white">
        <div className="family-wrap family-article-layout">
          <article className="family-article">
            <Link className="family-text-link" to="/blog">
              <ArrowLeft size={16} /> Back to the journal
            </Link>
            {image && (
              <img
                className="family-article-cover"
                src={image}
                onError={(event) => {
                  event.currentTarget.onerror = null;
                  event.currentTarget.src = "/images/ndh-hero-960.webp";
                }}
                alt=""
                width={960}
                height={640}
                fetchPriority="high"
              />
            )}
            {editorial
              ? editorial.sections.map((section, index) => (
                  <section key={section.heading} id={`section-${index + 1}`}>
                    <h2>{section.heading}</h2>
                    <p>{section.body}</p>
                  </section>
                ))
              : (post.body ?? "")
                  .split("\n")
                  .filter((line) => line.trim())
                  .map((line, index) => <p key={index}>{line}</p>)}
          </article>
          <aside className="family-article-aside family-card">
            {editorial && (
              <nav aria-label="In this article">
                <p className="family-kicker">In this article</p>
                {editorial.sections.map((section, index) => (
                  <a key={section.heading} href={`#section-${index + 1}`}>
                    {section.heading}
                  </a>
                ))}
              </nav>
            )}
            <h2>Keep exploring</h2>
            <p>Find the people, platforms and learning opportunities behind the ideas.</p>
            <a className="family-text-link" href="/#businesses">
              Meet the NDH family <ArrowUpRight size={16} />
            </a>
            <div className="family-related">
              <p className="family-kicker">Another useful read</p>
              {FAMILY_ARTICLES.filter((article) => article.slug !== post.slug)
                .slice(0, 2)
                .map((article) => (
                  <Link key={article.slug} to="/blog/$slug" params={{ slug: article.slug }}>
                    {article.title}
                    <ArrowUpRight size={14} />
                  </Link>
                ))}
            </div>
          </aside>
        </div>
      </section>
      <FamilyCta />
    </FamilyPage>
  );
}
