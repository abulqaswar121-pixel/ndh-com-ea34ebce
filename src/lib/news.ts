/**
 * Public newsroom catalogue.
 *
 * `NEWS_POSTS` holds the official announcements that ship with the site. The
 * /news routes merge this list with anything admins publish from the Studio's
 * Newsroom tab (stored in the `posts` table under the NDH Newsroom author), so
 * the feed keeps working even when the content service is unavailable.
 *
 * Dates here are editorial publication dates. Admins can edit or replace them
 * from the Studio without touching this file.
 */
import type { SubsidiaryId } from "./ecosystem";

/** Author tag that marks a `posts` row as a newsroom announcement. */
export const NEWSROOM_AUTHOR = "NDH Newsroom";

export type NewsCategory =
  "Product launch" | "Platform update" | "Ecosystem" | "Company" | "Studio";

export type NewsBlock = {
  heading?: string;
  paragraphs?: string[];
  bullets?: string[];
};

export type NewsPost = {
  slug: string;
  title: string;
  excerpt: string;
  category: NewsCategory;
  /** ISO date, publication day. */
  publishedAt: string;
  /** Short badge shown on the card, e.g. "Live now". */
  badge: string;
  businessId?: SubsidiaryId;
  cover?: string;
  coverAlt?: string;
  blocks: NewsBlock[];
  /** Authored in the admin Studio rather than seeded in code. */
  editorial?: boolean;
};

const COVERS = {
  hub: "/images/ndh-hero-960.webp",
  academy: "/images/ndh-academy-960.webp",
  agency: "/images/ndh-agency-work-960.webp",
} as const;

