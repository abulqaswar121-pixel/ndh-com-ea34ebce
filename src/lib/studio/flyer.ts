/**
 * Studio flyer & infographic renderer.
 *
 * Everything is drawn on a real canvas at output resolution — 1080×1080 for
 * feeds, 1080×1920 for status/stories/reels — so downloads are genuinely
 * high-resolution rather than upscaled screenshots.
 *
 * Layouts share one visual grammar: deep brand base, an accent glow, the Open
 * Gateway tile, sharp headline typography, a short set of proof points and a
 * footer carrying the public address. The official logo watermark is always
 * present.
 */
import type { BrandKit } from "./kits";
import { BODY_FONT, HEADING_FONT, ensureFonts, hexToRgba, loadLogo } from "./render-shared";
import type { Holiday } from "./holidays";

export type FlyerFormat = "square" | "story";
export type FlyerLayout = "promo" | "infographic" | "holiday" | "launch";

export type FlyerSpec = {
  brand: BrandKit;
  format: FlyerFormat;
  layout: FlyerLayout;
  headline: string;
  subhead: string;
  bullets: string[];
  cta: string;
  badge: string;
  offer?: string;
  holiday?: Holiday | null;
};

export const FLYER_SIZES: Record<
  FlyerFormat,
  { width: number; height: number; label: string; use: string }
> = {
  square: {
    width: 1080,
    height: 1080,
    label: "1:1 Square",
    use: "Instagram, Facebook & LinkedIn feeds",
  },
  story: {
    width: 1080,
    height: 1920,
    label: "9:16 Full screen",
    use: "WhatsApp status, stories & reels",
  },
};

export const FLYER_LAYOUT_LABEL: Record<FlyerLayout, string> = {
  promo: "Promotional sale",
  infographic: "Informational infographic",
  holiday: "Holiday greeting",
  launch: "Product launch",
};

/* ------------------------------------------------------------- primitives */

type Ctx = CanvasRenderingContext2D;

function roundedPath(ctx: Ctx, x: number, y: number, w: number, h: number, r: number) {
  const radius = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + w, y, x + w, y + h, radius);
  ctx.arcTo(x + w, y + h, x, y + h, radius);
  ctx.arcTo(x, y + h, x, y, radius);
  ctx.arcTo(x, y, x + w, y, radius);
  ctx.closePath();
}

function fillRounded(
  ctx: Ctx,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
  fill: string,
) {
  roundedPath(ctx, x, y, w, h, r);
  ctx.fillStyle = fill;
  ctx.fill();
}

function font(ctx: Ctx, size: number, weight: number, family = HEADING_FONT) {
  ctx.font = `${weight} ${Math.round(size)}px ${family}`;
}

function wrapText(ctx: Ctx, text: string, maxWidth: number): string[] {
  const words = text.replace(/\s+/g, " ").trim().split(" ");
  const lines: string[] = [];
  let line = "";
  for (const word of words) {
    const candidate = line ? `${line} ${word}` : word;
    if (ctx.measureText(candidate).width <= maxWidth || !line) {
      line = candidate;
    } else {
      lines.push(line);
      line = word;
    }
  }
  if (line) lines.push(line);
  return lines;
}

/** Shrink until the text fits the box, then clip the overflow with an ellipsis. */
function fitBlock(
  ctx: Ctx,
  text: string,
  opts: {
    maxWidth: number;
    maxLines: number;
    startSize: number;
    minSize: number;
    weight: number;
    family?: string;
    lineHeight?: number;
  },
): { lines: string[]; size: number; lineHeight: number } {
  const family = opts.family ?? HEADING_FONT;
  let size = opts.startSize;
  let lines: string[] = [];
  const ratio = opts.lineHeight ?? 1.08;
  for (; size >= opts.minSize; size -= 2) {
    font(ctx, size, opts.weight, family);
    lines = wrapText(ctx, text, opts.maxWidth);
    if (lines.length <= opts.maxLines) break;
  }
  if (lines.length > opts.maxLines) {
    lines = lines.slice(0, opts.maxLines);
    const last = lines[lines.length - 1] ?? "";
    lines[lines.length - 1] = `${last.replace(/[,;:.\-–—]$/, "")}…`;
  }
  return { lines, size, lineHeight: size * ratio };
}

