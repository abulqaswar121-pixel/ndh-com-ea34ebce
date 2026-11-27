import { useEffect, useMemo, useRef, useState } from "react";
import {
  Copy,
  Download,
  Film,
  ImagePlus,
  Loader2,
  Music2,
  Pause,
  Play,
  RotateCcw,
  Save,
  TriangleAlert,
  Volume2,
  VolumeX,
} from "lucide-react";
import {
  MOTION_KIND_LABEL,
  canExportVideo,
  exportMotion,
  playMotion,
  renderMotionPoster,
  type MotionKind,
  type MotionSpec,
} from "@/lib/studio/video";
import { MUSIC_LABEL, startMotionAudio, type MotionMusicTrack } from "@/lib/studio/motion-audio";
import { motionDefaults } from "@/lib/studio/motion-defaults";
import { copyText } from "@/lib/clipboard";
import { archiveId, downloadBlob, filenameFor, saveArchiveItem } from "@/lib/studio/archive";
import { useStudio } from "./studio-context";

const KINDS: MotionKind[] = ["holiday", "countdown", "reveal", "launch"];
const MUSIC: MotionMusicTrack[] = ["none", "uplift", "bright", "assured", "steady", "organic", "custom"];

/** Editable photo, text and music promos exported as WhatsApp-ready MP4. */
export function MotionPanel() {
  const { brand, campaign, holiday, goal, notify, bumpArchive } = useStudio();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const handleRef = useRef<{ stop: () => void } | null>(null);
  const audioRef = useRef<{ stop: () => void } | null>(null);
  const photoRef = useRef<string>("");
  const customAudioRef = useRef<string | null>(null);
  const videoRef = useRef<{ blob: Blob; extension: string; url: string } | null>(null);

  const defaults = motionDefaults(brand.id);
  const [kind, setKind] = useState<MotionKind>(goal === "holiday" ? "holiday" : "launch");
  const [duration, setDuration] = useState(8);
  const [playing, setPlaying] = useState(true);
  const [soundPreview, setSoundPreview] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [video, setVideo] = useState<{ blob: Blob; extension: string; url: string } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  const [headline, setHeadline] = useState(campaign.headline);
  const [subhead, setSubhead] = useState(campaign.subhead);
  const [badge, setBadge] = useState(campaign.badge);
  const [offer, setOffer] = useState(campaign.offerLine ?? campaign.bullets[0] ?? "");
  const [cta, setCta] = useState(campaign.cta);
  const [bullets, setBullets] = useState<string[]>([0, 1, 2].map((index) => campaign.bullets[index] ?? ""));
  const [postCaption, setPostCaption] = useState(campaign.captions[0]?.body ?? "");
  const [photoUrl, setPhotoUrl] = useState<string | null>(defaults.photoUrl);
  const [photoName, setPhotoName] = useState(`${brand.shortName} photo`);
  const [music, setMusic] = useState<MotionMusicTrack>(defaults.music);
  const [customAudioUrl, setCustomAudioUrl] = useState<string | null>(null);
  const [audioName, setAudioName] = useState("");
  const [volume, setVolume] = useState(0.55);

  videoRef.current = video;
  photoRef.current = photoUrl ?? "";
  customAudioRef.current = customAudioUrl;
  const exportSupported = useMemo(() => canExportVideo(), []);

  useEffect(() => {
    setHeadline(campaign.headline);
    setSubhead(campaign.subhead);
    setBadge(campaign.badge);
    setOffer(campaign.offerLine ?? campaign.bullets[0] ?? "");
    setCta(campaign.cta);
    setBullets([0, 1, 2].map((index) => campaign.bullets[index] ?? ""));
    setPostCaption(campaign.captions[0]?.body ?? "");
  }, [campaign]);

  useEffect(() => {
    const next = motionDefaults(brand.id);
    if (photoRef.current.startsWith("blob:")) URL.revokeObjectURL(photoRef.current);
    setPhotoUrl(next.photoUrl);
    setPhotoName(`${brand.shortName} photo`);
    setMusic(next.music);
    setSoundPreview(false);
  }, [brand.id, brand.shortName]);

  useEffect(() => () => {
    if (photoRef.current.startsWith("blob:")) URL.revokeObjectURL(photoRef.current);
    if (customAudioRef.current) URL.revokeObjectURL(customAudioRef.current);
    if (videoRef.current) URL.revokeObjectURL(videoRef.current.url);
    audioRef.current?.stop();
  }, []);

  const spec: MotionSpec = useMemo(
    () => ({
      brand,
      kind,
      duration,
      headline,
      subhead,
      bullets: bullets.filter((item) => item.trim()),
      cta,
      badge,
      offer,
      holiday,
      photoUrl,
      music: { track: music, volume, customUrl: customAudioUrl },
    }),
    [brand, kind, duration, headline, subhead, bullets, cta, badge, offer, holiday, photoUrl, music, volume, customAudioUrl],
  );
  const specKey = useMemo(() => JSON.stringify(spec), [spec]);

  useEffect(() => {
    setVideo((previous) => {
      if (previous) URL.revokeObjectURL(previous.url);
      return null;
    });
    setError(null);
  }, [specKey]);

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
        if (!cancelled) setError(playError instanceof Error ? playError.message : "Preview unavailable.");
      });
    return () => {
      cancelled = true;
      handleRef.current?.stop();
      handleRef.current = null;
    };
    // The serialized spec also captures every editable canvas value.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [specKey, playing]);

  useEffect(() => {
    audioRef.current?.stop();
    audioRef.current = null;
    if (!soundPreview || !playing || music === "none") return;
    let cancelled = false;
    void startMotionAudio(spec.music, duration, false)
      .then((handle) => {
        if (cancelled) handle.stop();
        else audioRef.current = handle;
      })
      .catch((audioError: unknown) => {
        if (!cancelled) {
          setSoundPreview(false);
          setError(audioError instanceof Error ? audioError.message : "Sound preview unavailable.");
        }
      });
    return () => {
      cancelled = true;
      audioRef.current?.stop();
      audioRef.current = null;
    };
  }, [soundPreview, playing, music, customAudioUrl, volume, duration, spec.music]);

  function choosePhoto(file: File | undefined) {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("Choose a JPG, PNG or WebP image.");
      return;
    }
    if (file.size > 12 * 1024 * 1024) {
      setError("Keep the photo under 12 MB.");
      return;
    }
    if (photoRef.current.startsWith("blob:")) URL.revokeObjectURL(photoRef.current);
    setPhotoUrl(URL.createObjectURL(file));
    setPhotoName(file.name);
    setError(null);
  }

  function chooseAudio(file: File | undefined) {
    if (!file) return;
    if (!file.type.startsWith("audio/") && !/\.(mp3|m4a|aac|wav|ogg)$/i.test(file.name)) {
      setError("Choose an MP3, M4A, WAV or OGG audio file.");
      return;
    }
    if (file.size > 25 * 1024 * 1024) {
      setError("Keep the music file under 25 MB.");
      return;
    }
    if (customAudioRef.current) URL.revokeObjectURL(customAudioRef.current);
    const url = URL.createObjectURL(file);
    setCustomAudioUrl(url);
    setAudioName(file.name);
    setMusic("custom");
    setError(null);
  }

  function resetPhoto() {
    if (photoRef.current.startsWith("blob:")) URL.revokeObjectURL(photoRef.current);
    setPhotoUrl(motionDefaults(brand.id).photoUrl);
    setPhotoName(`${brand.shortName} photo`);
  }

  async function handleExport() {
    if (exporting) return;
    setError(null);
    setExporting(true);
    setExportProgress(0);
    setSoundPreview(false);
    try {
      const recorderCanvas = document.createElement("canvas");
      const output = await exportMotion(recorderCanvas, spec, setExportProgress);
      setVideo((previous) => {
        if (previous) URL.revokeObjectURL(previous.url);
        return { ...output, url: URL.createObjectURL(output.blob) };
      });
      notify(`${duration}-second MP4 ready for WhatsApp`);
    } catch (exportError) {
      setError(exportError instanceof Error ? exportError.message : "MP4 export failed.");
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
      mime: "video/mp4",
      extension: "mp4",
      size: video.blob.size,
      thumb,
      caption: postCaption,
      meta: `${duration}s · MP4 · ${MUSIC_LABEL[music]}`,
      blob: video.blob,
    });
    bumpArchive();
    notify("MP4 saved to the archive");
  }

  return (
    <section className="studio-panel">
      <div className="studio-panel-head">
        <div>
          <p className="studio-eyebrow"><Film size={13} aria-hidden="true" /> Short video &amp; motion promos</p>
          <h2>Your words, photos and music — saved as MP4</h2>
          <p className="studio-panel-lead">Edit every important line, replace the business photo, add sound, then download a 1080×1920 video for WhatsApp, Reels, Status or TikTok.</p>
        </div>
      </div>

      <div className="studio-motion-layout">
        <div className="studio-flyer-preview">
          <div className="studio-canvas-wrap is-story">
            <canvas ref={canvasRef} aria-label="Motion card preview" />
            {exporting ? <span className="studio-canvas-busy"><Loader2 size={18} className="spin" /> Recording MP4 · {Math.round(exportProgress * 100)}%</span> : null}
          </div>
          <div className="studio-player">
            <button type="button" className="studio-btn is-icon" onClick={() => setPlaying((value) => !value)} aria-label={playing ? "Pause preview" : "Play preview"}>
              {playing ? <Pause size={16} /> : <Play size={16} />}
            </button>
            <button type="button" className={`studio-btn is-icon${soundPreview ? " is-primary" : ""}`} onClick={() => setSoundPreview((value) => !value)} disabled={music === "none"} aria-label={soundPreview ? "Mute preview" : "Preview music"}>
              {soundPreview ? <Volume2 size={16} /> : <VolumeX size={16} />}
            </button>
            <span className="studio-progress"><i style={{ width: `${Math.round(progress * 100)}%` }} /></span>
            <span className="studio-player-time">{duration}s loop</span>
          </div>
        </div>

        <div className="studio-flyer-controls">
          <div className="studio-field">
            <span>Motion style</span>
            <div className="studio-chips is-wrap">
              {KINDS.map((item) => <button key={item} type="button" className={kind === item ? "is-active" : undefined} aria-pressed={kind === item} onClick={() => setKind(item)}>{MOTION_KIND_LABEL[item]}</button>)}
            </div>
          </div>

          <label className="studio-field"><span>Duration · {duration} seconds</span><input type="range" min={5} max={15} step={1} value={duration} onChange={(event) => setDuration(Number(event.target.value))} /></label>

          <details className="studio-editor" open>
            <summary>Edit on-screen words</summary>
            <div className="studio-editor-body">
              <label className="studio-field"><span>Small top label</span><input value={badge} maxLength={36} onChange={(event) => setBadge(event.target.value)} /></label>
              <label className="studio-field"><span>Main headline</span><textarea rows={2} value={headline} maxLength={100} onChange={(event) => setHeadline(event.target.value)} /></label>
              <label className="studio-field"><span>Supporting line</span><textarea rows={3} value={subhead} maxLength={180} onChange={(event) => setSubhead(event.target.value)} /></label>
              <label className="studio-field"><span>Offer or key number</span><input value={offer} maxLength={80} onChange={(event) => setOffer(event.target.value)} /></label>
              <div className="studio-field"><span>Up to three reveal points</span>{bullets.map((bullet, index) => <input key={index} aria-label={`Reveal point ${index + 1}`} value={bullet} maxLength={90} placeholder={`Point ${index + 1}`} onChange={(event) => setBullets((current) => current.map((item, itemIndex) => itemIndex === index ? event.target.value : item))} />)}</div>
              <label className="studio-field"><span>Closing call to action</span><input value={cta} maxLength={70} onChange={(event) => setCta(event.target.value)} /></label>
            </div>
          </details>

          <details className="studio-editor" open>
            <summary>Photo &amp; music</summary>
            <div className="studio-editor-body">
              <div className="studio-field">
                <span>Background photo</span>
                <div className="studio-media-row">
                  {photoUrl ? <img src={photoUrl} alt="Selected motion background" /> : <span className="studio-media-empty"><ImagePlus size={20} /></span>}
                  <div><strong>{photoName}</strong><small>{photoUrl ? "Included in the video" : "No photo · brand background only"}</small></div>
                </div>
                <input type="file" accept="image/jpeg,image/png,image/webp" aria-label="Upload background photo" onChange={(event) => choosePhoto(event.target.files?.[0])} />
                <div className="studio-inline-actions">
                  <button type="button" className="studio-btn is-small" onClick={resetPhoto}><RotateCcw size={13} /> Business photo</button>
                  <button type="button" className="studio-btn is-small" onClick={() => { setPhotoUrl(null); setPhotoName("No photo"); }}>Remove photo</button>
                </div>
              </div>

              <label className="studio-field"><span>Music</span><select value={music} onChange={(event) => { setMusic(event.target.value as MotionMusicTrack); setSoundPreview(false); }}>{MUSIC.map((track) => <option key={track} value={track} disabled={track === "custom" && !customAudioUrl}>{MUSIC_LABEL[track]}</option>)}</select></label>
              <label className="studio-field"><span>Upload your own music</span><input type="file" accept="audio/*,.mp3,.m4a,.aac,.wav,.ogg" onChange={(event) => chooseAudio(event.target.files?.[0])} /></label>
              {audioName ? <p className="studio-file-name"><Music2 size={14} /> {audioName}</p> : null}
              <label className="studio-field"><span>Music volume · {Math.round(volume * 100)}%</span><input type="range" min={0} max={1} step={0.05} value={volume} disabled={music === "none"} onChange={(event) => setVolume(Number(event.target.value))} /></label>
              <p className="studio-hint">Built-in music is made in your browser and uses no AI credits. Use the speaker beside the preview to hear it.</p>
            </div>
          </details>

          <details className="studio-editor">
            <summary>Edit the caption for your post</summary>
            <div className="studio-editor-body">
              <label className="studio-field"><span>Post caption</span><textarea rows={7} value={postCaption} maxLength={2200} onChange={(event) => setPostCaption(event.target.value)} /></label>
              <button type="button" className="studio-btn is-small" onClick={async () => { const ok = await copyText(postCaption); notify(ok ? "Caption copied" : "Copy blocked by the browser", ok ? "success" : "error"); }}><Copy size={14} /> Copy caption</button>
            </div>
          </details>

          {!exportSupported ? <p className="studio-warning"><TriangleAlert size={15} aria-hidden="true" /> This browser cannot save MP4 directly. Open the studio in the latest Chrome, Edge or Safari. The editor and preview still work.</p> : null}
          {error ? <p className="studio-error" role="alert">{error}</p> : null}

          <div className="studio-actions">
            <button type="button" className="studio-btn is-primary" onClick={() => void handleExport()} disabled={exporting || !exportSupported}>
              {exporting ? <Loader2 size={15} className="spin" /> : <Film size={15} />}
              {exporting ? `Recording ${Math.round(exportProgress * 100)}%` : "Generate MP4"}
            </button>
            <button type="button" className="studio-btn" onClick={() => { if (video) { downloadBlob(video.blob, filenameFor(brand.name, `motion-${kind}`, "mp4")); notify("MP4 downloaded"); } }} disabled={!video}><Download size={15} /> Download MP4</button>
            <button type="button" className="studio-btn" onClick={() => void handleSave()} disabled={!video}><Save size={15} /> Save to archive</button>
          </div>
          {video ? <><video className="studio-video-result" src={video.url} controls playsInline /><p className="studio-file-name">MP4 · {(video.blob.size / 1024 / 1024).toFixed(1)} MB · Ready to upload</p></> : null}
        </div>
      </div>
    </section>
  );
}
