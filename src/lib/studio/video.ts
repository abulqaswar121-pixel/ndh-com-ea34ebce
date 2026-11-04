/**
 * Studio motion promo renderer.
 *
 * Frames are painted straight onto a 1080×1920 canvas on a requestAnimationFrame
 * loop (so the preview is real motion, not a GIF), and the same canvas is
 * recorded through `captureStream` + `MediaRecorder` to export an actual video
 * file the team can upload to Reels, Status or TikTok.
 */
import type { BrandKit } from "./kits";
import { BODY_FONT, HEADING_FONT, loadLogo, ensureFonts, hexToRgba } from "./render-shared";
import type { Holiday } from "./holidays";

export type MotionKind = "holiday" | "countdown" | "reveal" | "launch";

export const MOTION_KIND_LABEL: Record<MotionKind, string> = {
  holiday: "Shimmering holiday card",
  countdown: "Discount countdown",
  reveal: "Feature reveal",
  launch: "Product launch teaser",
};

export type MotionSpec = {
  brand: BrandKit;
  kind: MotionKind;
  /** 5–15 seconds. */
  duration: number;
  headline: string;
  subhead: string;
  bullets: string[];
  cta: string;
  badge: string;
  offer?: string;
  holiday?: Holiday | null;
};

const W = 1080;
const H = 1920;

function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - Math.min(Math.max(t, 0), 1), 3);
}

function clamp01(value: number): number {
  return Math.min(Math.max(value, 0), 1);
}

function phase(t: number, start: number, end: number): number {
  if (end <= start) return t >= end ? 1 : 0;
  return clamp01((t - start) / (end - start));
}

function roundedRectPath(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
) {
  const radius = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + w, y, x + w, y + h, radius);
  ctx.arcTo(x + w, y + h, x, y + h, radius);
  ctx.arcTo(x, y + h, x, y, radius);
  ctx.arcTo(x, y, x + w, y, radius);
  ctx.closePath();
}

function setFont(
  ctx: CanvasRenderingContext2D,
  size: number,
  weight: number,
  family = HEADING_FONT,
) {
  ctx.font = `${weight} ${Math.round(size)}px ${family}`;
}

function wrap(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
  const words = text.replace(/\s+/g, " ").trim().split(" ");
  const lines: string[] = [];
  let line = "";
  for (const word of words) {
    const candidate = line ? `${line} ${word}` : word;
    if (ctx.measureText(candidate).width <= maxWidth || !line) line = candidate;
    else {
      lines.push(line);
      line = word;
    }
  }
  if (line) lines.push(line);
  return lines;
}

