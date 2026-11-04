/**
 * Parent brand configuration for NAJEEB DIGITAL HUB (NDH).
 *
 * One module holds the identity strings, the Open Gateway palette and the
 * public contact details so the website, the newsroom, the AI Content Studio
 * and the portals can never drift apart.
 *
 * Palette (owner-specified):
 *   deep navy   #0A1A30  — header, hero, dark bands
 *   porcelain   #F8FAFC  — page canvas
 *   crisp line  #E2E8F0  — white cards stay visible on porcelain
 *   gateway cyan/sky + iris accents
 */

export const BRAND = {
  legalName: "Najeeb Digital Hub",
  shortName: "NDH",
  displayName: "NAJEEB DIGITAL HUB",
  wordmark: { top: "NAJEEB", bottom: "DIGITAL HUB" },
  tagline: "One family. Many businesses.",
  positioning: "The Open Gateway to digital business in Africa.",
  domain: "ndhnet.com",
  url: "https://ndhnet.com",
  email: "contact@ndhnet.com",
  support: "support@ndhnet.com",
  address: "Marmaron Nufawa, Western Bye Pass, Sokoto, Nigeria",
  founded: 2021,
} as const;

/** The Open Gateway palette used by the site and by every generated asset. */
export const PALETTE = {
  navy: "#0A1A30",
  navySoft: "#122A4A",
  navyDeep: "#061223",
  porcelain: "#F8FAFC",
  white: "#FFFFFF",
  line: "#E2E8F0",
  ink: "#0A1A30",
  inkSoft: "#33425D",
  muted: "#5B6B85",
  sky: "#38BDF8",
  cyan: "#22D3EE",
  iris: "#6366F1",
  violet: "#A78BFA",
  emerald: "#10B981",
  amber: "#F59E0B",
  rose: "#F43F5E",
  whatsapp: "#25D366",
} as const;

export type BrandColor = keyof typeof PALETTE;

export function assetUrl(path: string): string {
  return `${BRAND.url}${path.startsWith("/") ? path : `/${path}`}`;
}

/** Absolute public URL for a site path, safe inside the browser and on the edge. */
export function siteUrl(path = "/"): string {
  return `${BRAND.url}${path}`;
}