export const NEWS_POSTS: NewsPost[] = [
  {
    slug: "five-ndh-platforms-are-live",
    title: "Five NDH platforms are now live — and open to everyone",
    excerpt:
      "Academy, Agency, ShopOS, SchoolOS and FarmFund are out of preview and serving customers today. Here is what each one does and where to start.",
    category: "Ecosystem",
    publishedAt: "2026-10-05",
    badge: "Live now",
    cover: COVERS.hub,
    coverAlt: "The NDH open gateway identity over a dark navy backdrop",
    blocks: [
      {
        paragraphs: [
          "The NDH family is no longer a roadmap. Five platforms are live today, each with its own product team, support channel and public address under the NDH name.",
          "Every platform shares the same standard: written scope before money changes hands, real people answering questions, and public proof of the work.",
        ],
      },
      {
        heading: "What is live today",
        bullets: [
          "NDH Academy — tech, digital skills and certified professional training.",
          "NDH Agency — managed digital services, web engineering, branding and project talent.",
          "NDH ShopOS — cloud online store builder on low monthly or yearly plans.",
          "NDH SchoolOS — the complete operating system for modern schools and colleges.",
          "NDH FarmFund — agricultural investment with verified cycles and operator tracking.",
        ],
      },
      {
        heading: "What comes next",
        paragraphs: [
          "Seven more platforms are in active development: Mall, Cloud, Express, Pay, Travel, Health and Foundation. They are listed on the business directory with an In Development badge until they open — no waiting lists that imply a date we cannot keep.",
        ],
      },
    ],
  },
  {
    slug: "schoolos-operating-system-for-modern-schools",
    title: "NDH SchoolOS is now a complete operating system for modern schools and colleges",
    excerpt:
      "Admissions, CA and exams, auto-graded report cards, fees and receipts in naira, staff payroll and a parent portal — without a single spreadsheet.",
    category: "Product launch",
    publishedAt: "2026-10-14",
    badge: "New release",
    businessId: "schoolos",
    cover: COVERS.academy,
    coverAlt: "A school library and study space",
    blocks: [
      {
        paragraphs: [
          "NDH SchoolOS is now a complete operating system for modern schools and colleges. One platform runs the whole academic year: student admissions, continuous assessment (CA and exams), auto-graded report cards, school fees and receipts in naira, staff payroll and a parent portal.",
          "It is built for every kind of school — nursery, primary, secondary and colleges — and it is available today at ndhschoolos.lovable.app.",
        ],
      },
      {
        heading: "Inside the release",
        bullets: [
          "Admissions and records: students, guardians, classes and sections in one register.",
          "CA and exams: continuous assessment and exam scores recorded once and tallied automatically.",
          "Auto-graded report cards and instant broadsheets, generated the moment scores are in.",
          "Fees and receipts in naira, with fee-debt tracking and payment reminders for each family.",
          "Staff payroll: records, allowances and salary runs beside the academics they support.",
          "Parent portal: results, fees and notices, with SMS and WhatsApp alerts.",
        ],
      },
      {
        heading: "Zero spreadsheet headaches",
        paragraphs: [
          "Most schools still stitch term results together in spreadsheets, chase fee balances in notebooks and print report cards by hand. SchoolOS removes that work: scores are entered once, report cards grade themselves, broadsheets are ready instantly, and outstanding fees follow each family instead of getting lost in a register.",
          "When something needs a parent's attention, the portal carries it — and SMS and WhatsApp notices reach guardians who are not logged in.",
        ],
      },
      {
        heading: "Built for how schools actually name things",
        paragraphs: [
          "Schools define their own class names, sections and subjects during setup. Nothing is forced into a fixed template, and staff can export records whenever they need them.",
        ],
      },
    ],
  },
  {
    slug: "shopos-cloud-store-builder",
    title: "NDH ShopOS opens cloud storefronts to small businesses",
    excerpt:
      "A custom online shop with payments, orders and marketing tools — on low monthly or yearly plans, with no developer required.",
    category: "Product launch",
    publishedAt: "2026-10-21",
    badge: "Live now",
    businessId: "shopos",
    cover: COVERS.agency,
    coverAlt: "A small business owner working on a laptop",
    blocks: [
      {
        paragraphs: [
          "ShopOS is for the trader, the boutique, the pharmacy and the food vendor who has customers on WhatsApp and nowhere to send them. Create a shop, add products, connect payments and take orders from one dashboard.",
          "Pricing stays on the low monthly or yearly plans — no commission surprises, no developer retainer.",
        ],
      },
      {
        heading: "What a ShopOS shop includes",
        bullets: [
          "A branded storefront with categories and product pages.",
          "Checkout with payment collection and order tracking.",
          "Discounts, campaigns and a customer list you own.",
          "A dashboard that works on a phone, not just a laptop.",
        ],
      },
    ],
  },
  {
    slug: "farmfund-cycle-tracking-and-harvest-payouts",
    title: "How NDH FarmFund tracks a cycle and shares the harvest",
    excerpt:
      "Verified cycles, an open contribution ledger, operator expense logs and proportional payouts at harvest — the mechanics behind FarmFund.",
    category: "Platform update",
    publishedAt: "2026-10-27",
    badge: "Explainer",
    businessId: "farmfund",
    cover: COVERS.hub,
    coverAlt: "Farmland at golden hour",
    blocks: [
      {
        paragraphs: [
          "FarmFund connects investors with verified farming cycles. The important part is not the promise, it is the record: every contribution builds a shared ledger, and every naira spent by the operator is logged against the cycle.",
        ],
      },
      {
        heading: "The cycle, step by step",
        bullets: [
          "Verification: the farm, operator and cycle plan are checked before funding opens.",
          "Funding: investors contribute and their equity share is calculated from the ledger.",
          "Operations: the operator logs feeding, growth milestones and expenses.",
          "Harvest: produce is sold, the cycle is closed and profit is distributed by equity share.",
        ],
      },
      {
        heading: "Farming is not risk-free",
        paragraphs: [
          "Drought, disease and market prices are real. FarmFund shows the cycle history and operator record so investors can judge the risk before they commit — never after.",
        ],
      },
    ],
  },
  {
    slug: "academy-agency-one-path-from-learning-to-work",
    title: "From learning to real work: how NDH Academy and NDH Agency connect",
    excerpt:
      "Learners finish Academy courses with a verifiable certificate, and businesses get finished projects from Agency. Here is how the two work side by side.",
    category: "Ecosystem",
    publishedAt: "2026-11-03",
    badge: "Explainer",
    businessId: "academy",
    cover: COVERS.academy,
    coverAlt: "Learners working together in a bright study space",
    blocks: [
      {
        paragraphs: [
          "NDH Academy teaches practical tech and digital skills across six schools, from AI Engineering to Business & Operations. Every course ends with a real project and a certificate anyone can check online.",
          "NDH Agency delivers web, brand, automation and growth projects for businesses, with one project manager responsible for scope, timeline and quality.",
        ],
      },
      {
        heading: "What this means for you",
        bullets: [
          "Learners: build skills on real projects and show proof employers can verify.",
          "Businesses: get finished work under one agreement, not a folder of loose files.",
          "Everyone: one family, one standard of clear scope and honest communication.",
        ],
      },
    ],
  },
  {
    slug: "seven-platforms-in-development",
    title: "Mall, Cloud, Express, Pay, Travel, Health and Foundation: in development",
    excerpt:
      "Seven platforms remain under construction. Here is the scope we have committed to, and why we are not announcing launch dates yet.",
    category: "Company",
    publishedAt: "2026-11-04",
    badge: "Roadmap",
    cover: COVERS.hub,
    coverAlt: "A night city skyline with digital light trails",
    blocks: [
      {
        paragraphs: [
          "The remaining NDH platforms cover consumer retail, software and AI services, logistics, payments, travel, healthcare and community impact. Each one is being built to plug into the platforms that are already live.",
        ],
      },
      {
        heading: "The committed scope",
        bullets: [
          "NDH Mall — consumer shopping, vendor affiliate platform and direct product retail.",
          "NDH Cloud — software, AI services, API hosting and business automation tools.",
          "NDH Express — logistics, local parcel dispatch and a delivery network.",
          "NDH Pay — payment processing, billing and merchant payouts.",
          "NDH Travel — travel booking, flight reservations and holiday packages.",
          "NDH Health — telemedicine, clinic bookings and digital health records.",
          "NDH Foundation — non-profit initiatives, tech scholarships and youth impact.",
        ],
      },
      {
        heading: "Why no launch dates",
        paragraphs: [
          "A date we cannot keep is worse than no date. Each platform appears on the directory as In Development until it is genuinely usable, then it is announced here in the newsroom on the day it opens.",
        ],
      },
    ],
  },
];

