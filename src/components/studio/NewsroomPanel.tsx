import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ExternalLink, Loader2, Megaphone, ShieldAlert, UploadCloud } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { NEWSROOM_AUTHOR } from "@/lib/news";
import { useStudio } from "./studio-context";

const COVERS = [
  { label: "Open Gateway (hub)", value: "/images/ndh-hero-960.webp" },
  { label: "Academy", value: "/images/ndh-academy-960.webp" },
  { label: "Agency / studio", value: "/images/ndh-agency-work-960.webp" },
];

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 70);
}

/**
 * Publish an announcement straight from the studio.
 *
 * Announcements are stored in the site's `posts` table under the NDH Newsroom
 * author, which is exactly what /news reads. Publishing requires an admin
 * account — the preview mode explains that instead of pretending to save.
 */
export function NewsroomPanel() {
  const { campaign, brand, brandId, notify } = useStudio();
  const { roles } = useAuth();
  const canPublish = roles.includes("admin");

  const [title, setTitle] = useState(campaign.headline);
  const [excerpt, setExcerpt] = useState(campaign.subhead);
  const [body, setBody] = useState("");
  const [cover, setCover] = useState(COVERS[0].value);
  const [publishing, setPublishing] = useState(false);
  const [published, setPublished] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Keep the draft in step with the brief until the admin edits it.
  useEffect(() => {
    setTitle(campaign.headline);
    setExcerpt(campaign.subhead);
    setBody(
      [
        campaign.summary,
        "",
        ...campaign.bullets.map((bullet) => `- ${bullet}`),
        "",
        `Read more about ${brand.name}: ${brand.url}`,
      ].join("\n"),
    );
  }, [campaign, brand.name, brand.url]);

  async function publish() {
    if (!canPublish) return;
    setPublishing(true);
    setError(null);
    setPublished(null);
    const baseSlug = slugify(title) || `ndh-update-${Date.now()}`;
    const payload = {
      slug: `${baseSlug}-${Date.now().toString(36).slice(-4)}`,
      title: title.trim(),
      excerpt: excerpt.trim(),
      body: body.trim(),
      cover_image_url: cover,
      author_name: NEWSROOM_AUTHOR,
      is_published: true,
      published_at: new Date().toISOString(),
    };
    try {
      const { error: insertError } = await supabase.from("posts").insert(payload);
      if (insertError) throw new Error(insertError.message);
      setPublished(payload.slug);
      notify("Announcement published to /news");
    } catch (publishError) {
      const message =
        publishError instanceof Error ? publishError.message : "Publishing failed. Try again.";
      setError(message);
      notify(message, "error");
    } finally {
      setPublishing(false);
    }
  }

  return (
    <section className="studio-panel">
      <div className="studio-panel-head">
        <div>
          <p className="studio-eyebrow">
            <Megaphone size={13} aria-hidden="true" /> Newsroom publishing
          </p>
          <h2>Send this campaign to the public feed</h2>
          <p className="studio-panel-lead">
            Published announcements appear immediately on <Link to="/news">/news</Link> with the
            date, badge and cover you choose here.
          </p>
        </div>
        {published ? (
          <Link to="/news" className="studio-btn is-quiet">
            View on /news <ExternalLink size={14} />
          </Link>
        ) : null}
      </div>

      {!canPublish ? (
        <div className="studio-warning">
          <ShieldAlert size={16} aria-hidden="true" />
          <p>
            Publishing needs an admin account. You can still draft everything here and copy it —
            sign in as an NDH admin to publish to the public newsroom.
          </p>
        </div>
      ) : null}

      <div className="studio-newsroom">
        <label className="studio-field">
          <span>Headline</span>
          <input value={title} maxLength={120} onChange={(event) => setTitle(event.target.value)} />
        </label>
        <label className="studio-field">
          <span>Summary (shown on the feed card)</span>
          <textarea
            value={excerpt}
            rows={2}
            maxLength={220}
            onChange={(event) => setExcerpt(event.target.value)}
          />
        </label>
        <label className="studio-field">
          <span>Body — “## ” starts a heading, “- ” starts a bullet</span>
          <textarea
            value={body}
            rows={8}
            maxLength={6000}
            onChange={(event) => setBody(event.target.value)}
          />
        </label>
        <label className="studio-field">
          <span>Cover image</span>
          <select value={cover} onChange={(event) => setCover(event.target.value)}>
            {COVERS.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
        </label>

        <p className="studio-hint">
          Publishing as {brand.name} ({brandId}). Author tag: {NEWSROOM_AUTHOR}.
        </p>

        {error ? <p className="studio-error">{error}</p> : null}

        <div className="studio-actions">
          <button
            type="button"
            className="studio-btn is-primary"
            onClick={() => void publish()}
            disabled={!canPublish || publishing || !title.trim()}
          >
            {publishing ? <Loader2 size={15} className="spin" /> : <UploadCloud size={15} />}
            {publishing ? "Publishing…" : "Publish announcement"}
          </button>
          {published ? <span className="studio-hint">Published as /news/{published}</span> : null}
        </div>
      </div>
    </section>
  );
}
