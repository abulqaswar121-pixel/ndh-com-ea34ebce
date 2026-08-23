import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";
import { RequireRole } from "@/components/RequireRole";

export const Route = createFileRoute("/_authenticated/portal/student")({
  head: () => ({
    meta: [
      { title: "Student Portal — Najeeb Digital Hub" },
      { name: "description", content: "Student portal." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: () => (
    <RequireRole role="student">
      <PageShell title="Student Portal" />
    </RequireRole>
  ),
});
