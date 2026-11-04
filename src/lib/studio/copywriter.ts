/**
 * NDH Studio copy engine.
 *
 * Deterministic, model-free drafting: the same brief always produces the same
 * campaign, and nothing is invented about a business — every claim comes from
 * its brand kit (tagline, offer ideas, audience, public address).
 *
 * Three caption formats are produced side by side, plus the short copy blocks
 * the flyer and motion renderers print.
 */
import type { BrandKit } from "./kits";
import type { Holiday } from "./holidays";

export type StudioGoal = "promo" | "launch" | "info" | "holiday" | "milestone";
export type StudioTone = "bold" | "warm" | "professional";

export const GOAL_LABEL: Record<StudioGoal, string> = {
  promo: "Promotion / sale",
  launch: "New feature / launch",
  info: "Informational",
  holiday: "Holiday greeting",
  milestone: "Milestone",
};

export const TONE_LABEL: Record<StudioTone, string> = {
  bold: "Bold & direct",
  warm: "Warm & human",
  professional: "Professional",
};

export type CopyBrief = {
  brand: BrandKit;
  topic: string;
  goal: StudioGoal;
  tone: StudioTone;
  offer?: string;
  holiday?: Holiday | null;
  /** Injectable for tests / previews. */
  now?: Date;
};

export type CaptionFormat = "short" | "social" | "linkedin";

export type CaptionCard = {
  format: CaptionFormat;
  label: string;
  platforms: string;
  body: string;
  /** Character count used by the UI counter. */
  length: number;
};

export type CampaignCopy = {
  headline: string;
  subhead: string;
  bullets: string[];
  cta: string;
  badge: string;
  /** The offer/price line exactly as entered, when one exists. */
  offerLine?: string;
  captions: CaptionCard[];
  /** One-line summary used in the archive. */
  summary: string;
};

/* ------------------------------------------------------------------ utils */

function hash(text: string): number {
  let h = 2166136261;
  for (let i = 0; i < text.length; i += 1) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
}

function pick<T>(items: T[], seed: number): T {
  return items[seed % items.length];
}

function sentence(text: string): string {
  const trimmed = text.trim();
  if (!trimmed) return trimmed;
  const capitalised = trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
  return /[.!?]$/.test(capitalised) ? capitalised : `${capitalised}.`;
}

/** True when the brief reads as a full sentence rather than a noun phrase. */
function isSentence(text: string): boolean {
  return /[.!?]\s*$/.test(text.trim()) || text.trim().split(/\s+/).length > 4;
}

function lowerFirst(text: string): string {
  return text ? text.charAt(0).toLowerCase() + text.slice(1) : text;
}

/** Join two copy fragments without producing a run-on sentence. */
function join(a: string, b: string): string {
  const head = /[.!?…]$/.test(a.trim()) ? a.trim() : `${a.trim()}.`;
  return `${head} ${b.trim()}`;
}

/** Cut on a word boundary so teaser copy never ends mid-word. */
export function clip(text: string, max: number): string {
  const clean = text.replace(/\s+/g, " ").trim();
  if (clean.length <= max) return clean;
  const cut = clean.slice(0, max);
  const space = cut.lastIndexOf(" ");
  return `${(space > max * 0.6 ? cut.slice(0, space) : cut).replace(/[,;:.\-–—]$/, "")}…`;
}

function hostOf(url: string): string {
  try {
    return new URL(url).host.replace(/^www\./, "");
  } catch {
    return url;
  }
}

/* -------------------------------------------------------------- headline */

function buildHeadline(brief: CopyBrief, seed: number): string {
  const subject = clip(brief.topic || brief.brand.tagline, 54);
  switch (brief.goal) {
    case "promo":
      return (brief.offer?.trim() || clip(subject, 40) || "Limited offer").toUpperCase();
    case "launch":
      return pick(["NOW LIVE", "NEW FROM NDH", "JUST LAUNCHED"], seed);
    case "holiday":
      return (brief.holiday?.greeting ?? subject).toUpperCase();
    case "milestone":
      return pick(["MILESTONE", "A NEW CHAPTER", "WE DID IT"], seed);
    default:
      return clip(subject, 58);
  }
}

function buildSubhead(brief: CopyBrief, seed: number): string {
  const subject = clip(brief.topic || brief.brand.tagline, 70);
  switch (brief.goal) {
    case "promo":
      return subject;
    case "launch":
      return subject === brief.brand.tagline ? brief.brand.tagline : subject;
    case "holiday":
      return brief.offer?.trim() || brief.brand.tagline;
    case "milestone":
      return subject;
    default:
      return brief.brand.tagline;
  }
}

