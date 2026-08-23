import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Najeeb Digital Hub" },
      { name: "description", content: "Najeeb Digital Hub — agency services and academy." },
      { property: "og:title", content: "Najeeb Digital Hub" },
      { property: "og:description", content: "Najeeb Digital Hub — agency services and academy." },
    ],
  }),
  component: () => <PageShell title="Homepage" />,
});
