import { createFileRoute } from "@tanstack/react-router";
import { FamilyPage, FamilyIntro } from "@/components/ecosystem/FamilyPage";
import { FamilyTerms } from "@/components/ecosystem/FamilyLegal";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms of service — Najeeb Digital Hub" },
      {
        name: "description",
        content:
          "A clear starting point for using the NDH website and finding your way around the family.",
      },
    ],
    links: [{ rel: "canonical", href: "https://ndh.com.ng/terms" }],
  }),
  component: () => (
    <FamilyPage>
      <FamilyIntro
        eyebrow="Terms of service"
        title="Terms of service"
        body="A clear starting point for using the NDH website and finding your way around the family."
      />
      <section className="family-band is-white">
        <article className="family-wrap family-legal family-card">
          <FamilyTerms />
        </article>
      </section>
    </FamilyPage>
  ),
});