function buildBadge(brief: CopyBrief): string {
  switch (brief.goal) {
    case "promo":
      return brief.offer ? "LIMITED OFFER" : "OFFER";
    case "launch":
      return "NEW";
    case "holiday":
      return brief.holiday?.expected ? "EXPECTED DATE" : "GREETINGS";
    case "milestone":
      return "MILESTONE";
    default:
      return "NDH";
  }
}

function buildBullets(brief: CopyBrief, seed: number): string[] {
  const ideas = brief.brand.offerIdeas;
  const rotated = [...ideas.slice(seed % Math.max(ideas.length, 1)), ...ideas];
  const picked = Array.from(new Set(rotated)).slice(0, 3);
  while (picked.length < 3) picked.push(clip(brief.brand.description, 60));
  return picked.map((item) => clip(item, 64));
}

function buildCta(brief: CopyBrief): string {
  switch (brief.goal) {
    case "promo":
      return "Shop the offer";
    case "launch":
      return "Try it today";
    case "holiday":
      return "Send your wishes";
    case "milestone":
      return "Join us";
    default:
      return "Learn more";
  }
}

/* --------------------------------------------------------------- captions */

function toneOpener(brief: CopyBrief, seed: number): string {
  const subject = clip(brief.topic || brief.brand.tagline, 90);
  if (brief.goal === "holiday" && brief.holiday) {
    return pick(
      [
        `${brief.holiday.emoji} ${brief.holiday.greeting} from all of us at ${brief.brand.name}.`,
        `${brief.holiday.greeting}, from the ${brief.brand.name} team. ${brief.holiday.emoji}`,
        `${brief.holiday.emoji} ${brief.holiday.greeting}!`,
      ],
      seed,
    );
  }
  const openers: Record<StudioTone, string[]> = {
    bold: [
      `${subject}`,
      `${subject} — no small print.`,
      `Look: ${subject.charAt(0).toLowerCase()}${subject.slice(1)}`,
    ],
    warm: [
      `${subject}`,
      `Something we have been working on: ${subject.charAt(0).toLowerCase()}${subject.slice(1)}`,
      `${subject} — and we would love you to see it.`,
    ],
    professional: [
      `${subject}`,
      `${subject}`,
      `A quick update from ${brief.brand.name}: ${subject.charAt(0).toLowerCase()}${subject.slice(1)}`,
    ],
  };
  return pick(openers[brief.tone], seed);
}

function shortCaption(brief: CopyBrief, seed: number): string {
  const host = hostOf(brief.brand.url);
  const hook =
    brief.goal === "holiday" && brief.holiday
      ? `${brief.holiday.emoji} ${brief.holiday.greeting} from ${brief.brand.name}.`
      : brief.goal === "launch"
        ? `🚀 ${clip(brief.topic || brief.brand.tagline, 80)}${
            isSentence(brief.topic) ? "" : " — live now."
          }`
        : brief.goal === "promo"
          ? `🔥 ${brief.offer ?? clip(brief.topic, 40) ?? "Limited offer"} — only while it lasts.`
          : `✨ ${clip(brief.topic || brief.brand.tagline, 90)}`;
  const middle =
    brief.goal === "promo"
      ? ` ${clip(brief.brand.tagline, 48)}`
      : brief.goal === "holiday"
        ? ` Wishing you and your family a peaceful one.`
        : ` ${clip(brief.brand.tagline, 56)}`;
  const cta = ` ${brief.goal === "holiday" ? "Reply with your wishes" : buildCta(brief)} → ${host}`;
  const tag = pick(brief.brand.hashtags, seed);
  const head = /[.!?…)]$/.test(hook.trim()) ? hook.trim() : `${hook.trim()}.`;
  return `${head}${middle}${cta}\n${tag}`;
}

function socialCaption(brief: CopyBrief, seed: number): string {
  const bullets = buildBullets(brief, seed);
  const host = hostOf(brief.brand.url);
  const opener = toneOpener(brief, seed);
  const intro =
    brief.goal === "holiday" && brief.holiday
      ? `${opener} May this season bring you ease, barakah and time with the people who matter.`
      : brief.goal === "launch"
        ? join(opener, "Here is what is new.")
        : brief.goal === "promo"
          ? join(opener, "Here is exactly what you get:")
          : join(opener, "Here is the short version:");

  const hashtags = Array.from(
    new Set([
      ...brief.brand.hashtags.slice(0, 6),
      brief.goal === "promo" ? "#Offer" : brief.goal === "holiday" ? "#SeasonGreetings" : "#NDH",
    ]),
  )
    .slice(0, 9)
    .join(" ");

  const body =
    brief.goal === "holiday"
      ? `${intro}\n\nWith love from the ${brief.brand.name} team.\n\n${brief.brand.url}\n\n${hashtags}`
      : `${intro}\n\n${bullets.map((item) => `• ${item}`).join("\n")}\n\n${
          brief.goal === "promo" && brief.offer ? `⏳ ${brief.offer} — while it lasts.\n\n` : ""
        }👉 ${buildCta(brief)}: ${brief.brand.url}\n\n${hashtags}`;

  return body.replace(/\n{3,}/g, "\n\n").trim();
}

