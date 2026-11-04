/**
 * Public read of announcements published from the Studio's Newsroom tab.
 *
 * Announcements live in the site's existing `posts` table under the
 * "NDH Newsroom" author, so admins publish once and the item appears in
 * /news. The feed always falls back to the seeded catalogue in `news.ts`, so
 * a content-service outage never blanks the page.
 */
import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";
import { NEWSROOM_AUTHOR, blocksFromText, type NewsPost } from "./news";

export { NEWSROOM_AUTHOR };

type RuntimeEnvironment = Record<string, unknown>;

function readServerEnvironment(name: string): string | undefined {
  const processValue = typeof process !== "undefined" ? process.env[name] : undefined;
  if (processValue) return processValue;
  const runtimeEnvironment = (globalThis as typeof globalThis & { __env__?: RuntimeEnvironment })
    .__env__;
  const runtimeValue = runtimeEnvironment?.[name];
  return typeof runtimeValue === "string" && runtimeValue ? runtimeValue : undefined;
}

export const listStudioPosts = createServerFn({ method: "GET" }).handler(
  async (): Promise<NewsPost[]> => {
    try {
      const url = readServerEnvironment("SUPABASE_URL");
      const key = readServerEnvironment("SUPABASE_PUBLISHABLE_KEY");
      if (!url || !key) return [];
      const db = createClient<Database>(url, key, { auth: { persistSession: false } });
      const { data, error } = await db
        .from("posts")
        .select("slug,title,excerpt,body,cover_image_url,published_at")
        .eq("is_published", true)
        .eq("author_name", NEWSROOM_AUTHOR)
        .order("published_at", { ascending: false })
        .limit(30);
      if (error) {
        console.warn("Newsroom posts unavailable:", error.message);
        return [];
      }
      return (data ?? []).map((row) => ({
        slug: row.slug,
        title: row.title,
        excerpt: row.excerpt ?? "",
        category: "Company" as const,
        publishedAt: (row.published_at ?? new Date().toISOString()).slice(0, 10),
        badge: "Announcement",
        cover: row.cover_image_url ?? undefined,
        blocks: blocksFromText(row.body ?? ""),
        editorial: true,
      }));
    } catch (error) {
      console.warn(
        "Serving the seeded newsroom catalogue:",
        error instanceof Error ? error.message : error,
      );
      return [];
    }
  },
);
