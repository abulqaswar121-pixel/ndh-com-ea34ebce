import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";

export const Route = createFileRoute("/academy")({
  head: () => ({
    meta: [
      { title: "Academy — Najeeb Digital Hub" },
      { name: "description", content: "The Najeeb Digital Hub academy." },
      { property: "og:title", content: "Academy — Najeeb Digital Hub" },
      { property: "og:description", content: "The Najeeb Digital Hub academy." },
    ],
  }),
  component: () => <PageShell title="Academy" />,
});