function linkedinCaption(brief: CopyBrief, seed: number): string {
  const bullets = buildBullets(brief, seed);
  const host = hostOf(brief.brand.url);
  const lead =
    brief.goal === "holiday" && brief.holiday
      ? `${brief.holiday.greeting} from ${brief.brand.name}.`
      : brief.goal === "launch"
        ? `Now live at ${brief.brand.name}: ${lowerFirst(clip(brief.topic || brief.brand.tagline, 80).replace(/\.$/, ""))}.`
        : brief.goal === "promo"
          ? `${brief.offer ?? clip(brief.topic, 50)} is available now at ${brief.brand.name}.`
          : sentence(clip(brief.topic || brief.brand.tagline, 90));

  const context: Record<StudioGoal, string> = {
    promo: `The offer is deliberately simple: clear value, a fixed window and no fine print. ${brief.brand.description}`,
    launch: `The reason is practical. ${clip(brief.brand.description, 200)}`,
    info: `Why this matters: ${clip(brief.brand.description, 200)}`,
    holiday: `Our offices stay open through the period, and our team is grateful for another year of trust from clients and partners.`,
    milestone: `A milestone is only useful if it changes what we can do for the people we serve. ${clip(brief.brand.description, 160)}`,
  };

  const hashtags = brief.brand.hashtags
    .filter(
      (tag) =>
        !tag.startsWith("#Najeeb") &&
        !tag.startsWith("#Nigeri") &&
        !tag.startsWith("#DigitalAfrica"),
    )
    .slice(0, 3)
    .join(" ");

  return [
    lead,
    "",
    context[brief.goal],
    "",
    ...bullets.map((item) => `• ${item}`),
    "",
    brief.goal === "holiday"
      ? `Wishing you a restful and prosperous season.\n\n${brief.brand.url}`
      : `If this is useful to you or your team, the detail is here: ${host}\n\nWhat would you want to see next?`,
    "",
    hashtags,
  ]
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

/* ---------------------------------------------------------------- public */

export function buildCampaign(brief: CopyBrief): CampaignCopy {
  const seed = hash(`${brief.brand.id}:${brief.goal}:${brief.tone}:${brief.topic}`);
  const drafts: Omit<CaptionCard, "length">[] = [
    {
      format: "short",
      label: "WhatsApp Status & X",
      platforms: "Short, punchy, direct",
      body: shortCaption(brief, seed),
    },
    {
      format: "social",
      label: "Instagram & Facebook",
      platforms: "Story, bullets, emojis, hashtags",
      body: socialCaption(brief, seed),
    },
    {
      format: "linkedin",
      label: "LinkedIn",
      platforms: "Professional, impact-led",
      body: linkedinCaption(brief, seed),
    },
  ];
  const captions: CaptionCard[] = drafts.map((card) => ({
    ...card,
    length: card.body.length,
  }));

  return {
    headline: buildHeadline(brief, seed),
    subhead: buildSubhead(brief, seed),
    bullets: buildBullets(brief, seed),
    cta: buildCta(brief),
    badge: buildBadge(brief),
    offerLine: brief.offer?.trim() || undefined,
    captions,
    summary: clip(brief.topic || brief.brand.tagline, 90),
  };
}

/** One-click holiday campaign: brief, offer line and greeting pre-filled. */
export function holidayBrief(
  brand: BrandKit,
  holiday: Holiday,
  tone: StudioTone = "warm",
): CopyBrief {
  return {
    brand,
    topic: `${holiday.name} greetings from ${brand.name}`,
    goal: "holiday",
    tone,
    offer: holiday.group === "retail" ? brand.offerIdeas[0] : brand.tagline,
    holiday,
  };
}

export function buildShareText(card: CaptionCard, brand: BrandKit): string {
  const body = card.body.trim();
  if (body.includes(brand.url) || body.includes(brand.url.replace(/^https?:\/\//, ""))) return body;
  return `${body}\n\n${brand.url}`;
}
