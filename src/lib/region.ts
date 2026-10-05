/**
 * Region awareness for the NDH ecosystem.
 *
 * There is deliberately no currency layer: the gateway is a parent-brand
 * landing page, so it shows no figures at all. Region is detected from the
 * browser timezone once, on the client, and travels with the Omni-Hub
 * consultant and the preference cookie so answers can be written for where the
 * visitor actually is — without asking them to configure anything.
 */

export type RegionId = "NG" | "AF" | "UK" | "EU" | "US" | "GLOBAL";

export type RegionOption = {
  id: RegionId;
  /** Plain-English name, used in consultant context and internal notes. */
  label: string;
  /** IANA timezone hints used for client-side auto-detection. */
  timezones: string[];
};

export const REGIONS: RegionOption[] = [
  { id: "NG", label: "Nigeria", timezones: ["Africa/Lagos"] },
  {
    id: "AF",
    label: "Africa (rest)",
    timezones: ["Africa/Accra", "Africa/Nairobi", "Africa/Johannesburg", "Africa/Cairo"],
  },
  { id: "UK", label: "United Kingdom", timezones: ["Europe/London"] },
  {
    id: "EU",
    label: "Europe",
    timezones: [
      "Europe/Paris",
      "Europe/Berlin",
      "Europe/Madrid",
      "Europe/Amsterdam",
      "Europe/Lisbon",
      "Europe/Rome",
    ],
  },
  {
    id: "US",
    label: "US & Canada",
    timezones: [
      "America/New_York",
      "America/Chicago",
      "America/Denver",
      "America/Los_Angeles",
      "America/Toronto",
    ],
  },
  { id: "GLOBAL", label: "Everywhere else", timezones: [] },
];

export const DEFAULT_REGION: RegionId = "NG";

/**
 * Best-effort region from the browser timezone. Client-only — call it from an
 * effect, never during render, so SSR output stays deterministic.
 */
export function detectRegion(timeZone: string | undefined): RegionId | null {
  if (!timeZone) return null;
  const match = REGIONS.find((region) => region.timezones.includes(timeZone));
  return match?.id ?? null;
}

export function regionLabel(id: RegionId): string {
  return REGIONS.find((region) => region.id === id)?.label ?? REGIONS[REGIONS.length - 1].label;
}
