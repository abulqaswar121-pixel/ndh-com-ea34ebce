import { createFileRoute } from "@tanstack/react-router";
import { StudioApp } from "@/components/studio/StudioApp";

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
    ],
  }),
  component: () => <StudioApp scope="staff" />,
});
