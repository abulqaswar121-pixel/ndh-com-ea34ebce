/**
 * Single source of truth for the NDH family of businesses.
 *
 * The parent gateway (src/routes/index.tsx), the business directory, the
 * newsroom, the AI Content Studio and the Omni-Hub consultant all read from
 * this module, so a new subsidiary only has to be described once.
 *
 * Everything here is plain data with no browser APIs, so it is safe to import
 * at module scope on the Cloudflare Workers edge runtime.
 *
 * Status vocabulary (owner-confirmed):
 *   live    → "Active Product"      — launched and open today
 *   coming  → "In Development"      — being built, no onboarding yet
 */
import {
  BookOpen,
  BriefcaseBusiness,
  Cloud,
  CreditCard,
  HandHeart,
  HeartPulse,
  Plane,
  School,
  ShoppingBag,
  Sprout,
  Store,
  Truck,
  type LucideIcon,
} from "lucide-react";

/* ------------------------------------------------------------------ *
 * Categories — drive the interactive directory filter
 * ------------------------------------------------------------------ */

export type CategoryId = "enterprise" | "education" | "agriculture" | "commerce" | "infrastructure";

export const ECOSYSTEM_CATEGORIES: {
  id: CategoryId;
  label: string;
  icon: LucideIcon;
  tone: "sky" | "iris" | "violet" | "cyan";
}[] = [
  { id: "enterprise", label: "Enterprise & technology", icon: BriefcaseBusiness, tone: "sky" },
  { id: "education", label: "Education & talent", icon: BookOpen, tone: "iris" },
  { id: "agriculture", label: "Agriculture & investment", icon: Sprout, tone: "violet" },
  { id: "commerce", label: "Commerce & retail", icon: ShoppingBag, tone: "sky" },
  { id: "infrastructure", label: "Infrastructure & services", icon: School, tone: "cyan" },
];

/* ------------------------------------------------------------------ *
 * Subsidiaries
 * ------------------------------------------------------------------ */

export type SubsidiaryId =
  | "academy"
  | "agency"
  | "shopos"
  | "schoolos"
  | "farmfund"
  | "mall"
  | "cloud"
  | "express"
  | "pay"
  | "travel"
  | "health"
  | "foundation";

/** `live` is launched and public; `coming` is still being built. */
export type LaunchState = "live" | "coming";

export type Subsidiary = {
  id: SubsidiaryId;
  /** Sector icon integrated into the corner of the Open Gateway tile. */
  icon: LucideIcon;
  accent: "sky" | "iris" | "violet" | "cyan" | "amber" | "rose" | "emerald";
  state: LaunchState;
  categories: CategoryId[];
  /** Canonical address shown on the business profile page. */
  domain: string;
  /** Live destination. Empty while a business is still in development. */
  href: string;
  /** True when `href` leaves ndhnet.com. */
  external: boolean;
};

/** Owner-confirmed launch destinations. Do not rewrite these. */
const LIVE_URLS = {
  academy: "https://ndhacademy.lovable.app",
  agency: "https://agency.ndh.com.ng",
  shopos: "https://ndhshopos.lovable.app",
  schoolos: "https://ndhschoolos.lovable.app",
  farmfund: "https://ndhfarmfund.lovable.app",
} as const;

export const SUBSIDIARIES: Subsidiary[] = [
  {
    id: "academy",
    icon: BookOpen,
    accent: "iris",
    state: "live",
    categories: ["education"],
    domain: "ndhacademy.lovable.app",
    href: LIVE_URLS.academy,
    external: true,
  },
  {
    id: "agency",
    icon: BriefcaseBusiness,
    accent: "sky",
    state: "live",
    categories: ["enterprise"],
    domain: "agency.ndh.com.ng",
    href: LIVE_URLS.agency,
    external: true,
  },
  {
    id: "shopos",
    icon: ShoppingBag,
    accent: "amber",
    state: "live",
    categories: ["commerce"],
    domain: "ndhshopos.lovable.app",
    href: LIVE_URLS.shopos,
    external: true,
  },
  {
    id: "schoolos",
    icon: School,
    accent: "cyan",
    state: "live",
    categories: ["education", "infrastructure"],
    domain: "ndhschoolos.lovable.app",
    href: LIVE_URLS.schoolos,
    external: true,
  },
  {
    id: "farmfund",
    icon: Sprout,
    accent: "emerald",
    state: "live",
    categories: ["agriculture"],
    domain: "ndhfarmfund.lovable.app",
    href: LIVE_URLS.farmfund,
    external: true,
  },
  {
    id: "mall",
    icon: Store,
    accent: "rose",
    state: "coming",
    categories: ["commerce"],
    domain: "mall.ndhnet.com",
    href: "",
    external: false,
  },
  {
    id: "cloud",
    icon: Cloud,
    accent: "sky",
    state: "coming",
    categories: ["enterprise"],
    domain: "cloud.ndhnet.com",
    href: "",
    external: false,
  },
  {
    id: "express",
    icon: Truck,
    accent: "amber",
    state: "coming",
    categories: ["commerce", "infrastructure"],
    domain: "express.ndhnet.com",
    href: "",
    external: false,
  },
  {
    id: "pay",
    icon: CreditCard,
    accent: "violet",
    state: "coming",
    categories: ["enterprise"],
    domain: "pay.ndhnet.com",
    href: "",
    external: false,
  },
  {
    id: "travel",
    icon: Plane,
    accent: "cyan",
    state: "coming",
    categories: ["infrastructure"],
    domain: "travel.ndhnet.com",
    href: "",
    external: false,
  },
  {
    id: "health",
    icon: HeartPulse,
    accent: "rose",
    state: "coming",
    categories: ["infrastructure"],
    domain: "health.ndhnet.com",
    href: "",
    external: false,
  },
  {
    id: "foundation",
    icon: HandHeart,
    accent: "emerald",
    state: "coming",
    categories: ["education"],
    domain: "foundation.ndhnet.com",
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

export const LIVE_SUBSIDIARIES = SUBSIDIARIES.filter((s) => s.state === "live");
export const COMING_SUBSIDIARIES = SUBSIDIARIES.filter((s) => s.state === "coming");

export const LIVE_SUBSIDIARY_COUNT = LIVE_SUBSIDIARIES.length;
export const COMING_SUBSIDIARY_COUNT = COMING_SUBSIDIARIES.length;

export const STATE_LABEL: Record<LaunchState, string> = {
  live: "Active Product",
  coming: "In Development",
};

export const STATE_ACTION: Record<LaunchState, string> = {
  live: "Launch Platform",
  coming: "Read Overview",
};

/** A destination is only actionable when the business is live. */
export function subsidiaryHref(subsidiary: Subsidiary): string {
  return subsidiary.state === "coming" ? "" : subsidiary.href;
}

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