function star(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  r: number,
  color: string,
  points = 8,
) {
  ctx.save();
  ctx.fillStyle = color;
  ctx.beginPath();
  for (let i = 0; i < points; i += 1) {
    const angle = (Math.PI / (points / 2)) * i;
    const radius = i % 2 === 0 ? r : r * 0.42;
    const x = cx + Math.cos(angle) * radius;
    const y = cy + Math.sin(angle) * radius;
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

/** Deterministic particles so the animation looks identical on every replay. */
const PARTICLES = Array.from({ length: 26 }, (_, index) => {
  const seed = (index + 1) * 9301;
  return {
    x: ((seed * 17) % 1000) / 1000,
    y: ((seed * 29) % 1000) / 1000,
    r: 2 + ((seed * 13) % 9),
    speed: 0.012 + (seed % 11) / 900,
    drift: ((seed % 7) - 3) / 250,
  };
});

/* --------------------------------------------------------------- painting */

function paintBackdrop(
  ctx: CanvasRenderingContext2D,
  spec: MotionSpec,
  t: number,
  duration: number,
) {
  const { colors } = spec.brand;
  const progress = (t % duration) / duration;
  const base = ctx.createLinearGradient(0, 0, W * 0.4, H);
  base.addColorStop(0, colors.bg);
  base.addColorStop(0.5, colors.bg2);
  base.addColorStop(1, colors.bg);
  ctx.fillStyle = base;
  ctx.fillRect(0, 0, W, H);

  const sweep = Math.sin(progress * Math.PI * 2) * 0.5 + 0.5;
  const glow = ctx.createRadialGradient(
    W * (0.25 + sweep * 0.55),
    H * 0.18,
    0,
    W * (0.25 + sweep * 0.55),
    H * 0.18,
    W * 1.05,
  );
  glow.addColorStop(0, hexToRgba(colors.accent, 0.5));
  glow.addColorStop(0.5, hexToRgba(colors.accent2, 0.18));
  glow.addColorStop(1, hexToRgba(colors.accent, 0));
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, W, H);

  const low = ctx.createRadialGradient(W * 0.9, H * 0.85, 0, W * 0.9, H * 0.85, W * 0.7);
  low.addColorStop(0, hexToRgba(colors.accent2, 0.28));
  low.addColorStop(1, hexToRgba(colors.accent2, 0));
  ctx.fillStyle = low;
  ctx.fillRect(0, 0, W, H);

  ctx.save();
  ctx.strokeStyle = "rgba(255,255,255,0.05)";
  ctx.lineWidth = 1;
  for (let x = 60; x < W; x += 90) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, H);
    ctx.stroke();
  }
  for (let y = 60; y < H; y += 90) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(W, y);
    ctx.stroke();
  }
  ctx.restore();

  // Drifting light particles.
  PARTICLES.forEach((particle) => {
    const y = ((particle.y + progress * particle.speed * 12) % 1) * H;
    const x = (particle.x + Math.sin(progress * Math.PI * 2) * particle.drift) * W;
    ctx.beginPath();
    ctx.fillStyle = hexToRgba(colors.accent, 0.16 + (particle.r % 5) * 0.03);
    ctx.arc(x, y, particle.r, 0, Math.PI * 2);
    ctx.fill();
  });

  const rim = ctx.createLinearGradient(0, 0, W, 0);
  rim.addColorStop(0, hexToRgba(colors.accent, 0));
  rim.addColorStop(0.5, hexToRgba(colors.accent, 0.75));
  rim.addColorStop(1, hexToRgba(colors.accent2, 0));
  ctx.fillStyle = rim;
  ctx.fillRect(0, 0, W, 10);
}

function paintLogo(
  ctx: CanvasRenderingContext2D,
  spec: MotionSpec,
  logo: HTMLImageElement | null,
  t: number,
) {
  const appear = easeOutCubic(phase(t, 0, 0.7));
  const size = 128 * (0.6 + 0.4 * appear);
  const x = W / 2 - size / 2;
  const y = 150 - (1 - appear) * 30;
  ctx.save();
  ctx.globalAlpha = appear;
  const radius = size * 0.26;
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + size, y, x + size, y + size, radius);
  ctx.arcTo(x + size, y + size, x, y + size, radius);
  ctx.arcTo(x, y + size, x, y, radius);
  ctx.arcTo(x, y, x + size, y, radius);
  ctx.closePath();
  ctx.clip();
  if (logo) ctx.drawImage(logo, x, y, size, size);
  else {
    ctx.fillStyle = "#0A1A30";
    ctx.fillRect(x, y, size, size);
    ctx.fillStyle = "#fff";
    setFont(ctx, 44, 800);
    ctx.textAlign = "center";
    ctx.fillText("NDH", W / 2, y + size * 0.62);
    ctx.textAlign = "left";
  }
  ctx.restore();

  ctx.save();
  ctx.globalAlpha = appear;
  ctx.strokeStyle = "rgba(255,255,255,0.3)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(W / 2, y + size / 2, size * 0.72, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();

  // Wordmark.
  ctx.save();
  ctx.globalAlpha = appear;
  ctx.textAlign = "center";
  setFont(ctx, 25, 700);
  ctx.fillStyle = "rgba(255,255,255,0.8)";
  ctx.fillText("NAJEEB DIGITAL HUB", W / 2, y + size + 62);
  ctx.fillStyle = hexToRgba(spec.brand.colors.accent, 0.96);
  setFont(ctx, 22, 600, BODY_FONT);
  ctx.fillText(spec.brand.name.toUpperCase(), W / 2, y + size + 102);
  ctx.restore();
}

