/**
 * Single source of truth for the NDH family of businesses.
 *
 * The parent gateway (src/routes/index.tsx), the universal app-switcher and the
 * Omni-Hub AI consultant all read from this module so a new subsidiary only has
 * to be described once. Everything here is plain data with no browser APIs, so
 * it is safe to import at module scope on the Cloudflare Workers edge runtime.
 */
import {
  BookOpen,
  BriefcaseBusiness,
  HeartPulse,
  Plane,
  School,
  ShoppingBag,
  Sprout,
  type LucideIcon,
} from "lucide-react";

/* ------------------------------------------------------------------ *
 * Categories — drive the interactive gateway filter
 * ------------------------------------------------------------------ */

export type CategoryId = "enterprise" | "education" | "agriculture" | "commerce" | "infrastructure";

export const ECOSYSTEM_CATEGORIES: {
  id: CategoryId;
  icon: LucideIcon;
  tone: "sky" | "iris" | "violet" | "cyan";
}[] = [
  { id: "enterprise", icon: BriefcaseBusiness, tone: "sky" },
  { id: "education", icon: BookOpen, tone: "iris" },
  { id: "agriculture", icon: Sprout, tone: "violet" },
  { id: "commerce", icon: ShoppingBag, tone: "sky" },
  { id: "infrastructure", icon: School, tone: "cyan" },
];

/* ------------------------------------------------------------------ *
 * Subsidiaries
 * ------------------------------------------------------------------ */

export type SubsidiaryId =
  "agency" | "academy" | "agricapital" | "estore" | "schooldesk" | "travel" | "ihospital";

/** `live` is launched and public, `preview` is a working pre-launch build. */
export type LaunchState = "live" | "preview" | "coming";

export type Subsidiary = {
  id: SubsidiaryId;
  /** Sector icon integrated into the bottom-right corner of the Open Gateway tile. */
  icon: LucideIcon;
  accent: "sky" | "iris" | "violet" | "cyan" | "amber" | "rose" | "emerald";
  state: LaunchState;
  categories: CategoryId[];
  /** Canonical production subdomain. */
  domain: string;
  /** Working pre-launch build, when one exists. */
  previewUrl: string | null;
  /** Where a click should land today. */
  href: string;
  /** True when `href` leaves ndh.com.ng. */
  external: boolean;
};

export const SUBSIDIARIES: Subsidiary[] = [
  {
    id: "agency",
    icon: BriefcaseBusiness,
    accent: "sky",
    state: "live",
    categories: ["enterprise"],
    domain: "agency.ndh.com.ng",
    previewUrl: "https://ndhagency.lovable.app",
    href: "https://agency.ndh.com.ng",
    external: true,
  },
  {
    id: "academy",
    icon: BookOpen,
    accent: "iris",
    state: "live",
    categories: ["education"],
    domain: "academy.ndh.com.ng",
    previewUrl: "https://ndhacademy.lovable.app",
    href: "https://academy.ndh.com.ng",
    external: true,
  },
  {
    id: "agricapital",
    icon: Sprout,
    accent: "emerald",
    state: "live",
    categories: ["agriculture"],
    domain: "venture.ndh.com.ng",
    previewUrl: "https://ndhventure.lovable.app",
    href: "https://ndhventure.lovable.app",
    external: true,
  },
  {
    id: "estore",
    icon: ShoppingBag,
    accent: "amber",
    state: "live",
    categories: ["commerce"],
    domain: "estore.ndh.com.ng",
    previewUrl: "https://ndhestore.lovable.app",
    href: "https://estore.ndh.com.ng",
    external: true,
  },
  {
    id: "schooldesk",
    icon: School,
    accent: "cyan",
    state: "coming",
    categories: ["infrastructure"],
    domain: "schooldesk.ndh.com.ng",
    previewUrl: null,
    href: "",
    external: false,
  },
  {
    id: "travel",
    icon: Plane,
    accent: "emerald",
    state: "coming",
    categories: ["infrastructure"],
    domain: "travel.ndh.com.ng",
    previewUrl: null,
    href: "",
    external: false,
  },
  {
    id: "ihospital",
    icon: HeartPulse,
    accent: "rose",
    state: "coming",
    categories: ["infrastructure"],
    domain: "ihospital.ndh.com.ng",
    previewUrl: null,
    href: "",
    external: false,
  },
];

export function getSubsidiary(id: SubsidiaryId): Subsidiary {
  const found = SUBSIDIARIES.find((item) => item.id === id);
  if (!found) throw new Error(`Unknown NDH subsidiary: ${id}`);
  return found;
}

export function filterSubsidiaries(category: CategoryId | "all"): Subsidiary[] {
  if (category === "all") return SUBSIDIARIES;
  return SUBSIDIARIES.filter((item) => item.categories.includes(category));
}

export const LIVE_SUBSIDIARY_COUNT = SUBSIDIARIES.filter((s) => s.state === "live").length;

/** A destination is only actionable when the business is available.
 * AgriCapital retains the previously supplied deployment link until the owner
 * confirms its renamed domain. Do not fabricate agricapital.ndh.com.ng.
 */
export function subsidiaryHref(subsidiary: Subsidiary): string {
  return subsidiary.state === "coming" ? "" : subsidiary.href;
}

export const COMING_SUBSIDIARY_COUNT = SUBSIDIARIES.filter((s) => s.state === "coming").length;

export { ACADEMY_SNAPSHOT, ACADEMY_SCHOOLS } from "./business-profiles";
import { ACADEMY_SNAPSHOT, AGENCY_SNAPSHOT } from "./business-profiles";

export type MetricId =
  "businesses" | "liveBusinesses" | "comingBusinesses" | "courses" | "schools" | "departments";
export type Metric = { id: MetricId; value: number; suffix: string; precision?: number };

/** Owner-confirmed scope counts, NOT analytics or live uptime telemetry. */
export const ECOSYSTEM_METRICS: Metric[] = [
  { id: "businesses", value: SUBSIDIARIES.length, suffix: "" },
  { id: "liveBusinesses", value: LIVE_SUBSIDIARY_COUNT, suffix: "" },
  { id: "comingBusinesses", value: COMING_SUBSIDIARY_COUNT, suffix: "" },
  { id: "courses", value: ACADEMY_SNAPSHOT.courses, suffix: "" },
  { id: "schools", value: ACADEMY_SNAPSHOT.schools, suffix: "" },
  { id: "departments", value: AGENCY_SNAPSHOT.departments, suffix: "" },
];
