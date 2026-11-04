import { createFileRoute } from "@tanstack/react-router";
import { StudioApp } from "@/components/studio/StudioApp";
import { StudioGuard } from "@/components/studio/StudioGuard";

/**
 * Admin studio at /admin/studio.
 *
 * Internal tool: nothing on the public site links here. StudioGuard sends
 * signed-out visitors to the hidden entrance at /admin/login, and refuses
 * accounts without an admin, PM or talent role. Newsroom publishing is admin
 * only, enforced in the UI and by the database policy on `posts`.
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
  component: () => (
    <StudioGuard>
      <StudioApp scope="admin" />
    </StudioGuard>
  ),
});