function paintBadge(ctx: CanvasRenderingContext2D, spec: MotionSpec, t: number) {
  const appear = easeOutCubic(phase(t, 0.4, 1.1));
  if (appear <= 0) return;
  const label = spec.badge.toUpperCase();
  setFont(ctx, 24, 700, BODY_FONT);
  const width = ctx.measureText(label).width + 72;
  const x = W / 2 - width / 2;
  const y = 430 - (1 - appear) * 18;
  ctx.save();
  ctx.globalAlpha = appear;
  ctx.fillStyle = hexToRgba(spec.brand.colors.accent, 0.18);
  roundedRectPath(ctx, x, y, width, 56, 28);
  ctx.fill();
  ctx.strokeStyle = hexToRgba(spec.brand.colors.accent2, 0.55);
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.fillStyle = "#fff";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(label, W / 2, y + 30);
  ctx.textAlign = "left";
  ctx.textBaseline = "alphabetic";
  ctx.restore();
}

function paintHeadline(ctx: CanvasRenderingContext2D, spec: MotionSpec, t: number, top: number) {
  const start = spec.kind === "countdown" ? 0.6 : 0.5;
  setFont(ctx, 84, 800);
  let size = 84;
  let lines = wrap(ctx, spec.headline, W - 200);
  while (lines.length > 3 && size > 52) {
    size -= 6;
    setFont(ctx, size, 800);
    lines = wrap(ctx, spec.headline, W - 200);
  }
  const lineHeight = size * 1.08;
  ctx.textAlign = "center";
  lines.forEach((line, index) => {
    const delay = start + index * 0.18;
    const p = easeOutCubic(phase(t, delay, delay + 0.8));
    if (p <= 0) return;
    const y = top + index * lineHeight + (1 - p) * 46;
    ctx.save();
    ctx.globalAlpha = p;
    ctx.fillStyle = "#fff";
    ctx.shadowColor = hexToRgba(spec.brand.colors.accent, 0.55);
    ctx.shadowBlur = 26 * p;
    ctx.fillText(line, W / 2, y);
    ctx.restore();
  });

  // Shimmer sweep across the headline block.
  const shimmer = phase(t, start + 0.9, start + 1.9);
  if (shimmer > 0 && shimmer < 1) {
    const width = W - 180;
    const x = W / 2 - width / 2 + shimmer * width;
    const gradient = ctx.createLinearGradient(x - 160, 0, x + 160, 0);
    gradient.addColorStop(0, "rgba(255,255,255,0)");
    gradient.addColorStop(0.5, "rgba(255,255,255,0.5)");
    gradient.addColorStop(1, "rgba(255,255,255,0)");
    ctx.save();
    ctx.globalCompositeOperation = "lighter";
    ctx.fillStyle = gradient;
    ctx.fillRect(x - 160, top - size, 320, lineHeight * lines.length + size * 0.4);
    ctx.restore();
  }

  ctx.textAlign = "left";
  return top + lineHeight * lines.length;
}

function paintSubhead(ctx: CanvasRenderingContext2D, spec: MotionSpec, t: number, top: number) {
  const p = easeOutCubic(phase(t, 1.15, 1.9));
  if (p <= 0) return top;
  setFont(ctx, 38, 500, BODY_FONT);
  const lines = wrap(ctx, spec.subhead, W - 260).slice(0, 3);
  ctx.save();
  ctx.globalAlpha = p * 0.86;
  ctx.fillStyle = "#fff";
  ctx.textAlign = "center";
  lines.forEach((line, index) => {
    ctx.fillText(line, W / 2, top + 56 + index * 54 + (1 - p) * 22);
  });
  ctx.restore();
  ctx.textAlign = "left";
  return top + 56 + lines.length * 54;
}

