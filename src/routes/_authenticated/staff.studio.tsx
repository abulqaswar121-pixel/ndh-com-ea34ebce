import { createFileRoute } from "@tanstack/react-router";
import { StudioApp } from "@/components/studio/StudioApp";
import { StudioGuard } from "@/components/studio/StudioGuard";

/** Staff studio at /staff/studio — the same workspace, staff framing. */
export const Route = createFileRoute("/_authenticated/staff/studio")({
  head: () => ({
    meta: [
      { title: "AI Content Studio | NDH Staff" },
      {
        name: "description",
        content:
          "Create NDH marketing posts, flyers, infographics, captions and short motion clips in seconds.",
      },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Content Studio | NDH Staff" },
      { property: "og:description", content: "The private NDH staff content workspace." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: () => (
    <StudioGuard>
      <StudioApp scope="staff" />
    </StudioGuard>
  ),
});
