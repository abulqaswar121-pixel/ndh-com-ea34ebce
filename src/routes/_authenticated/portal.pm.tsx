import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";
import { RequireRole } from "@/components/RequireRole";

export const Route = createFileRoute("/_authenticated/portal/pm")({
  head: () => ({
    meta: [
      { title: "PM Portal — Najeeb Digital Hub" },
      { name: "description", content: "Project manager portal." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: () => (
    <RequireRole role="pm">
      <PageShell title="PM Portal" />
    </RequireRole>
  ),
});
