import { createFileRoute } from "@tanstack/react-router";
import { FamilyPage, FamilyIntro } from "@/components/ecosystem/FamilyPage";
import { FamilyPrivacy } from "@/components/ecosystem/FamilyLegal";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy notice — Najeeb Digital Hub" },
      {
        name: "description",
        content:
          "What you share, why it is used and how to ask questions about your personal information.",
      },
    ],
    links: [{ rel: "canonical", href: "https://ndh.com.ng/privacy" }],
  }),
  component: () => (
    <FamilyPage>
      <FamilyIntro
        eyebrow="Privacy notice"
        title="Your information, handled with purpose."
        body="What you share, why it is used and how to ask questions about your personal information."
      />
      <section className="family-band is-white">
        <article className="family-wrap family-legal family-card">
          <FamilyPrivacy />
        </article>
      </section>
    </FamilyPage>
  ),
});
