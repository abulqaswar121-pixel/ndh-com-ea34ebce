import { useEffect, useMemo, useRef, useState } from "react";
import { Download, Film, Loader2, Pause, Play, Save, TriangleAlert } from "lucide-react";
import {
  MOTION_KIND_LABEL,
  canExportVideo,
  exportMotion,
  playMotion,
  renderMotionPoster,
  type MotionKind,
  type MotionSpec,
} from "@/lib/studio/video";
import { archiveId, downloadBlob, filenameFor, saveArchiveItem } from "@/lib/studio/archive";
import { useStudio } from "./studio-context";

const KINDS: MotionKind[] = ["holiday", "countdown", "reveal", "launch"];

/** Short motion promos rendered on canvas and exported as a real video file. */
export function MotionPanel() {
  const { brand, campaign, holiday, goal, notify, bumpArchive } = useStudio();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const handleRef = useRef<{ stop: () => void } | null>(null);

  const [kind, setKind] = useState<MotionKind>(goal === "holiday" ? "holiday" : "launch");
  const [duration, setDuration] = useState(8);
  const [playing, setPlaying] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [video, setVideo] = useState<{ blob: Blob; extension: string; url: string } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  const exportSupported = useMemo(() => canExportVideo(), []);

  const spec: MotionSpec = useMemo(
    () => ({
      brand,
      kind,
      duration,
      headline: campaign.headline,
      subhead: campaign.subhead,
      bullets: campaign.bullets,
      cta: campaign.cta,
      badge: campaign.badge,
      offer: campaign.offerLine ?? campaign.bullets[0],
      holiday,
    }),
    [brand, kind, duration, campaign, holiday],
  );

  const specKey = useMemo(() => JSON.stringify(spec), [spec]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    let cancelled = false;

    if (!playing) {
      handleRef.current?.stop();
      handleRef.current = null;
      void renderMotionPoster(canvas, spec).catch(() => undefined);
      return;
    }

    void playMotion(canvas, spec, setProgress)
      .then((handle) => {
        if (cancelled) handle.stop();
        else handleRef.current = handle;
      })
      .catch((playError: unknown) => {
        if (!cancelled) {
          setError(playError instanceof Error ? playError.message : "Preview unavailable.");
        }
      });

    return () => {
      cancelled = true;
      handleRef.current?.stop();
      handleRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [specKey, playing]);

  async function handleExport() {
    if (exporting) return;
    setError(null);
    setExporting(true);
    setExportProgress(0);
    try {
      // Record on a separate canvas so the live preview keeps running cleanly
      // and its rAF loop can never interleave frames into the exported clip.
      const recorderCanvas = document.createElement("canvas");
      const output = await exportMotion(recorderCanvas, spec, setExportProgress);
      setVideo((previous) => {
        if (previous) URL.revokeObjectURL(previous.url);
        return { ...output, url: URL.createObjectURL(output.blob) };
      });
      notify(`${duration}-second motion card ready`);
    } catch (exportError) {
      setError(exportError instanceof Error ? exportError.message : "Export failed.");
    } finally {
      setExporting(false);
    }
  }

  async function handleSave() {
    if (!video) return;
    const canvas = canvasRef.current;
    const thumb = canvas ? canvas.toDataURL("image/jpeg", 0.7) : undefined;
    await saveArchiveItem({
      id: archiveId(),
      kind: "motion",
      title: spec.headline,
      brandId: brand.id,
      brandName: brand.name,
      createdAt: Date.now(),
      mime: video.blob.type || "video/webm",
      extension: video.extension,
      size: video.blob.size,
      thumb,
      caption: campaign.captions[0]?.body,
      meta: `${duration}s · ${MOTION_KIND_LABEL[kind]}`,
      blob: video.blob,
    });
    bumpArchive();
    notify("Motion card saved to the archive");
  }

  function handleDownload() {
    if (!video) return;
    downloadBlob(video.blob, filenameFor(brand.name, `motion-${kind}`, video.extension));
    notify("Motion clip downloaded");
  }

  return (
    <section className="studio-panel">
      <div className="studio-panel-head">
        <div>
          <p className="studio-eyebrow">
            <Film size={13} aria-hidden="true" /> Short video &amp; motion promos
          </p>
          <h2>Five to fifteen seconds, exported as video</h2>
          <p className="studio-panel-lead">
            Shimmering holiday cards, discount countdowns and feature reveals — recorded straight
            from the canvas at 1080×1920.
          </p>
        </div>
      </div>

      <div className="studio-motion-layout">
        <div className="studio-flyer-preview">
          <div className="studio-canvas-wrap is-story">
            <canvas ref={canvasRef} aria-label="Motion card preview" />
            {exporting ? (
              <span className="studio-canvas-busy">
                <Loader2 size={18} className="spin" /> Recording {Math.round(exportProgress * 100)}%
              </span>
            ) : null}
          </div>

          <div className="studio-player">
            <button
              type="button"
              className="studio-btn is-icon"
              onClick={() => setPlaying((value) => !value)}
              aria-label={playing ? "Pause preview" : "Play preview"}
            >
              {playing ? <Pause size={16} /> : <Play size={16} />}
            </button>
            <span className="studio-progress">
              <i style={{ width: `${Math.round(progress * 100)}%` }} />
            </span>
            <span className="studio-player-time">{duration}s loop</span>
          </div>
        </div>

        <div className="studio-flyer-controls">
          <div className="studio-field">
            <span>Motion style</span>
            <div className="studio-chips is-wrap">
              {KINDS.map((item) => (
                <button
                  key={item}
                  type="button"
                  className={kind === item ? "is-active" : undefined}
                  aria-pressed={kind === item}
                  onClick={() => setKind(item)}
                >
                  {MOTION_KIND_LABEL[item]}
                </button>
              ))}
            </div>
          </div>

          <label className="studio-field">
            <span>Duration · {duration} seconds</span>
            <input
              type="range"
              min={5}
              max={15}
              step={1}
              value={duration}
              onChange={(event) => setDuration(Number(event.target.value))}
            />
          </label>

          <div className="studio-kit-recap is-plain">
            <span className="studio-mini-badge">{spec.badge}</span>
            <strong>{spec.headline}</strong>
            <small>
              {spec.cta} · {brand.url.replace(/^https?:\/\//, "")}
            </small>
          </div>

          {!exportSupported ? (
            <p className="studio-warning">
              <TriangleAlert size={15} aria-hidden="true" /> This browser cannot record canvas
              video. The preview still works — open the studio in Chrome, Edge or Safari 15+ to
              download the clip.
            </p>
          ) : null}

          {error ? <p className="studio-error">{error}</p> : null}

          <div className="studio-actions">
            <button
              type="button"
              className="studio-btn is-primary"
              onClick={() => void handleExport()}
              disabled={exporting || !exportSupported}
            >
              {exporting ? <Loader2 size={15} className="spin" /> : <Film size={15} />}
              {exporting ? `Recording ${Math.round(exportProgress * 100)}%` : "Generate video"}
            </button>
            <button type="button" className="studio-btn" onClick={handleDownload} disabled={!video}>
              <Download size={15} /> Download clip
            </button>
            <button
              type="button"
              className="studio-btn"
              onClick={() => void handleSave()}
              disabled={!video}
            >
              <Save size={15} /> Save to archive
            </button>
          </div>

          {video ? (
            <video className="studio-video-result" src={video.url} controls playsInline />
          ) : null}
        </div>
      </div>
    </section>
  );
}
