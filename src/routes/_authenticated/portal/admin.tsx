import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";
import { RequireRole } from "@/components/RequireRole";

export const Route = createFileRoute("/_authenticated/portal/admin")({
  head: () => ({
    meta: [
      { title: "Admin Portal — Najeeb Digital Hub" },
      { name: "description", content: "Admin portal." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: () => (
    <RequireRole role="admin">
      <PageShell title="Admin Portal" />
    </RequireRole>
  ),
});
