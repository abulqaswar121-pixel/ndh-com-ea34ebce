/**
 * Studio brand kits.
 *
 * Picking a business in the Studio loads exactly these values: the colours the
 * flyer and motion card are painted with, the logo watermark, the public
 * address printed on the artwork and the hashtags used in captions.
 *
 * The parent brand kit mirrors `brand.ts`; the subsidiaries use the same deep
 * navy base with a sector accent so the family still reads as one company.
 */
import { BUSINESS_PROFILES } from "@/lib/business-profiles";
import { SUBSIDIARIES, type SubsidiaryId } from "@/lib/ecosystem";
import { BRAND } from "@/lib/brand";
import gatewayLogo from "@/assets/ndh-logo-gateway-cropped.png";

export type StudioBrandId = "parent" | SubsidiaryId | "other";

export type BrandKit = {
  id: StudioBrandId;
  name: string;
  /** Name printed on the artwork (no "NDH " prefix). */
  shortName: string;
  url: string;
  handle: string;
  tagline: string;
  audience: string;
  description: string;
  colors: {
    /** Deep base of the artwork. */
    bg: string;
    bg2: string;
    accent: string;
    accent2: string;
    /** Text on the base. */
    onBg: string;
    onBgSoft: string;
  };
  hashtags: string[];
  /** Voice guidance the copywriter follows. */
  voice: string;
  offerIdeas: string[];
};

const HASH_CORE = ["#NajeebDigitalHub", "#NDH", "#Nigeria", "#DigitalAfrica"];

function makeKit(args: {
  id: StudioBrandId;
  name: string;
  shortName: string;
  url: string;
  handle: string;
  tagline: string;
  audience: string;
  description: string;
  bg: string;
  bg2: string;
  accent: string;
  accent2: string;
  hashtags: string[];
  voice: string;
  offerIdeas: string[];
}): BrandKit {
  return {
    id: args.id,
    name: args.name,
    shortName: args.shortName,
    url: args.url,
    handle: args.handle,
    tagline: args.tagline,
    audience: args.audience,
    description: args.description,
    colors: {
      bg: args.bg,
      bg2: args.bg2,
      accent: args.accent,
      accent2: args.accent2,
      onBg: "#FFFFFF",
      onBgSoft: "rgba(255,255,255,0.74)",
    },
    hashtags: [...args.hashtags, ...HASH_CORE],
    voice: args.voice,
    offerIdeas: args.offerIdeas,
  };
}

export const PARENT_KIT = makeKit({
  id: "parent",
  name: "NDH Parent Brand",
  shortName: "Najeeb Digital Hub",
  url: BRAND.url,
  handle: "@njb_digital_hub",
  tagline: BRAND.tagline,
  audience: "Businesses, learners, investors and shoppers across Nigeria and Africa.",
  description:
    "NAJEEB DIGITAL HUB (NDH) is the parent of twelve digital businesses, five of them live today.",
  bg: "#0A1A30",
  bg2: "#152C63",
  accent: "#38BDF8",
  accent2: "#6366F1",
  hashtags: ["#OpenGateway", "#NDHTurnsIdeasIntoBusiness"],
  voice: "Authoritative, warm and plain-spoken. Speaks for the whole family, never oversells.",
  offerIdeas: [
    "One family of twelve businesses, five live today",
    "Pick the NDH platform that fits your goal",
    "From skills to storefronts to farm cycles",
  ],
});

