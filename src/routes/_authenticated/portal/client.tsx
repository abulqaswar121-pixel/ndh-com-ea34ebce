import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";
import { RequireRole } from "@/components/RequireRole";

export const Route = createFileRoute("/_authenticated/portal/client")({
  head: () => ({
    meta: [
      { title: "Client Portal — Najeeb Digital Hub" },
      { name: "description", content: "Client portal." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: () => (
    <RequireRole role="client">
      <PageShell title="Client Portal" />
    </RequireRole>
  ),
});