function drawLines(
  ctx: Ctx,
  lines: string[],
  x: number,
  y: number,
  lineHeight: number,
  align: CanvasTextAlign = "left",
) {
  ctx.textAlign = align;
  lines.forEach((line, index) => {
    ctx.fillText(line, x, y + index * lineHeight);
  });
  ctx.textAlign = "left";
}

/* ---------------------------------------------------------------- session */

export type FlyerResult = {
  blob: Blob;
  width: number;
  height: number;
  dataUrl: string;
  thumbnail: string;
};

/** Draw the artwork only — no export, no blob. Used by renderFlyer and tests. */
export async function paintFlyer(canvas: HTMLCanvasElement, spec: FlyerSpec): Promise<void> {
  await ensureFonts();
  const logo = await loadLogo();
  const { width, height } = FLYER_SIZES[spec.format];
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("This browser cannot render the flyer canvas.");

  paintBackground(ctx, spec, width, height);
  paintHeader(ctx, spec, width, logo);
  if (spec.layout === "infographic") {
    paintInfographic(ctx, spec, width, height, logo);
  } else if (spec.layout === "holiday") {
    paintHoliday(ctx, spec, width, height);
  } else if (spec.layout === "promo") {
    paintPromo(ctx, spec, width, height, logo);
  } else {
    paintLaunch(ctx, spec, width, height, logo);
  }
  paintFooter(ctx, spec, width, height);
}

export async function renderFlyer(
  canvas: HTMLCanvasElement,
  spec: FlyerSpec,
): Promise<FlyerResult> {
  await paintFlyer(canvas, spec);
  const { width, height } = FLYER_SIZES[spec.format];
  const blob = await canvasToBlob(canvas, "image/png");
  return {
    blob,
    width,
    height,
    dataUrl: canvas.toDataURL("image/jpeg", 0.9),
    thumbnail: thumbnailFrom(canvas),
  };
}

export function canvasToBlob(canvas: HTMLCanvasElement, type = "image/png", quality = 0.94) {
  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) resolve(blob);
        else reject(new Error("The browser could not export this image."));
      },
      type,
      quality,
    );
  });
}

export function thumbnailFrom(canvas: HTMLCanvasElement, targetWidth = 420): string {
  const ratio = canvas.height / canvas.width;
  const thumb = document.createElement("canvas");
  thumb.width = targetWidth;
  thumb.height = Math.round(targetWidth * ratio);
  const ctx = thumb.getContext("2d");
  if (!ctx) return canvas.toDataURL("image/jpeg", 0.6);
  ctx.drawImage(canvas, 0, 0, thumb.width, thumb.height);
  return thumb.toDataURL("image/jpeg", 0.72);
}

/* --------------------------------------------------------------- painting */

