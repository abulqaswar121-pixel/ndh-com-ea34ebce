import { createFileRoute } from "@tanstack/react-router";
import { ArrowUpRight, Compass, Layers3, MapPin, Sprout } from "lucide-react";
import { FamilyPage, FamilyIntro, FamilyCta } from "@/components/ecosystem/FamilyPage";
import { NdhFamilySymbol } from "@/components/NdhFamilySymbol";
import { ACADEMY_SCHOOLS, ACADEMY_SNAPSHOT } from "@/lib/business-profiles";
import { SUBSIDIARIES, subsidiaryHref } from "@/lib/ecosystem";
import { SITE_CONTACT } from "@/lib/site-contact";
import { useI18n } from "@/lib/preferences";

const title = "About NDH — One family. Many possibilities.";
const description =
  "Meet Najeeb Digital Hub: a family of businesses rooted in Sokoto, Nigeria, connecting digital work, practical learning, commerce and useful platforms.";
export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "https://ndh.com.ng/about" }],
  }),
  component: About,
});

function About() {
  const { t } = useI18n();
  return (
    <FamilyPage>
      <FamilyIntro
        eyebrow="About the NDH family"
        title="Different doors. One shared purpose."
        body="Najeeb Digital Hub brings together businesses that help people learn, build, trade and participate in cooperative farming. Each has its own focus. Together, they open more ways forward."
      >
        <a className="gw-button gw-button-primary" href="#our-family">
          Meet the family <ArrowUpRight size={17} />
        </a>
      </FamilyIntro>
      <section className="family-band is-white">
        <div className="family-wrap family-story-grid">
          <div>
            <p className="family-kicker">The idea behind NDH</p>
            <h2>
              Progress rarely fits
              <br />
              into one category.
            </h2>
          </div>
          <div className="family-story-copy">
            <p>
              A learner may become a founder. A growing business may need a digital product. A
              school may need a simpler way to manage its day. Those needs are connected, even when
              the services behind them are different.
            </p>
            <p>
              NDH is the home that brings those possibilities together. This website is your
              starting point: discover the businesses, understand what each one does, and choose the
              door that fits your next step.
            </p>
            <p>
              We are not one service with several names. We are a family of focused businesses,
              connected by a commitment to useful technology, practical learning and clear
              communication.
            </p>
          </div>
        </div>
      </section>
      <section className="family-band" id="our-family">
        <div className="family-wrap">
          <div className="family-section-heading">
            <div>
              <p className="family-kicker">One connected ecosystem</p>
              <h2>A place for every next step.</h2>
            </div>
            <a className="family-text-link" href="/#businesses">
              Explore the directory <ArrowUpRight size={16} />
            </a>
          </div>
          <div className="family-business-grid">
            {SUBSIDIARIES.map((item) => (
              <article className="family-card family-business" key={item.id}>
                <div className="family-card-top">
                  <NdhFamilySymbol SectorIcon={item.icon} />
                  <span className={`family-status ${item.state === "coming" ? "is-coming" : ""}`}>
                    {item.state === "coming" ? t("app.switcher.soon") : t("app.switcher.preview")}
                  </span>
                </div>
                <h3>{t(`eco.${item.id}.name` as never)}</h3>
                <p className="family-kicker">{t(`eco.${item.id}.category` as never)}</p>
                <p>
                  <strong>{t(`eco.${item.id}.tagline` as never)}</strong>
                </p>
                <p>{t(`eco.${item.id}.description` as never)}</p>
                {item.state !== "coming" ? (
                  <a className="family-text-link" href={subsidiaryHref(item)}>
                    Explore {t(`eco.${item.id}.name` as never)} <ArrowUpRight size={15} />
                  </a>
                ) : (
                  <span className="family-small">In the pipeline — not yet available.</span>
                )}
              </article>
            ))}
            <article className="family-card family-business family-location-card">
              <MapPin size={28} />
              <h3>Rooted in Sokoto.</h3>
              <p>
                Our home is in Nigeria. Our outlook is open: practical ideas that start with real
                people and everyday needs.
              </p>
              <address>{SITE_CONTACT.address}</address>
              <a
                href={SITE_CONTACT.map}
                className="family-text-link"
                target="_blank"
                rel="noopener noreferrer"
              >
                Find our location <ArrowUpRight size={15} />
              </a>
            </article>
          </div>
        </div>
      </section>
      <section className="family-band is-white">
        <div className="family-wrap">
          <p className="family-kicker">What connects us</p>
          <h2>Shared principles. Distinct businesses.</h2>
          <div className="family-values">
            {[
              {
                icon: Compass,
                title: "Start with the real need",
                body: "A useful solution begins with understanding the person, the task and the outcome — not with choosing a tool first.",
              },
              {
                icon: Layers3,
                title: "Keep the next step clear",
                body: "Every business should make its role understandable, so you know where to go and what to ask before making a commitment.",
              },
              {
                icon: Sprout,
                title: "Build for lasting use",
                body: "We value practical skills and systems people can keep using, improving and making their own as their needs grow.",
              },
            ].map(({ icon: Icon, title, body }) => (
              <article className="family-card" key={title}>
                <span className="family-icon">
                  <Icon size={23} />
                </span>
                <h3>{title}</h3>
                <p>{body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
      <section className="family-band" id="academy-schools">
        <div className="family-wrap">
          <p className="family-kicker">NDH Academy · Official learning scope</p>
          <h2>
            {ACADEMY_SNAPSHOT.courses} practical AI-skills courses. {ACADEMY_SNAPSHOT.schools}{" "}
            specialized schools.
          </h2>
          <p>
            Structured video lessons, pre-project readiness quizzes and capstone deliverables — with
            signed, cryptographically verifiable certificates.
          </p>
          <div className="family-values">
            {ACADEMY_SCHOOLS.map((school) => (
              <article key={school.name} className="family-card">
                <h3>{school.name}</h3>
                <p>{school.topics}</p>
              </article>
            ))}
          </div>
          <div className="official-profile-links">
            <a href="https://academy.ndh.com.ng" className="family-text-link">
              Explore the official Academy <ArrowUpRight size={16} />
            </a>
            <a href="/verify" className="family-text-link">
              Verify an Academy certificate <ArrowUpRight size={16} />
            </a>
          </div>
        </div>
      </section>
      <FamilyCta />
    </FamilyPage>
  );
}
