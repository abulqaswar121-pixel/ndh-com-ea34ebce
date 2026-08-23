import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";

export const Route = createFileRoute("/agency")({
  head: () => ({
    meta: [
      { title: "Agency — Najeeb Digital Hub" },
      { name: "description", content: "Agency services at Najeeb Digital Hub." },
      { property: "og:title", content: "Agency — Najeeb Digital Hub" },
      { property: "og:description", content: "Agency services at Najeeb Digital Hub." },
    ],
  }),
  component: () => <PageShell title="Agency" />,
});
