import { useState } from "react";
import { Check, Copy, MessageCircle, Sparkles, Wand2 } from "lucide-react";
import { copyText, shareToWhatsApp } from "@/lib/clipboard";
import { buildShareText, type CaptionCard } from "@/lib/studio/copywriter";
import { useStudio } from "./studio-context";

const FORMAT_TONE: Record<CaptionCard["format"], string> = {
  short: "is-short",
  social: "is-social",
  linkedin: "is-linkedin",
};

/** Three ready-to-use caption formats, side by side, with one-click copy/share. */
export function CaptionPanel() {
  const { campaign, brand, holiday } = useStudio();
  const [copied, setCopied] = useState<string | null>(null);

  async function handleCopy(card: CaptionCard) {
    const ok = await copyText(buildShareText(card, brand));
    if (ok) {
      setCopied(card.format);
      setTimeout(() => setCopied(null), 2000);
    }
  }

  return (
    <section className="studio-panel">
      <div className="studio-panel-head">
        <div>
          <p className="studio-eyebrow">
            <Wand2 size={13} aria-hidden="true" /> Multi-platform captions
          </p>
          <h2>Three formats, ready to post</h2>
          <p className="studio-panel-lead">
            Generated for <strong>{brand.name}</strong>
            {holiday ? ` · ${holiday.name}` : ""} — every card already contains your link and
            hashtags.
          </p>
        </div>
        <div className="studio-kit-recap">
          <span className="studio-mini-badge">{campaign.badge}</span>
          <strong>{campaign.headline}</strong>
          <small>{campaign.subhead}</small>
        </div>
      </div>

      <div className="studio-caption-grid">
        {campaign.captions.map((card) => (
          <article key={card.format} className={`studio-caption ${FORMAT_TONE[card.format]}`}>
            <header>
              <div>
                <h3>{card.label}</h3>
                <p>{card.platforms}</p>
              </div>
              <span className="studio-count">{card.length} chars</span>
            </header>

            <pre className="studio-caption-body">{card.body}</pre>

            <footer>
              <button type="button" className="studio-btn" onClick={() => void handleCopy(card)}>
                {copied === card.format ? <Check size={15} /> : <Copy size={15} />}
                {copied === card.format ? "Copied" : "Copy caption"}
              </button>
              <button
                type="button"
                className="studio-btn is-whatsapp"
                onClick={() => shareToWhatsApp(buildShareText(card, brand))}
              >
                <MessageCircle size={15} /> Share to WhatsApp
              </button>
            </footer>
          </article>
        ))}
      </div>

      <div className="studio-note">
        <Sparkles size={15} aria-hidden="true" />
        <p>
          The WhatsApp button opens WhatsApp with the caption and your public link prepared. Attach
          the flyer from the next tab to complete the broadcast — the image is downloaded, never
          uploaded.
        </p>
      </div>
    </section>
  );
}