const SUBSIDIARY_KITS: Record<SubsidiaryId, BrandKit> = {
  academy: makeKit({
    id: "academy",
    name: "NDH Academy",
    shortName: "NDH Academy",
    url: "https://ndhacademy.lovable.app",
    handle: "@ndhacademy",
    tagline: "Practical digital skills, certified.",
    audience: "Beginners, career switchers and professionals who want skills they can earn with.",
    description: BUSINESS_PROFILES.academy.role,
    bg: "#141033",
    bg2: "#39246B",
    accent: "#A78BFA",
    accent2: "#6366F1",
    hashtags: ["#NDHAcademy", "#DigitalSkills", "#LearnAndEarn", "#AIskills"],
    voice: "Encouraging tutor. Concrete outcomes, no hype: what you will be able to do.",
    offerIdeas: [
      "60 practical courses across 6 schools",
      "Learn a skill, build a capstone, get certified",
      "New cohort open — start this week",
    ],
  }),
  agency: makeKit({
    id: "agency",
    name: "NDH Agency",
    shortName: "NDH Agency",
    url: "https://agency.ndh.com.ng",
    handle: "@ndhagency",
    tagline: "Managed digital delivery.",
    audience: "Founders, SMEs and organisations buying websites, branding and automation.",
    description: BUSINESS_PROFILES.agency.role,
    bg: "#06182B",
    bg2: "#0E3A5C",
    accent: "#38BDF8",
    accent2: "#22D3EE",
    hashtags: ["#NDHAgency", "#WebEngineering", "#Branding", "#AIautomation"],
    voice: "Senior consultant. Specific about scope, delivery and quality control.",
    offerIdeas: [
      "A website that ships, not a folder of files",
      "Brand, build and automation under one PM",
      "Free scoping call this week",
    ],
  }),
  shopos: makeKit({
    id: "shopos",
    name: "NDH ShopOS",
    shortName: "NDH ShopOS",
    url: "https://ndhshopos.lovable.app",
    handle: "@ndhshopos",
    tagline: "Your shop, online in minutes.",
    audience: "Traders, boutiques, pharmacies and food vendors selling on WhatsApp today.",
    description: BUSINESS_PROFILES.shopos.role,
    bg: "#1C1206",
    bg2: "#4A2A08",
    accent: "#F59E0B",
    accent2: "#FB7185",
    hashtags: ["#NDHShopOS", "#OnlineStore", "#SmallBusiness", "#SellOnline"],
    voice: "Helpful shopkeeper. Focus on sales, orders and simple pricing.",
    offerIdeas: [
      "Own storefront from a low monthly plan",
      "Payments and orders in one dashboard",
      "Launch your shop before the weekend",
    ],
  }),
  schoolos: makeKit({
    id: "schoolos",
    name: "NDH SchoolOS",
    shortName: "NDH SchoolOS",
    url: "https://ndhschoolos.lovable.app",
    handle: "@ndhschoolos",
    tagline: "Run the whole school from one platform.",
    audience: "School owners, principals, bursars and administrators.",
    description: BUSINESS_PROFILES.schoolos.role,
    bg: "#04212B",
    bg2: "#0A4553",
    accent: "#22D3EE",
    accent2: "#10B981",
    hashtags: ["#NDHSchoolOS", "#SchoolManagement", "#Tahfeez", "#Education"],
    voice: "Calm administrator. Emphasises accuracy of records, fees and results.",
    offerIdeas: [
      "Results, fees and payroll in one system",
      "Conventional + tahfeez in one record",
      "Term start is easier with SchoolOS",
    ],
  }),
  farmfund: makeKit({
    id: "farmfund",
    name: "NDH FarmFund",
    shortName: "NDH FarmFund",
    url: "https://ndhfarmfund.lovable.app",
    handle: "@ndhfarmfund",
    tagline: "Fund verified cycles. Share the harvest.",
    audience: "Investors looking beyond paper assets and farm operators seeking funding.",
    description: BUSINESS_PROFILES.farmfund.role,
    bg: "#04211A",
    bg2: "#0B4534",
    accent: "#34D399",
    accent2: "#A3E635",
    hashtags: ["#NDHFarmFund", "#AgriInvestment", "#FarmCycle", "#Harvest"],
    voice: "Transparent steward. Always names the risk, never promises a return.",
    offerIdeas: [
      "Verified cycles with operator tracking",
      "Equity calculated from a shared ledger",
      "Payouts at harvest, in proportion to equity",
    ],
  }),
  mall: makeKit({
    id: "mall",
    name: "NDH Mall",
    shortName: "NDH Mall",
    url: "https://ndhnet.com/businesses/mall",
    handle: "@ndhmall",
    tagline: "One trusted mall.",
    audience: "Everyday shoppers and vendors who want reach.",
    description: BUSINESS_PROFILES.mall.role,
    bg: "#24060F",
    bg2: "#5A1226",
    accent: "#F43F5E",
    accent2: "#F59E0B",
    hashtags: ["#NDHMall", "#Shopping", "#VendorAffiliate"],
    voice: "Bright retail host. Short, cheerful, offer-led.",
    offerIdeas: [
      "Vendor affiliate programme opening",
      "Direct retail from NDH",
      "One checkout, one promise",
    ],
  }),
  cloud: makeKit({
    id: "cloud",
    name: "NDH Cloud",
    shortName: "NDH Cloud",
    url: "https://ndhnet.com/businesses/cloud",
    handle: "@ndhcloud",
    tagline: "Software, AI and hosting.",
    audience: "Businesses that need AI services, APIs and business software.",
    description: BUSINESS_PROFILES.cloud.role,
    bg: "#070F26",
    bg2: "#1B2559",
    accent: "#38BDF8",
    accent2: "#8B5CF6",
    hashtags: ["#NDHCloud", "#AIServices", "#APIhosting", "#Automation"],
    voice: "Technical but clear. Names the capability, not the jargon.",
    offerIdeas: [
      "AI services without a data team",
      "API hosting that scales",
      "Business automation, installed",
    ],
  }),
  express: makeKit({
    id: "express",
    name: "NDH Express",
    shortName: "NDH Express",
    url: "https://ndhnet.com/businesses/express",
    handle: "@ndhexpress",
    tagline: "Dispatch that keeps a promise.",
    audience: "Merchants, sellers and families sending parcels locally.",
    description: BUSINESS_PROFILES.express.role,
    bg: "#1B1206",
    bg2: "#4C3108",
    accent: "#FBBF24",
    accent2: "#38BDF8",
    hashtags: ["#NDHExpress", "#Logistics", "#Delivery", "#Dispatch"],
    voice: "Brisk operations voice. Time promises and tracking.",
    offerIdeas: [
      "Same-city dispatch",
      "Tracking from pickup to doorstep",
      "Built for Mall and ShopOS sellers",
    ],
  }),
  pay: makeKit({
    id: "pay",
    name: "NDH Pay",
    shortName: "NDH Pay",
    url: "https://ndhnet.com/businesses/pay",
    handle: "@ndhpay",
    tagline: "Payments that settle cleanly.",
    audience: "Merchants, platforms and buyers who need safe payment.",
    description: BUSINESS_PROFILES.pay.role,
    bg: "#120A26",
    bg2: "#2E1B5E",
    accent: "#8B5CF6",
    accent2: "#22D3EE",
    hashtags: ["#NDHPay", "#Payments", "#MerchantPayouts", "#Billing"],
    voice: "Trustworthy finance voice. Compliance, settlement, clarity.",
    offerIdeas: [
      "Checkout, billing and payouts",
      "Buyer-protection escrow",
      "One account for the whole family",
    ],
  }),
  travel: makeKit({
    id: "travel",
    name: "NDH Travel",
    shortName: "NDH Travel",
    url: "https://ndhnet.com/businesses/travel",
    handle: "@ndhtravel",
    tagline: "Book it properly.",
    audience: "Travellers, pilgrims and families planning trips.",
    description: BUSINESS_PROFILES.travel.role,
    bg: "#06202B",
    bg2: "#0B4A5E",
    accent: "#22D3EE",
    accent2: "#FBBF24",
    hashtags: ["#NDHTravel", "#Flights", "#HolidayPackages", "#Umrah"],
    voice: "Friendly travel consultant. Reassuring, specific, no fake discounts.",
    offerIdeas: [
      "Flights booked by real consultants",
      "Holiday packages for families",
      "Hajj and Umrah guidance",
    ],
  }),
  health: makeKit({
    id: "health",
    name: "NDH Health",
    shortName: "NDH Health",
    url: "https://ndhnet.com/businesses/health",
    handle: "@ndhhealth",
    tagline: "Care that reaches you.",
    audience: "Clinics, hospitals and patients.",
    description: BUSINESS_PROFILES.health.role,
    bg: "#081C1A",
    bg2: "#0C3A36",
    accent: "#10B981",
    accent2: "#FB7185",
    hashtags: ["#NDHHealth", "#Telemedicine", "#HealthRecords"],
    voice: "Considered clinical voice. Never promises outcomes, always explains access.",
    offerIdeas: [
      "Telemedicine consultations",
      "Clinic bookings without queues",
      "Digital health records",
    ],
  }),
  foundation: makeKit({
    id: "foundation",
    name: "NDH Foundation",
    shortName: "NDH Foundation",
    url: "https://ndhnet.com/businesses/foundation",
    handle: "@ndhfoundation",
    tagline: "Skills for the next generation.",
    audience: "Young people, schools, donors and community partners.",
    description: BUSINESS_PROFILES.foundation.role,
    bg: "#04211A",
    bg2: "#0B4A3A",
    accent: "#14B8A6",
    accent2: "#FBBF24",
    hashtags: ["#NDHFoundation", "#TechScholarships", "#YouthImpact"],
    voice: "Sincere and dignified. Talks about people, never about pity.",
    offerIdeas: [
      "Tech scholarships open",
      "Free digital-skills training",
      "Partner with the foundation",
    ],
  }),
};

export const OTHER_KIT = makeKit({
  id: "other",
  name: "NDH Mall / Cloud / Other",
  shortName: "NDH",
  url: BRAND.url,
  handle: "@njb_digital_hub",
  tagline: "Part of the NDH family.",
  audience: "Anyone in the NDH ecosystem.",
  description: "A general NDH post for a platform or announcement outside the main kits.",
  bg: "#0A1A30",
  bg2: "#1E2A6B",
  accent: "#7DD3FC",
  accent2: "#C4B5FD",
  hashtags: ["#NDHFamily"],
  voice: "Neutral parent-brand voice.",
  offerIdeas: ["Something new from NDH", "One family, many businesses"],
});

export const STUDIO_KITS: BrandKit[] = [
  PARENT_KIT,
  ...SUBSIDIARIES.map((s) => SUBSIDIARY_KITS[s.id]),
  OTHER_KIT,
];

export function getKit(id: StudioBrandId): BrandKit {
  if (id === "parent") return PARENT_KIT;
  if (id === "other") return OTHER_KIT;
  return SUBSIDIARY_KITS[id] ?? PARENT_KIT;
}

/** The official Open Gateway mark, used as the watermark on every asset. */
export const STUDIO_LOGO_SRC: string = gatewayLogo;