function paintCountdown(
  ctx: CanvasRenderingContext2D,
  spec: MotionSpec,
  t: number,
  duration: number,
) {
  const centreY = H * 0.56;
  const progress = (t % duration) / duration;
  const pulse = Math.sin(progress * Math.PI * 4) * 0.5 + 0.5;

  // Progress ring.
  ctx.save();
  ctx.strokeStyle = "rgba(255,255,255,0.12)";
  ctx.lineWidth = 22;
  ctx.beginPath();
  ctx.arc(W / 2, centreY, 250, 0, Math.PI * 2);
  ctx.stroke();
  const ring = ctx.createLinearGradient(W / 2 - 250, centreY - 250, W / 2 + 250, centreY + 250);
  ring.addColorStop(0, spec.brand.colors.accent);
  ring.addColorStop(1, spec.brand.colors.accent2);
  ctx.strokeStyle = ring;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.arc(W / 2, centreY, 250, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * progress);
  ctx.stroke();
  ctx.restore();

  ctx.save();
  ctx.fillStyle = hexToRgba(spec.brand.colors.accent, 0.1 + pulse * 0.08);
  ctx.beginPath();
  ctx.arc(W / 2, centreY, 210, 0, Math.PI * 2);
  ctx.fill();

  const number = spec.offer?.match(/\d+/)?.[0] ?? "48";
  ctx.textAlign = "center";
  ctx.fillStyle = "#fff";
  setFont(ctx, 210, 800);
  ctx.fillText(number, W / 2, centreY + 34);
  ctx.fillStyle = hexToRgba(spec.brand.colors.accent, 0.98);
  setFont(ctx, 34, 700);
  ctx.fillText(
    spec.offer?.toUpperCase().includes("HOUR") ? "HOURS LEFT" : "OFFER ENDS",
    W / 2,
    centreY + 96,
  );
  ctx.restore();
  ctx.textAlign = "left";
}

