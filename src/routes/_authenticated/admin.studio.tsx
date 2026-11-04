import { createFileRoute } from "@tanstack/react-router";
import { StudioApp } from "@/components/studio/StudioApp";

/**
 * Admin studio at /admin/studio.
 *
 * The page itself is available to signed-in users and to preview visitors (the
 * studio is a drafting tool with no private data). Publishing to the newsroom
 * is the one action that requires the admin role, and it is gated in the UI and
 * by the database policy on `posts`.
 */
export const Route = createFileRoute("/_authenticated/admin/studio")({
  head: () => ({
    meta: [
      { title: "AI Content Studio | NDH Admin" },
      {
        name: "description",
        content:
          "Create NDH marketing posts, flyers, infographics, captions and short motion clips in seconds.",
      },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: () => <StudioApp scope="admin" />,
});
