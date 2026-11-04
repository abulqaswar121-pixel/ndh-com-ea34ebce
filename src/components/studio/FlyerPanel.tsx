import { useEffect, useMemo, useRef, useState } from "react";
import {
  Copy,
  Download,
  ImageDown,
  Loader2,
  MessageCircle,
  RotateCcw,
  Save,
  Shapes,
} from "lucide-react";
import { copyImage, shareToWhatsApp } from "@/lib/clipboard";
import {
  FLYER_LAYOUT_LABEL,
  FLYER_SIZES,
  renderFlyer,
  type FlyerFormat,
  type FlyerLayout,
  type FlyerResult,
  type FlyerSpec,
} from "@/lib/studio/flyer";
import { archiveId, downloadBlob, filenameFor, saveArchiveItem } from "@/lib/studio/archive";
import { useStudio } from "./studio-context";

const LAYOUTS: FlyerLayout[] = ["promo", "infographic", "holiday", "launch"];
const FORMATS: FlyerFormat[] = ["square", "story"];

/** Flyer & infographic designer with a live, high-resolution canvas. */
export function FlyerPanel() {
  const { brand, campaign, holiday, goal, notify, bumpArchive } = useStudio();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [format, setFormat] = useState<FlyerFormat>("square");
  const [layout, setLayout] = useState<FlyerLayout>(goal === "holiday" ? "holiday" : "promo");
  const [headline, setHeadline] = useState<string | null>(null);
  const [subhead, setSubhead] = useState<string | null>(null);
  const [bullets, setBullets] = useState<string[] | null>(null);
  const [result, setResult] = useState<FlyerResult | null>(null);
  const [busy, setBusy] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Follow the brief's goal until the designer picks a layout by hand.
  useEffect(() => {
    setLayout(
      goal === "holiday"
        ? "holiday"
        : goal === "info"
          ? "infographic"
          : goal === "launch"
            ? "launch"
            : "promo",
    );
    setHeadline(null);
    setSubhead(null);
    setBullets(null);
  }, [goal, brand.id]);

  const spec: FlyerSpec = useMemo(
    () => ({
      brand,
      format,
      layout,
      headline: headline ?? campaign.headline,
      subhead: subhead ?? campaign.subhead,
      bullets: bullets ?? campaign.bullets,
      cta: campaign.cta,
      badge: campaign.badge,
      offer: campaign.offerLine,
      holiday,
    }),
    [brand, format, layout, headline, subhead, bullets, campaign, holiday],
  );

  const specKey = useMemo(() => JSON.stringify(spec), [spec]);

  useEffect(() => {
    let active = true;
    const canvas = canvasRef.current;
    if (!canvas) return;
    setBusy(true);
    setError(null);
    const timer = setTimeout(async () => {
      try {
        const rendered = await renderFlyer(canvas, spec);
        if (active) setResult(rendered);
      } catch (renderError) {
        if (active) {
          setError(
            renderError instanceof Error ? renderError.message : "Could not render this flyer.",
          );
        }
      } finally {
        if (active) setBusy(false);
      }
    }, 160);
    return () => {
      active = false;
      clearTimeout(timer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [specKey]);

  async function handleDownload() {
    if (!result) return;
    downloadBlob(result.blob, filenameFor(brand.name, `flyer-${format}`, "png"));
    notify("Flyer downloaded at full resolution");
  }

  async function handleSave() {
    if (!result) return;
    await saveArchiveItem({
      id: archiveId(),
      kind: "flyer",
      title: spec.headline,
      brandId: brand.id,
      brandName: brand.name,
      createdAt: Date.now(),
      mime: "image/png",
      extension: "png",
      size: result.blob.size,
      thumb: result.thumbnail,
      caption: campaign.captions[0]?.body,
      meta: `${FLYER_SIZES[format].label} · ${FLYER_LAYOUT_LABEL[layout]}`,
      blob: result.blob,
    });
    bumpArchive();
    notify("Saved to the media archive");
  }

  async function handleCopyImage() {
    if (!result) return;
    const ok = await copyImage(result.blob);
    notify(
      ok
        ? "Image copied — paste it into WhatsApp or a post"
        : "Copying images is blocked in this browser",
      ok ? "success" : "error",
    );
  }

  function handleShare() {
    const caption = campaign.captions[0]?.body ?? spec.headline;
    shareToWhatsApp(`${caption}\n\n${brand.url}`);
  }

  const editable = {
    headline: headline ?? campaign.headline,
    subhead: subhead ?? campaign.subhead,
    bullets: bullets ?? campaign.bullets,
  };

  return (
    <section className="studio-panel">
      <div className="studio-panel-head">
        <div>
          <p className="studio-eyebrow">
            <Shapes size={13} aria-hidden="true" /> Flyer &amp; infographic creator
          </p>
          <h2>Design at full resolution</h2>
          <p className="studio-panel-lead">
            The Open Gateway watermark, brand colours and public address are applied automatically.
          </p>
        </div>
        <button
          type="button"
          className="studio-btn is-quiet"
          onClick={() => {
            setHeadline(null);
            setSubhead(null);
            setBullets(null);
          }}
        >
          <RotateCcw size={14} /> Reset to campaign copy
        </button>
      </div>

      <div className="studio-flyer-layout">
        <div className="studio-flyer-preview">
          <div className={`studio-canvas-wrap is-${format}`}>
            <canvas ref={canvasRef} aria-label="Flyer preview" />
            {busy ? (
              <span className="studio-canvas-busy">
                <Loader2 size={18} className="spin" /> Rendering…
              </span>
            ) : null}
          </div>
          <p className="studio-canvas-meta">
            {FLYER_SIZES[format].width} × {FLYER_SIZES[format].height} px ·{" "}
            {FLYER_SIZES[format].use}
          </p>
        </div>

        <div className="studio-flyer-controls">
          <div className="studio-field">
            <span>Output format</span>
            <div className="studio-chips">
              {FORMATS.map((item) => (
                <button
                  key={item}
                  type="button"
                  className={format === item ? "is-active" : undefined}
                  aria-pressed={format === item}
                  onClick={() => setFormat(item)}
                >
                  {FLYER_SIZES[item].label}
                </button>
              ))}
            </div>
          </div>

          <div className="studio-field">
            <span>Layout style</span>
            <div className="studio-chips is-wrap">
              {LAYOUTS.map((item) => (
                <button
                  key={item}
                  type="button"
                  className={layout === item ? "is-active" : undefined}
                  aria-pressed={layout === item}
                  onClick={() => setLayout(item)}
                >
                  {FLYER_LAYOUT_LABEL[item]}
                </button>
              ))}
            </div>
          </div>

          <label className="studio-field">
            <span>Headline</span>
            <input
              value={editable.headline}
              maxLength={70}
              onChange={(event) => setHeadline(event.target.value)}
            />
          </label>

          <label className="studio-field">
            <span>Supporting line</span>
            <textarea
              value={editable.subhead}
              rows={2}
              maxLength={160}
              onChange={(event) => setSubhead(event.target.value)}
            />
          </label>

          <div className="studio-field">
            <span>Proof points</span>
            {editable.bullets.slice(0, 3).map((bullet, index) => (
              <input
                key={index}
                value={bullet}
                maxLength={90}
                onChange={(event) => {
                  const next = [...editable.bullets];
                  next[index] = event.target.value;
                  setBullets(next);
                }}
              />
            ))}
          </div>

          {error ? <p className="studio-error">{error}</p> : null}

          <div className="studio-actions">
            <button
              type="button"
              className="studio-btn is-primary"
              onClick={() => void handleDownload()}
              disabled={!result}
            >
              <Download size={15} /> Download PNG
            </button>
            <button
              type="button"
              className="studio-btn"
              onClick={() => void handleSave()}
              disabled={!result}
            >
              <Save size={15} /> Save to archive
            </button>
            <button
              type="button"
              className="studio-btn"
              onClick={() => void handleCopyImage()}
              disabled={!result}
            >
              <Copy size={15} /> Copy image
            </button>
            <button type="button" className="studio-btn is-whatsapp" onClick={handleShare}>
              <MessageCircle size={15} /> Share to WhatsApp
            </button>
          </div>

          <p className="studio-note is-inline">
            <ImageDown size={14} aria-hidden="true" />
            PNG downloads keep the full 1080-pixel width, so the text stays sharp on every platform.
          </p>
        </div>
      </div>
    </section>
  );
}