function paintBackground(ctx: Ctx, spec: FlyerSpec, w: number, h: number) {
  const { colors } = spec.brand;
  const base = ctx.createLinearGradient(0, 0, w * 0.6, h);
  base.addColorStop(0, colors.bg);
  base.addColorStop(0.55, colors.bg2 ?? colors.bg);
  base.addColorStop(1, colors.bg);
  ctx.fillStyle = base;
  ctx.fillRect(0, 0, w, h);

  // Accent bloom, top-right.
  const glow = ctx.createRadialGradient(w * 0.88, -h * 0.06, 0, w * 0.88, -h * 0.06, w * 0.85);
  glow.addColorStop(0, hexToRgba(colors.accent, 0.44));
  glow.addColorStop(0.55, hexToRgba(colors.accent2, 0.16));
  glow.addColorStop(1, hexToRgba(colors.accent, 0));
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, w, h);

  // Secondary bloom bottom-left keeps the composition balanced.
  const glow2 = ctx.createRadialGradient(w * 0.06, h * 0.95, 0, w * 0.06, h * 0.95, w * 0.7);
  glow2.addColorStop(0, hexToRgba(colors.accent2, 0.22));
  glow2.addColorStop(1, hexToRgba(colors.accent2, 0));
  ctx.fillStyle = glow2;
  ctx.fillRect(0, 0, w, h);

  // Fine grid — the Open Gateway structure.
  ctx.save();
  ctx.strokeStyle = "rgba(255,255,255,0.045)";
  ctx.lineWidth = 1;
  const step = w / 18;
  for (let x = step; x < w; x += step) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, h);
    ctx.stroke();
  }
  for (let y = step; y < h; y += step) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(w, y);
    ctx.stroke();
  }
  ctx.restore();

  // Rim light along the top edge.
  const rim = ctx.createLinearGradient(0, 0, w, 0);
  rim.addColorStop(0, hexToRgba(colors.accent, 0));
  rim.addColorStop(0.5, hexToRgba(colors.accent, 0.6));
  rim.addColorStop(1, hexToRgba(colors.accent2, 0));
  ctx.fillStyle = rim;
  ctx.fillRect(0, 0, w, 8);
}

function paintHeader(ctx: Ctx, spec: FlyerSpec, w: number, logo: HTMLImageElement | null) {
  const pad = w * 0.066;
  const tile = w * 0.086;
  const y = pad;

  ctx.save();
  roundedPath(ctx, pad, y, tile, tile, tile * 0.26);
  ctx.clip();
  if (logo) {
    ctx.drawImage(logo, pad, y, tile, tile);
  } else {
    ctx.fillStyle = "#0A1A30";
    ctx.fillRect(pad, y, tile, tile);
    ctx.fillStyle = "#fff";
    font(ctx, tile * 0.34, 800);
    ctx.textAlign = "center";
    ctx.fillText("NDH", pad + tile / 2, y + tile * 0.62);
    ctx.textAlign = "left";
  }
  ctx.restore();
  roundedPath(ctx, pad, y, tile, tile, tile * 0.26);
  ctx.strokeStyle = "rgba(255,255,255,0.28)";
  ctx.lineWidth = 2;
  ctx.stroke();

  const textX = pad + tile + w * 0.024;
  ctx.fillStyle = "rgba(255,255,255,0.94)";
  font(ctx, w * 0.0265, 800);
  ctx.fillText("NAJEEB DIGITAL HUB", textX, y + tile * 0.42);
  ctx.fillStyle = hexToRgba(spec.brand.colors.accent, 0.96);
  font(ctx, w * 0.0225, 600, BODY_FONT);
  ctx.fillText(spec.brand.name.replace("NDH Parent Brand", "NDH"), textX, y + tile * 0.82);
}

function badgeChip(
  ctx: Ctx,
  text: string,
  right: number,
  y: number,
  accent: string,
  accent2: string,
  size: number,
) {
  font(ctx, size, 700, BODY_FONT);
  const width = ctx.measureText(text.toUpperCase()).width + size * 2.4;
  const height = size * 2.1;
  const x = right - width;
  fillRounded(ctx, x, y, width, height, height / 2, hexToRgba(accent, 0.18));
  roundedPath(ctx, x, y, width, height, height / 2);
  ctx.strokeStyle = hexToRgba(accent2, 0.55);
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.fillStyle = "#fff";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(text.toUpperCase(), x + width / 2, y + height / 2 + size * 0.06);
  ctx.textAlign = "left";
  ctx.textBaseline = "alphabetic";
  return { x, width, height };
}

/* ----------------------------------------------------------- layout kit */

type Layout = { width: number; height: number; pad: number; top: number; ctaTop: number };

