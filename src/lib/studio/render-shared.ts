/** Shared canvas helpers for the flyer and motion renderers. */
import { STUDIO_LOGO_SRC } from "./kits";

export { STUDIO_LOGO_SRC };
export const HEADING_FONT = '"Space Grotesk", "Segoe UI", system-ui, sans-serif';
export const BODY_FONT = '"DM Sans", "Segoe UI", system-ui, sans-serif';

let logoPromise: Promise<HTMLImageElement | null> | null = null;

/** The official Open Gateway mark, loaded once per session. */
export function loadLogo(): Promise<HTMLImageElement | null> {
  if (typeof window === "undefined") return Promise.resolve(null);
  logoPromise ??= new Promise((resolve) => {
    const image = new Image();
    image.crossOrigin = "anonymous";
    image.onload = () => resolve(image);
    image.onerror = () => resolve(null);
    image.src = STUDIO_LOGO_SRC;
  });
  return logoPromise;
}

/** Canvas text needs the webfonts actually loaded, not just requested. */
export async function ensureFonts(): Promise<void> {
  if (typeof document === "undefined" || !("fonts" in document)) return;
  try {
    await Promise.all([
      document.fonts.load(`800 96px ${HEADING_FONT}`),
      document.fonts.load(`700 48px ${HEADING_FONT}`),
      document.fonts.load(`500 36px ${BODY_FONT}`),
      document.fonts.load(`600 32px ${BODY_FONT}`),
    ]);
  } catch {
    /* System fonts are an acceptable fallback for artwork. */
  }
}

export function hexToRgba(hex: string, alpha: number): string {
  const clean = hex.replace("#", "");
  const full =
    clean.length === 3
      ? clean
          .split("")
          .map((c) => c + c)
          .join("")
      : clean.padEnd(6, "0");
  const r = parseInt(full.slice(0, 2), 16);
  const g = parseInt(full.slice(2, 4), 16);
  const b = parseInt(full.slice(4, 6), 16);
  if ([r, g, b].some((value) => Number.isNaN(value))) return `rgba(255,255,255,${alpha})`;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
