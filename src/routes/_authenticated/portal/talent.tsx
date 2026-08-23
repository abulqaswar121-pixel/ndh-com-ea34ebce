import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";
import { RequireRole } from "@/components/RequireRole";

export const Route = createFileRoute("/_authenticated/portal/talent")({
  head: () => ({
    meta: [
      { title: "Talent Portal — Najeeb Digital Hub" },
      { name: "description", content: "Talent portal." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: () => (
    <RequireRole role="talent">
      <PageShell title="Talent Portal" />
    </RequireRole>
  ),
});