function layoutFor(spec: FlyerSpec): Layout {
  const isStory = spec.format === "story";
  const height = isStory ? 1920 : 1080;
  const width = 1080;
  return {
    width,
    height,
    pad: width * 0.066,
    top: isStory ? height * 0.155 : height * 0.25,
    ctaTop: isStory ? height * 0.8 : height * 0.79,
  };
}

/** Draws a headline block and returns the y position below it. */
function headlineBlock(
  ctx: Ctx,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  opts: { startSize: number; minSize: number; maxLines: number; align?: CanvasTextAlign },
): number {
  const block = fitBlock(ctx, text, {
    maxWidth,
    maxLines: opts.maxLines,
    startSize: opts.startSize,
    minSize: opts.minSize,
    weight: 800,
    lineHeight: 1.02,
  });
  ctx.fillStyle = "#fff";
  drawLines(
    ctx,
    block.lines,
    opts.align === "center" ? x + maxWidth / 2 : x,
    y,
    block.lineHeight,
    opts.align ?? "left",
  );
  return y + block.lineHeight * block.lines.length;
}

function paragraphBlock(
  ctx: Ctx,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  opts: { size: number; maxLines: number; colour?: string; align?: CanvasTextAlign },
): number {
  const block = fitBlock(ctx, text, {
    maxWidth,
    maxLines: opts.maxLines,
    startSize: opts.size,
    minSize: Math.max(opts.size * 0.72, 18),
    weight: 500,
    family: BODY_FONT,
    lineHeight: 1.34,
  });
  ctx.fillStyle = opts.colour ?? "rgba(255,255,255,0.82)";
  drawLines(
    ctx,
    block.lines,
    opts.align === "center" ? x + maxWidth / 2 : x,
    y,
    block.lineHeight,
    opts.align ?? "left",
  );
  return y + block.lineHeight * block.lines.length;
}