function paintBulletReveal(
  ctx: CanvasRenderingContext2D,
  spec: MotionSpec,
  t: number,
  top: number,
) {
  const bullets = spec.bullets.slice(0, 3);
  bullets.forEach((bullet, index) => {
    const start = 1.6 + index * 0.35;
    const p = easeOutCubic(phase(t, start, start + 0.6));
    if (p <= 0) return;
    const y = top + index * 132 + (1 - p) * 28;
    ctx.save();
    ctx.globalAlpha = p;
    ctx.fillStyle = "rgba(255,255,255,0.08)";
    roundedRectPath(ctx, 90, y, W - 180, 108, 22);
    ctx.fill();
    ctx.strokeStyle = hexToRgba(
      index % 2 === 0 ? spec.brand.colors.accent : spec.brand.colors.accent2,
      0.4,
    );
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.fillStyle = hexToRgba(spec.brand.colors.accent, 0.95);
    ctx.beginPath();
    ctx.arc(146, y + 54, 20, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#08111F";
    setFont(ctx, 20, 800);
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(String(index + 1), 146, y + 56);
    ctx.textAlign = "left";
    ctx.textBaseline = "alphabetic";

    ctx.fillStyle = "#fff";
    setFont(ctx, 30, 500, BODY_FONT);
    const lines = wrap(ctx, bullet, W - 330).slice(0, 2);
    lines.forEach((line, lineIndex) => {
      ctx.fillText(line, 196, y + (lines.length === 1 ? 64 : 48) + lineIndex * 34);
    });
    ctx.restore();
  });
}

function paintHolidayOrnament(
  ctx: CanvasRenderingContext2D,
  spec: MotionSpec,
  t: number,
  centreY: number,
) {
  const islamic = spec.holiday?.group === "islamic";
  const pulse = Math.sin(t * 2) * 0.5 + 0.5;
  const appear = easeOutCubic(phase(t, 0, 1));
  ctx.save();
  ctx.globalAlpha = appear;
  if (islamic) {
    ctx.fillStyle = hexToRgba(spec.brand.colors.accent, 0.95);
    ctx.beginPath();
    ctx.arc(W / 2, centreY, 88, 0, Math.PI * 2);
    ctx.arc(W / 2 + 34, centreY - 18, 76, 0, Math.PI * 2, true);
    ctx.fill("evenodd");
    star(
      ctx,
      W / 2 + 132,
      centreY - 62,
      20 + pulse * 4,
      hexToRgba(spec.brand.colors.accent2, 0.95),
    );
    star(ctx, W / 2 + 178, centreY + 24, 12, "rgba(255,255,255,0.85)");
  } else {
    star(ctx, W / 2, centreY, 62 + pulse * 8, hexToRgba(spec.brand.colors.accent, 0.95));
    star(ctx, W / 2 - 120, centreY + 40, 22, hexToRgba(spec.brand.colors.accent2, 0.9));
    star(ctx, W / 2 + 130, centreY - 30, 16, "rgba(255,255,255,0.8)");
  }
  ctx.restore();
}

function paintSignoff(ctx: CanvasRenderingContext2D, spec: MotionSpec, t: number, top: number) {
  const p = easeOutCubic(phase(t, 1.9, 2.5));
  if (p <= 0) return;
  ctx.save();
  ctx.globalAlpha = p;
  ctx.strokeStyle = hexToRgba(spec.brand.colors.accent, 0.55);
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(W / 2 - 90, top);
  ctx.lineTo(W / 2 + 90, top);
  ctx.stroke();

  ctx.textAlign = "center";
  ctx.fillStyle = "rgba(255,255,255,0.92)";
  setFont(ctx, 34, 700);
  ctx.fillText(spec.brand.name, W / 2, top + 68);
  ctx.fillStyle = hexToRgba(spec.brand.colors.accent, 0.9);
  setFont(ctx, 24, 600, BODY_FONT);
  ctx.fillText("NAJEEB DIGITAL HUB · OPEN GATEWAY", W / 2, top + 110);
  ctx.textAlign = "left";
  ctx.restore();
}

function paintFooterBar(ctx: CanvasRenderingContext2D, spec: MotionSpec, t: number) {
  const p = easeOutCubic(phase(t, 2.2, 2.9));
  if (p <= 0) return;
  ctx.save();
  ctx.globalAlpha = p;
  const y = H - 220;
  ctx.strokeStyle = "rgba(255,255,255,0.18)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(90, y);
  ctx.lineTo(W - 90, y);
  ctx.stroke();

  ctx.fillStyle = "#fff";
  setFont(ctx, 34, 700);
  ctx.fillText(spec.cta, 90, y + 78);
  ctx.textAlign = "right";
  ctx.fillStyle = hexToRgba(spec.brand.colors.accent, 0.95);
  setFont(ctx, 26, 600, BODY_FONT);
  ctx.fillText(spec.brand.url.replace(/^https?:\/\//, "").replace(/\/$/, ""), W - 90, y + 78);
  ctx.textAlign = "left";
  ctx.restore();
}

export function paintFrame(
  ctx: CanvasRenderingContext2D,
  spec: MotionSpec,
  t: number,
  logo: HTMLImageElement | null,
) {
  const duration = spec.duration;
  paintBackdrop(ctx, spec, t, duration);
  paintLogo(ctx, spec, logo, t);
  paintBadge(ctx, spec, t);

  if (spec.kind === "holiday") {
    paintHolidayOrnament(ctx, spec, t, H * 0.34);
    const headlineTop = paintHeadline(ctx, spec, t, H * 0.42);
    const after = paintSubhead(ctx, spec, t, headlineTop + 30);
    paintSignoff(ctx, spec, t, after + 70);
  } else if (spec.kind === "countdown") {
    paintCountdown(ctx, spec, t, duration);
    paintHeadline(ctx, spec, t, H * 0.76);
  } else if (spec.kind === "reveal") {
    const headlineTop = paintHeadline(ctx, spec, t, H * 0.34);
    paintBulletReveal(ctx, spec, t, headlineTop + 40);
  } else {
    const headlineTop = paintHeadline(ctx, spec, t, H * 0.34);
    paintSubhead(ctx, spec, t, headlineTop + 30);
    paintBulletReveal(ctx, spec, t, headlineTop + 260);
  }

  paintFooterBar(ctx, spec, t);

  // Vignette keeps the centre legible over the moving background.
  const vignette = ctx.createRadialGradient(W / 2, H / 2, W * 0.3, W / 2, H / 2, H * 0.72);
  vignette.addColorStop(0, "rgba(0,0,0,0)");
  vignette.addColorStop(1, "rgba(0,0,0,0.35)");
  ctx.fillStyle = vignette;
  ctx.fillRect(0, 0, W, H);
}

/* --------------------------------------------------------------- playback */

export type MotionHandle = { stop: () => void };

export async function playMotion(
  canvas: HTMLCanvasElement,
  spec: MotionSpec,
  onProgress?: (fraction: number) => void,
): Promise<MotionHandle> {
  await ensureFonts();
  const logo = await loadLogo();
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("This browser cannot preview motion cards.");

  let frame = 0;
  const started = performance.now();
  const loop = (now: number) => {
    const elapsed = (now - started) / 1000;
    const t = elapsed % spec.duration;
    paintFrame(ctx, spec, t, logo);
    onProgress?.(t / spec.duration);
    frame = requestAnimationFrame(loop);
  };
  frame = requestAnimationFrame(loop);
  return {
    stop: () => cancelAnimationFrame(frame),
  };
}

/** Paint a single still frame (used for thumbnails and poster images). */
export async function renderMotionPoster(
  canvas: HTMLCanvasElement,
  spec: MotionSpec,
): Promise<string> {
  await ensureFonts();
  const logo = await loadLogo();
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("This browser cannot render motion cards.");
  paintFrame(ctx, spec, Math.min(2.4, spec.duration * 0.42), logo);
  return canvas.toDataURL("image/jpeg", 0.8);
}

export function supportedVideoMime(): string {
  if (typeof MediaRecorder === "undefined") return "";
  const candidates = ["video/webm;codecs=vp9", "video/webm;codecs=vp8", "video/webm", "video/mp4"];
  return candidates.find((type) => MediaRecorder.isTypeSupported(type)) ?? "";
}

export function canExportVideo(): boolean {
  return (
    typeof window !== "undefined" &&
    typeof MediaRecorder !== "undefined" &&
    typeof HTMLCanvasElement !== "undefined" &&
    typeof HTMLCanvasElement.prototype.captureStream === "function" &&
    supportedVideoMime() !== ""
  );
}

/**
 * Record one full pass of the animation at 30fps and return the video blob.
 * `onProgress` receives 0–1 so the UI can show a recording bar.
 */
export async function exportMotion(
  canvas: HTMLCanvasElement,
  spec: MotionSpec,
  onProgress?: (fraction: number) => void,
): Promise<{ blob: Blob; mime: string; extension: string }> {
  if (!canExportVideo()) {
    throw new Error("This browser cannot record canvas video. Try Chrome, Edge or Safari 15+.");
  }
  await ensureFonts();
  const logo = await loadLogo();
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("This browser cannot record motion cards.");

  const mime = supportedVideoMime();
  const stream = canvas.captureStream(30);
  const recorder = new MediaRecorder(stream, { mimeType: mime, videoBitsPerSecond: 6_000_000 });
  const chunks: BlobPart[] = [];
  recorder.ondataavailable = (event) => {
    if (event.data.size > 0) chunks.push(event.data);
  };

  const finished = new Promise<Blob>((resolve, reject) => {
    recorder.onstop = () => resolve(new Blob(chunks, { type: mime }));
    recorder.onerror = () => reject(new Error("Recording failed in this browser."));
  });

  recorder.start(120);
  const started = performance.now();
  await new Promise<void>((resolve) => {
    let frame = 0;
    const draw = (now: number) => {
      const elapsed = (now - started) / 1000;
      const t = Math.min(elapsed, spec.duration);
      paintFrame(ctx, spec, t, logo);
      onProgress?.(Math.min(t / spec.duration, 1));
      if (elapsed >= spec.duration) {
        cancelAnimationFrame(frame);
        resolve();
        return;
      }
      frame = requestAnimationFrame(draw);
    };
    frame = requestAnimationFrame(draw);
  });

  // Let the encoder flush the last frames before closing the stream.
  await new Promise((resolve) => setTimeout(resolve, 220));
  recorder.stop();
  stream.getTracks().forEach((track) => track.stop());
  const blob = await finished;
  return { blob, mime, extension: mime.includes("mp4") ? "mp4" : "webm" };
}

export { W as MOTION_WIDTH, H as MOTION_HEIGHT };
export { loadLogo } from "./render-shared";