export function newsPost(slug: string): NewsPost | undefined {
  return NEWS_POSTS.find((post) => post.slug === slug);
}

export function formatNewsDate(iso: string): string {
  const date = new Date(`${iso.slice(0, 10)}T00:00:00Z`);
  if (Number.isNaN(date.getTime())) return iso;
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}

/** Merge seeded announcements with posts published from the Studio. */
export function mergeNews(studioPosts: NewsPost[]): NewsPost[] {
  const seen = new Set(NEWS_POSTS.map((post) => post.slug));
  return [...NEWS_POSTS, ...studioPosts.filter((post) => !seen.has(post.slug))].sort((a, b) =>
    b.publishedAt.localeCompare(a.publishedAt),
  );
}

/** Convert a plain-text body (as written in the Studio) into news blocks. */
export function blocksFromText(body: string): NewsBlock[] {
  const blocks: NewsBlock[] = [];
  let current: NewsBlock = { paragraphs: [] };
  const push = () => {
    const hasContent = (current.paragraphs?.length ?? 0) > 0 || (current.bullets?.length ?? 0) > 0;
    if (hasContent) blocks.push(current);
    current = { paragraphs: [] };
  };
  for (const rawLine of body.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line) {
      push();
      continue;
    }
    if (line.startsWith("## ")) {
      push();
      current = { heading: line.slice(3).trim(), paragraphs: [] };
      continue;
    }
    if (line.startsWith("- ") || line.startsWith("* ")) {
      current.bullets = [...(current.bullets ?? []), line.slice(2).trim()];
      continue;
    }
    current.paragraphs = [...(current.paragraphs ?? []), line];
  }
  push();
  return blocks.filter(
    (block) => block.heading || block.paragraphs?.length || block.bullets?.length,
  );
}