/** Bullet rows; stops early rather than running into the artwork footer. */
function bulletRows(
  ctx: Ctx,
  bullets: string[],
  x: number,
  y: number,
  maxWidth: number,
  limitY: number,
  opts: { size: number; accent: string; rows: number },
): number {
  let cursor = y;
  bullets.slice(0, opts.rows).forEach((bullet) => {
    const block = fitBlock(ctx, bullet, {
      maxWidth: maxWidth - opts.size * 1.9,
      maxLines: 2,
      startSize: opts.size,
      minSize: opts.size * 0.78,
      weight: 500,
      family: BODY_FONT,
      lineHeight: 1.26,
    });
    const height = Math.max(block.lineHeight * block.lines.length, opts.size * 1.5);
    if (cursor + height > limitY) return;
    ctx.fillStyle = hexToRgba(opts.accent, 0.95);
    ctx.beginPath();
    ctx.arc(x + opts.size * 0.42, cursor + opts.size * 0.42, opts.size * 0.34, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "rgba(255,255,255,0.9)";
    drawLines(ctx, block.lines, x + opts.size * 1.3, cursor + block.size * 0.82, block.lineHeight);
    cursor += height + opts.size * 0.62;
  });
  return cursor;
}

function offerStrip(
  ctx: Ctx,
  text: string,
  x: number,
  y: number,
  width: number,
  height: number,
  accent: string,
  size: number,
): number {
  fillRounded(ctx, x, y, width, height, height * 0.28, "rgba(255,255,255,0.09)");
  roundedPath(ctx, x, y, width, height, height * 0.28);
  ctx.strokeStyle = hexToRgba(accent, 0.45);
  ctx.lineWidth = 2;
  ctx.stroke();
  const block = fitBlock(ctx, text, {
    maxWidth: width - size * 2.4,
    maxLines: 2,
    startSize: size,
    minSize: size * 0.75,
    weight: 600,
    family: BODY_FONT,
    lineHeight: 1.24,
  });
  ctx.fillStyle = hexToRgba(accent, 0.98);
  drawLines(
    ctx,
    block.lines,
    x + size * 1.2,
    y + height / 2 + block.size * 0.34 - ((block.lines.length - 1) * block.lineHeight) / 2,
    block.lineHeight,
  );
  return y + height;
}

/* ------------------------------------------------------------- layouts */

function paintPromo(
  ctx: Ctx,
  spec: FlyerSpec,
  w: number,
  h: number,
  logo: HTMLImageElement | null,
) {
  const isStory = spec.format === "story";
  const { pad, top, ctaTop } = layoutFor(spec);
  const accent = spec.brand.colors.accent;
  const accent2 = spec.brand.colors.accent2;
  const contentWidth = w - pad * 2;
  const limitY = ctaTop - h * 0.02;

  badgeChip(ctx, spec.badge, w - pad, pad, accent, accent2, w * 0.021);

  let y = top;
  y = headlineBlock(ctx, spec.headline, pad, y, contentWidth, {
    startSize: w * (isStory ? 0.125 : 0.086),
    minSize: w * 0.055,
    maxLines: isStory ? 3 : 2,
  });
  y += h * (isStory ? 0.05 : 0.028);

  y = paragraphBlock(ctx, spec.subhead, pad, y, contentWidth * 0.94, {
    size: w * (isStory ? 0.038 : 0.031),
    maxLines: isStory ? 3 : 2,
  });
  y += h * (isStory ? 0.045 : 0.026);

  if (spec.offer) {
    const stripHeight = h * (isStory ? 0.058 : 0.062);
    if (y + stripHeight < limitY) {
      y = offerStrip(
        ctx,
        spec.offer,
        pad,
        y,
        contentWidth,
        stripHeight,
        accent,
        w * (isStory ? 0.03 : 0.027),
      );
      y += h * (isStory ? 0.042 : 0.024);
    }
  }

  const afterBullets = bulletRows(ctx, spec.bullets, pad, y, contentWidth, limitY, {
    size: w * (isStory ? 0.031 : 0.027),
    accent,
    rows: isStory ? 3 : 2,
  });

  if (spec.format === "story") {
    watermark(ctx, spec, logo, afterBullets + h * 0.05, ctaTop - h * 0.05);
  }
  drawCtaPill(ctx, spec.cta, pad, ctaTop, w * 0.3, w * 0.028, accent, accent2);
}

function paintLaunch(
  ctx: Ctx,
  spec: FlyerSpec,
  w: number,
  h: number,
  logo: HTMLImageElement | null,
) {
  const isStory = spec.format === "story";
  const { pad, top, ctaTop } = layoutFor(spec);
  const accent = spec.brand.colors.accent;
  const accent2 = spec.brand.colors.accent2;
  const contentWidth = w - pad * 2;
  const limitY = ctaTop - h * 0.02;

  badgeChip(ctx, spec.badge || "NEW", w - pad, pad, accent, accent2, w * 0.021);

  let y = top;
  y = headlineBlock(ctx, spec.headline, pad, y, contentWidth, {
    startSize: w * (isStory ? 0.108 : 0.082),
    minSize: w * 0.052,
    maxLines: isStory ? 3 : 2,
  });
  y += h * 0.026;

  y = paragraphBlock(ctx, spec.subhead, pad, y, contentWidth * 0.92, {
    size: w * (isStory ? 0.034 : 0.03),
    maxLines: isStory ? 3 : 2,
  });
  y += h * 0.03;

  const cards = spec.bullets.slice(0, isStory ? 4 : 2);
  const cardHeight = h * (isStory ? 0.075 : 0.086);
  const gap = h * 0.016;
  cards.forEach((bullet, index) => {
    const cardY = y + index * (cardHeight + gap);
    if (cardY + cardHeight > limitY) return;
    fillRounded(ctx, pad, cardY, contentWidth, cardHeight, w * 0.019, "rgba(255,255,255,0.07)");
    roundedPath(ctx, pad, cardY, contentWidth, cardHeight, w * 0.019);
    ctx.strokeStyle = "rgba(255,255,255,0.13)";
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.fillStyle = hexToRgba(accent, 0.95);
    font(ctx, cardHeight * 0.32, 800);
    ctx.fillText(String(index + 1).padStart(2, "0"), pad + w * 0.03, cardY + cardHeight * 0.62);

    const block = fitBlock(ctx, bullet, {
      maxWidth: contentWidth - w * 0.16,
      maxLines: 2,
      startSize: w * (isStory ? 0.027 : 0.026),
      minSize: w * 0.019,
      weight: 500,
      family: BODY_FONT,
      lineHeight: 1.26,
    });
    ctx.fillStyle = "rgba(255,255,255,0.92)";
    drawLines(
      ctx,
      block.lines,
      pad + w * 0.115,
      cardY +
        cardHeight / 2 +
        block.size * 0.36 -
        ((block.lines.length - 1) * block.lineHeight) / 2,
      block.lineHeight,
    );
  });

  if (spec.format === "story") {
    watermark(
      ctx,
      spec,
      logo,
      y + spec.bullets.length * (h * 0.075 + h * 0.016) + h * 0.04,
      ctaTop - h * 0.05,
    );
  }
  drawCtaPill(ctx, spec.cta, pad, ctaTop, w * 0.32, w * 0.028, accent, accent2);
}

function paintInfographic(
  ctx: Ctx,
  spec: FlyerSpec,
  w: number,
  h: number,
  logo: HTMLImageElement | null,
) {
  const isStory = spec.format === "story";
  const { pad, top, ctaTop } = layoutFor(spec);
  const accent = spec.brand.colors.accent;
  const accent2 = spec.brand.colors.accent2;
  const contentWidth = w - pad * 2;
  const limitY = ctaTop - h * 0.01;

  badgeChip(ctx, spec.badge || "EXPLAINER", w - pad, pad, accent, accent2, w * 0.021);

  let y = top;
  y = headlineBlock(ctx, spec.headline, pad, y, contentWidth, {
    startSize: w * (isStory ? 0.078 : 0.064),
    minSize: w * 0.045,
    maxLines: 3,
  });
  y += h * 0.024;

  y = paragraphBlock(ctx, spec.subhead, pad, y, contentWidth * 0.9, {
    size: w * (isStory ? 0.03 : 0.028),
    maxLines: 2,
    colour: "rgba(255,255,255,0.74)",
  });
  y += h * 0.03;

  const rows = spec.bullets.slice(0, isStory ? 4 : 3);
  const rowHeight = h * (isStory ? 0.068 : 0.098);
  const gap = h * 0.014;
  rows.forEach((bullet, index) => {
    const rowY = y + index * (rowHeight + gap);
    if (rowY + rowHeight > limitY) return;
    fillRounded(ctx, pad, rowY, contentWidth, rowHeight, w * 0.022, "rgba(255,255,255,0.075)");
    roundedPath(ctx, pad, rowY, contentWidth, rowHeight, w * 0.022);
    ctx.strokeStyle = hexToRgba(index % 2 === 0 ? accent : accent2, 0.32);
    ctx.lineWidth = 2;
    ctx.stroke();

    const circle = rowHeight * 0.33;
    const cx = pad + w * 0.028;
    ctx.beginPath();
    ctx.arc(cx + circle, rowY + rowHeight / 2, circle, 0, Math.PI * 2);
    ctx.fillStyle = hexToRgba(index % 2 === 0 ? accent : accent2, 0.92);
    ctx.fill();
    ctx.fillStyle = "#0A1A30";
    font(ctx, circle * 0.92, 800);
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(String(index + 1), cx + circle, rowY + rowHeight / 2 + circle * 0.05);
    ctx.textAlign = "left";
    ctx.textBaseline = "alphabetic";

    const block = fitBlock(ctx, bullet, {
      maxWidth: contentWidth - circle * 2 - w * 0.1,
      maxLines: 2,
      startSize: w * (isStory ? 0.028 : 0.027),
      minSize: w * 0.019,
      weight: 600,
      family: BODY_FONT,
      lineHeight: 1.26,
    });
    ctx.fillStyle = "#fff";
    drawLines(
      ctx,
      block.lines,
      cx + circle * 2 + w * 0.028,
      rowY + rowHeight / 2 + block.size * 0.36 - ((block.lines.length - 1) * block.lineHeight) / 2,
      block.lineHeight,
    );
  });

  if (spec.format === "story") {
    watermark(ctx, spec, logo, y + rows.length * (rowHeight + gap) + h * 0.03, ctaTop - h * 0.04);
  }
  drawCtaPill(ctx, spec.cta, pad, ctaTop, w * 0.28, w * 0.026, accent, accent2);
}

function paintHoliday(ctx: Ctx, spec: FlyerSpec, w: number, h: number) {
  const isStory = spec.format === "story";
  const { pad, ctaTop } = layoutFor(spec);
  const accent = spec.brand.colors.accent;
  const accent2 = spec.brand.colors.accent2;
  const centreX = w / 2;
  const contentWidth = w - pad * 2.3;

  const islamic = spec.holiday?.group === "islamic";
  const ornamentY = isStory ? h * 0.24 : h * 0.235;

  ctx.save();
  // A quiet star field behind the greeting.
  [
    [0.12, 0.34, 4, 0.35],
    [0.86, 0.4, 5, 0.3],
    [0.2, 0.52, 3, 0.25],
    [0.78, 0.58, 4, 0.22],
    [0.32, 0.3, 3, 0.28],
  ].forEach(([fx, fy, radius, alpha]) => {
    drawStar(ctx, w * fx, h * fy, radius, `rgba(255,255,255,${alpha})`);
  });
  ctx.restore();

  ctx.save();
  if (islamic) {
    // Crescent drawn with the even-odd rule so nothing is erased from the canvas.
    ctx.fillStyle = hexToRgba(accent, 0.95);
    ctx.beginPath();
    ctx.arc(centreX, ornamentY, w * 0.062, 0, Math.PI * 2);
    ctx.arc(centreX + w * 0.024, ornamentY - w * 0.014, w * 0.054, 0, Math.PI * 2, true);
    ctx.fill("evenodd");
    drawStar(ctx, centreX + w * 0.085, ornamentY - w * 0.045, w * 0.015, hexToRgba(accent2, 0.95));
    drawStar(ctx, centreX + w * 0.12, ornamentY + w * 0.02, w * 0.009, "rgba(255,255,255,0.85)");
  } else {
    drawStar(ctx, centreX, ornamentY, w * 0.04, hexToRgba(accent, 0.95));
    drawStar(ctx, centreX - w * 0.09, ornamentY + w * 0.028, w * 0.016, hexToRgba(accent2, 0.9));
    drawStar(ctx, centreX + w * 0.1, ornamentY - w * 0.018, w * 0.012, "rgba(255,255,255,0.8)");
  }
  ctx.restore();

  let y = ornamentY + h * (isStory ? 0.12 : 0.135);
  y = headlineBlock(ctx, spec.headline, pad, y, contentWidth, {
    startSize: w * (isStory ? 0.095 : 0.075),
    minSize: w * 0.05,
    maxLines: 3,
    align: "center",
  });
  y += h * 0.028;

  y = paragraphBlock(ctx, spec.subhead, pad, y, contentWidth, {
    size: w * (isStory ? 0.031 : 0.028),
    maxLines: 3,
    colour: "rgba(255,255,255,0.8)",
    align: "center",
  });

  const ruleY = Math.min(y + h * 0.035, ctaTop - h * 0.12);
  ctx.strokeStyle = hexToRgba(accent, 0.55);
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(centreX - w * 0.08, ruleY);
  ctx.lineTo(centreX + w * 0.08, ruleY);
  ctx.stroke();

  ctx.textAlign = "center";
  ctx.fillStyle = "rgba(255,255,255,0.94)";
  font(ctx, w * 0.027, 700);
  ctx.fillText(spec.brand.name, centreX, ruleY + h * 0.05);

  const cta = fitBlock(ctx, spec.cta, {
    maxWidth: contentWidth,
    maxLines: 2,
    startSize: w * 0.026,
    minSize: w * 0.018,
    weight: 500,
    family: BODY_FONT,
  });
  const ctaY = Math.min(ruleY + h * 0.14, ctaTop - h * 0.02);
  ctx.fillStyle = hexToRgba(accent, 0.95);
  drawLines(ctx, cta.lines, centreX, ctaY, cta.lineHeight, "center");
  ctx.textAlign = "left";
}

/**
 * Oversized, low-opacity brand mark that fills the free area of a tall story
 * card without competing with the copy.
 */
function watermark(
  ctx: Ctx,
  spec: FlyerSpec,
  logo: HTMLImageElement | null,
  top: number,
  bottom: number,
) {
  const available = bottom - top;
  if (available < 130) return;
  const size = Math.min(320, available * 0.8);
  const x = 1080 / 2 - size / 2;
  const y = top + (available - size) / 2;
  ctx.save();
  ctx.globalAlpha = 0.2;
  const radius = size * 0.24;
  roundedPath(ctx, x, y, size, size, radius);
  ctx.clip();
  if (logo) {
    ctx.drawImage(logo, x, y, size, size);
  } else {
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(x, y, size, size);
    ctx.fillStyle = "#0A1A30";
    font(ctx, size * 0.3, 800);
    ctx.textAlign = "center";
    ctx.fillText("NDH", 1080 / 2, y + size * 0.6);
    ctx.textAlign = "left";
  }
  ctx.restore();
}

function drawCtaPill(
  ctx: Ctx,
  label: string,
  x: number,
  y: number,
  minWidth: number,
  size: number,
  accent: string,
  accent2: string,
) {
  font(ctx, size, 700);
  const width = Math.max(minWidth, ctx.measureText(label).width + size * 3.2);
  const height = size * 2.6;
  const gradient = ctx.createLinearGradient(x, y, x + width, y + height);
  gradient.addColorStop(0, accent);
  gradient.addColorStop(1, accent2);
  fillRounded(ctx, x, y, width, height, height / 2, "#000");
  ctx.save();
  roundedPath(ctx, x, y, width, height, height / 2);
  ctx.clip();
  ctx.fillStyle = gradient;
  ctx.fillRect(x, y, width, height);
  ctx.restore();
  ctx.fillStyle = "#08111F";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(label, x + width / 2, y + height / 2 + size * 0.06);
  ctx.textAlign = "left";
  ctx.textBaseline = "alphabetic";
  return { width, height };
}

function paintFooter(ctx: Ctx, spec: FlyerSpec, w: number, h: number) {
  const pad = w * 0.066;
  const y = h - h * 0.105;
  ctx.strokeStyle = "rgba(255,255,255,0.16)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(pad, y);
  ctx.lineTo(w - pad, y);
  ctx.stroke();

  ctx.fillStyle = "rgba(255,255,255,0.86)";
  font(ctx, w * 0.026, 700);
  const host = spec.brand.url.replace(/^https?:\/\//, "").replace(/\/$/, "");
  ctx.fillText(host, pad, y + h * 0.045);

  ctx.textAlign = "right";
  ctx.fillStyle = hexToRgba(spec.brand.colors.accent, 0.95);
  font(ctx, w * 0.024, 600, BODY_FONT);
  ctx.fillText(spec.brand.handle, w - pad, y + h * 0.045);
  ctx.textAlign = "left";
}

/* ---------------------------------------------------------------- helpers */

function drawStar(ctx: Ctx, cx: number, cy: number, r: number, color: string) {
  ctx.save();
  ctx.fillStyle = color;
  ctx.beginPath();
  for (let i = 0; i < 8; i += 1) {
    const angle = (Math.PI / 4) * i;
    const radius = i % 2 === 0 ? r : r * 0.4;
    const x = cx + Math.cos(angle) * radius;
    const y = cy + Math.sin(angle) * radius;
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}
