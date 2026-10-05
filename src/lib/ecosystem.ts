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
  TrendingUp,
  type LucideIcon,
} from "lucide-react";

/* ------------------------------------------------------------------ *
 * Categories — drive the interactive gateway filter
 * ------------------------------------------------------------------ */

export type CategoryId = "enterprise" | "education" | "ventures" | "infrastructure";

export const ECOSYSTEM_CATEGORIES: {
  id: CategoryId;
  icon: LucideIcon;
  tone: "sky" | "iris" | "violet" | "cyan";
}[] = [
  { id: "enterprise", icon: BriefcaseBusiness, tone: "sky" },
  { id: "education", icon: BookOpen, tone: "iris" },
  { id: "ventures", icon: TrendingUp, tone: "violet" },
  { id: "infrastructure", icon: School, tone: "cyan" },
];

/* ------------------------------------------------------------------ *
 * Subsidiaries
 * ------------------------------------------------------------------ */

export type SubsidiaryId =
  "agency" | "academy" | "venture" | "estore" | "schooldesk" | "travel" | "ihospital";

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
    href: "/agency",
    external: false,
  },
  {
    id: "academy",
    icon: BookOpen,
    accent: "iris",
    state: "live",
    categories: ["education"],
    domain: "academy.ndh.com.ng",
    previewUrl: "https://ndhacademy.lovable.app",
    href: "/academy",
    external: false,
  },
  {
    id: "venture",
    icon: TrendingUp,
    accent: "violet",
    state: "live",
    categories: ["ventures", "enterprise"],
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
    categories: ["ventures"],
    domain: "estore.ndh.com.ng",
    previewUrl: "https://ndhestore.lovable.app",
    href: "https://ndhestore.lovable.app",
    external: true,
  },
  {
    id: "schooldesk",
    icon: School,
    accent: "cyan",
    state: "live",
    categories: ["infrastructure", "education"],
    domain: "schooldesk.ndh.com.ng",
    previewUrl: "https://ndhschooldesk.lovable.app",
    href: "https://ndhschooldesk.lovable.app",
    external: true,
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

/* ------------------------------------------------------------------ *
 * Live status bar metrics
 *
 * Figures mirror the values the business already publishes (homepage_stats
 * seed, Academy catalogue and network coverage). Update this single object to
 * keep every surface in sync — the gateway, the AI consultant and the JSON-LD
 * block all read from here.
 * ------------------------------------------------------------------ */

export type MetricId =
  | "tasksDelivered"
  | "specialists"
  | "graduates"
  | "activeProjects"
  | "countriesServed"
  | "platformUptime"
  | "clientSatisfaction";

export type Metric = {
  id: MetricId;
  value: number;
  suffix: string;
  /** Decimal places to render — uptime keeps one decimal. */
  precision?: number;
};

export const ECOSYSTEM_METRICS: Metric[] = [
  { id: "tasksDelivered", value: 1247, suffix: "+" },
  { id: "specialists", value: 86, suffix: "+" },
  { id: "graduates", value: 195, suffix: "+" },
  { id: "activeProjects", value: 24, suffix: "" },
  { id: "countriesServed", value: 6, suffix: "" },
  { id: "clientSatisfaction", value: 98, suffix: "%" },
  { id: "platformUptime", value: 99.9, suffix: "%", precision: 1 },
];

/** Where the family's work reaches — shown as a pill list under the status bar. */
export const NETWORK_COUNTRIES = [
  "Nigeria",
  "Ghana",
  "Kenya",
  "United Kingdom",
  "Saudi Arabia",
  "United States",
];

export const NETWORK_FLAGS = ["🇳🇬", "🇬🇭", "🇰🇪", "🇬🇧", "🇸🇦", "🇺🇸"];

/* ------------------------------------------------------------------ *
 * Academy snapshot — used by the gateway and the AI consultant
 * ------------------------------------------------------------------ */

export const ACADEMY_SNAPSHOT = {
  courses: 30,
  lessons: 195,
  schools: 6,
  passMark: 70,
  quizQuestions: 8,
} as const;

