import { createFileRoute } from "@tanstack/react-router";
import { FamilyPage } from "@/components/ecosystem/FamilyPage";
import { WhyNdhBento } from "@/components/ecosystem/WhyNdhBento";
import { LiveStatusBar } from "@/components/ecosystem/LiveStatusBar";
import cover from "@/assets/covers/agency.jpg";

const title = "Our Approach | Najeeb Digital Hub";
const description = "How the NDH family works: one standard of trust, real people and businesses that grow together.";

export const Route = createFileRoute("/approach")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => (
    <FamilyPage>
      <section className="nx-cover">
        <img src={cover} alt="" width={1280} height={720} />
        <div className="nx-cover-shade" aria-hidden="true" />
        <div className="nx-wrap nx-cover-inner">
          <p className="nx-kicker">Our approach</p>
          <h1>How the NDH family works</h1>
          <p>{description}</p>
        </div>
      </section>
      <div className="gw-band gw-band-white"><WhyNdhBento /></div>
      <div className="gw-band gw-band-porcelain"><LiveStatusBar /></div>
    </FamilyPage>
  ),
});
