/**
 * Omni-Hub consultant engine.
 *
 * A deterministic, dependency-free routing engine that runs on the edge. It is
 * the *floor*, not the ceiling: `/api/public/omni-hub` streams this answer
 * directly when no model key is configured, and hands the structured result to
 * the model as grounding when one is. Either way, routing decisions — which
 * NDH business owns the request, which course fits, what to ask next — are
 * made here, so the assistant can never invent a subsidiary or a price.
 *
 * The engine is stateless, so continuity is rebuilt from the transcript on
 * every turn: a short answer to the assistant's own question continues the
 * route that asked it instead of starting over.
 */
import { STATIC_COURSES, type StaticCourse } from "@/lib/static-catalogue";
import { SUBSIDIARIES, subsidiaryHref, type SubsidiaryId } from "@/lib/ecosystem";
import { BUSINESS_PROFILES, ACADEMY_SCHOOLS } from "@/lib/business-profiles";
import { SITE_CONTACT } from "@/lib/site-contact";
import { en, type TranslationKey } from "@/lib/i18n/dictionary";
import { regionLabel, type RegionId } from "@/lib/region";

export type OmniMessage = {
  role: "user" | "assistant";
  content: string;
  /** On assistant turns: the qualifying question that was asked, if any. */
  qualificationId?: OmniQualification["id"];
};

export type OmniIntent =
  | "agency"
  | "academy"
  | "estore"
  | "schooldesk"
  | "agricapital"
  | "travel"
  | "ihospital"
  | "pricing"
  | "about"
  | "contact"
  | "help"
  | "thanks"
  | "greeting"
  | "unknown";

/** Intents that name a business in the family and can own a conversation. */
const BUSINESS_INTENTS = [
  "agency",
  "academy",
  "estore",
  "schooldesk",
  "agricapital",
  "travel",
  "ihospital",
] as const;
type BusinessIntent = (typeof BUSINESS_INTENTS)[number];

export type OmniCard = {
  kind: "route" | "course" | "summary";
  /** Internal link or safe external URL. */
  href: string;
  title: string;
  body?: string;
  meta?: string;
  cta: string;
  external?: boolean;
};

export type OmniQualification = {
  id: "timeline" | "experience" | "interest" | "contact";
  prompt: string;
  options: string[];
};

export type OmniProfile = {
  goal?: string;
  timeline?: "urgent" | "normal" | "flexible";
  experience?: "beginner" | "intermediate" | "advanced";
  interest?: string;
  /** Intent the conversation was already following, if any. */
  route?: BusinessIntent;
  /** Human-readable facts collected so far, used for the handoff summary. */
  facts: string[];
};

export type OmniReply = {
  intent: OmniIntent;
  confidence: number;
  text: string;
  cards: OmniCard[];
  chips: string[];
  qualification?: OmniQualification;
  profile: OmniProfile;
  /** Route the assistant believes owns this conversation, when there is one. */
  owner?: SubsidiaryId;
};

/* ------------------------------------------------------------------ *
 * Intent classification
 *
 * Patterns accept English, French and Arabic keywords so a visitor who
 * writes in a translated language is still routed correctly. Prose answers
 * stay in English in engine mode; the model mode answers in the visitor's
 * language using the same routing decision.
 * ------------------------------------------------------------------ */

type IntentRule = { intent: OmniIntent; weight: number; pattern: RegExp };

const RULES: IntentRule[] = [
  {
    intent: "about",
    weight: 4,
    pattern:
      /(what (is|does) (ndh|najeeb|the (family|group|ecosystem|company))|who are (you|ndh)|what do you (do|offer)|tell me about (ndh|najeeb|the (family|group))|how many (businesses|companies|brands)|qu'est[- ]ce que (ndh|le groupe)|qui (êtes|etes)[- ]vous|ما (هو|هي) ndh|ما الذي تقدمه)/i,
  },
  {
    intent: "contact",
    weight: 3,
    pattern:
      /(contact|speak to (a |the )?(human|person|team|someone)|talk to (a |the )?(human|person|team|someone)|reach (you|the team)|email|phone|whatsapp|phone number|where are you (based|located)|your (office|location|address)|support|contacter|joindre|appeler|اتصل|تواصل|رقم الهاتف|العنوان)/i,
  },
  {
    intent: "contact",
    weight: 3,
    pattern:
      /(work (with|for) (you|your|ndh)|jobs?|vacanc\w*|apply|join (the )?team|careers?|internships?|apprentice\w*|attachments?|freelanc\w*|partner(ship)?s?|collaborat\w*|travailler avec vous|emploi|partenariat|وظيفة|عمل معكم|شراكة)/i,
  },
  {
    intent: "help",
    weight: 3,
    pattern:
      /(what can you (do|help)|how can you help|what should i (do|choose)|i (do not|don't) know where to start|not sure where to start|help me choose|where do i start|options|que pouvez[- ]vous faire|aide[- ]moi|ماذا يمكنك أن تفعل|ساعدني|من أين أبدأ)/i,
  },
  {
    intent: "thanks",
    weight: 3,
    pattern: /^\s*(thanks|thank you|thankyou|cheers|merci|shukran|jazak\w*|شكرا|شكرًا)/i,
  },
  {
    intent: "schooldesk",
    weight: 3,
    pattern:
      /(school|schools|pupils?|students? records|admissions?|registrar|principal|head ?teacher|term(s)? (fees?|results?)|report cards?|result sheets?|school management|école|ecole|élèves|élève|scolaire|مدرسة|مدارس|الطلاب|تسجيل الطلاب)/i,
  },
  {
    intent: "estore",
    weight: 4,
    pattern:
      /(e-?store|multi[- ]?vendor|vendors?|merchants?|storefronts?|online store|inventory|shipping|checkout|cross[- ]border|sell (online|products|goods|clothes)|shop(?:ping)?|buy (products|goods)|physical products|digital products|paystack|flutterwave|templates?|boilerplates?|starter kits?|boutique|vendeur|marchand|livraison|stock|متجر|بائع|تجار|شحن|مخزون|منتجات)/i,
  },
  {
    intent: "agricapital",
    weight: 5,
    pattern:
      /(agri(capital|vest)|\bventure\b|agricultur|\bfarm(?:s|ing|er|ers)?\b|livestock|cattle|poultry|crops?|harvest|feeding|cooperative farming|contribution ledger|farm cycle|invest\w*|equity stake|proportional (profit|payout)|élevage|récolte|ferme|agricole|coopérative|زراع|مزرع|ماشية|مواشي|محصول|حصاد|استثمار|سجل المساهمات)/i,
  },
  {
    intent: "travel",
    weight: 4,
    pattern:
      /(ndh travel|travel concierge|flight|visa|travel booking|book a trip|voyage|vols?\b|billet|سفر|طيران|تأشيرة)/i,
  },
  {
    intent: "ihospital",
    weight: 4,
    pattern:
      /(i-?hospital|telemedicine|telehealth|clinic|medical consultation|doctor|hospital|télémédecine|clinique|médecin|تطبيب|عيادة|طبيب|مستشفى)/i,
  },
  {
    intent: "academy",
    weight: 3,
    pattern:
      /(courses?|learn\w*|study|studies|training|train me|skills?|upskilling|academy|académie|enrol\w*|enroll\w*|lessons?|classes?|curriculum|tutorials?|beginners?|career change|certificat\w*|credentials?|verify\w*|verification|serial|apprendre|formation|cours|شهادات?|شهادة|تعلم|دورة|دورات|تحقق)/i,
  },
  {
    intent: "pricing",
    weight: 2,
    pattern:
      /(price|pricing|cost|how much|fees?|pay|payment|charge|rate|quote|budget|expensive|naira|dollar|pound|euro|prix|coût|combien|payer|tarif|سعر|أسعار|تكلفة|كم|الدفع)/i,
  },
  {
    intent: "agency",
    weight: 2,
    pattern:
      /(pm isolation|confidential isolation|dedicated pm|project managers?|milestone verification|talent escrow|clients? and talents?|hire|recruit\w*|agenc\w*|build|develop\w*|engineers?|websites?|web apps?|mobile apps?|software|product team|design(er|ers)?|redesign|brands?|logos?|identity|marketing|ads?|campaigns?|seo|social media|video edit\w*|animation|automation|chatbots?|apis?|platforms?|landing pages?|apps? for|agence|développ\w*|créer|موقع|تطبيق|تصميم|تسويق|فريق|تطوير)/i,
  },
  {
    intent: "greeting",
    weight: 1,
    pattern:
      /^\s*(hi|hello|hey|good (morning|afternoon|evening)|salaam|assalamu?\s*alaikum|how are you|yo|bonjour|salut|مرحبا|أهلا|السلام عليكم|صباح الخير)/i,
  },
];

export function classifyIntent(text: string): {
  intent: OmniIntent;
  confidence: number;
  scores: Record<string, number>;
} {
  const scores: Record<string, number> = {};
  for (const rule of RULES) {
    if (rule.pattern.test(text)) {
      scores[rule.intent] = (scores[rule.intent] ?? 0) + rule.weight;
    }
  }

  for (const entry of NAME_PATTERNS) {
    if (entry.pattern.test(text)) scores[entry.id] = (scores[entry.id] ?? 0) + 8;
  }
  if (/(learn|course|academy|académie|formation|apprendre|دورة|تعلم|شهادة)/i.test(text)) {
    scores.academy = (scores.academy ?? 0) + 4;
  }
  // General startup fundraising is not the agricultural investment business.
  if (
    /(startup|app idea|business idea|incubator|accelerator|co-?founder|fund my idea|back my idea|فكرة مشروع|تمويل شركتي)/i.test(
      text,
    ) &&
    !/(farm|agri|livestock|crop|harvest|venture|زراع|مواشي)/i.test(text)
  ) {
    delete scores.agricapital;
    scores.contact = (scores.contact ?? 0) + 7;
  }
  const entries = Object.entries(scores).sort((a, b) => b[1] - a[1]);
  if (entries.length === 0) return { intent: "unknown", confidence: 0.2, scores };
  const [intent, score] = entries[0];
  const total = entries.reduce((sum, [, value]) => sum + value, 0);
  return {
    intent: intent as OmniIntent,
    confidence: Math.min(0.95, 0.45 + (score / Math.max(total, 1)) * 0.5),
    scores,
  };
}

/* ------------------------------------------------------------------ *
 * Profile derivation — the running "brief", rebuilt every turn
 * ------------------------------------------------------------------ */

const EXPERIENCE_RULES: { level: "beginner" | "intermediate" | "advanced"; pattern: RegExp }[] = [
  {
    level: "beginner",
    pattern:
      /\b(beginner|complete beginner|new to|no experience|start(ing)? from scratch|never (used|tried)|complete novice|débutant|jamais|مبتدئ|من الصفر)\b/i,
  },
  {
    level: "advanced",
    pattern:
      /\b(advanced|experienced|expert|professional|years? of|already work(ing)? in|avancé|expérimenté|متقدم|خبير)\b/i,
  },
  {
    level: "intermediate",
    pattern:
      /\b(some experience|intermediate|a bit of|basics already|used it before|intermédiaire|متوسط|بعض الخبرة)\b/i,
  },
];

const TIMELINE_RULES: { timeline: "urgent" | "normal" | "flexible"; pattern: RegExp }[] = [
  {
    timeline: "urgent",
    pattern:
      /\b(urgent|asap|immediately|this week|days|rush|deadline|urgent|cette semaine|عاجل|هذا الأسبوع)\b/i,
  },
  {
    timeline: "normal",
    pattern: /\b(weeks?|a month|next month|soon|semaines?|mois|أسابيع|شهر)\b/i,
  },
  {
    timeline: "flexible",
    pattern:
      /\b(flexible|no rush|whenever|exploring|just looking|planning|flexible|sans urgence|مرن|بدون عجلة)\b/i,
  },
];

const INTEREST_AREAS: { interest: string; pattern: RegExp }[] = [
  {
    interest: "Writing & content",
    pattern: /\b(writ|copy|blog|article|content|rédaction|كتاب|محتوى)\b/i,
  },
  { interest: "Design & brand", pattern: /\b(design|brand|logo|identity|figma|تصميم|هوية)\b/i },
  {
    interest: "Media & Video",
    pattern: /\b(video|youtube|reel|edit|motion|podcast|فيديو|مونتاج)\b/i,
  },
  {
    interest: "AI engineering",
    pattern: /\b(ai|agents?|automation|prompt|engineer|ذكاء|أتمتة|هندسة)\b/i,
  },
  {
    interest: "Marketing & growth",
    pattern: /\b(marketing|ads?|seo|social|growth|تسويق|إعلانات)\b/i,
  },
  {
    interest: "Business & operations",
    pattern: /\b(business|operations|project manage|crm|finance|أعمال|عمليات)\b/i,
  },
];

export function deriveProfile(messages: OmniMessage[]): OmniProfile {
  const userText = messages
    .filter((m) => m.role === "user")
    .map((m) => m.content)
    .join(" \n ");

  const facts: string[] = [];
  const profile: OmniProfile = { facts };

  const goalMatch = userText.match(
    /\b(?:need|want|looking for|help (?:me )?(?:to )?|trying to|would like)\s+([^.!?\n]{8,90})/i,
  );
  if (goalMatch) {
    profile.goal = goalMatch[1].trim().replace(/\s+/g, " ");
    facts.push(`Goal: ${profile.goal}`);
  }

  for (const rule of EXPERIENCE_RULES) {
    if (rule.pattern.test(userText)) {
      profile.experience = rule.level;
      facts.push(`Experience: ${rule.level}`);
      break;
    }
  }

  for (const rule of TIMELINE_RULES) {
    if (rule.pattern.test(userText)) {
      profile.timeline = rule.timeline;
      facts.push(`Timeline: ${rule.timeline}`);
      break;
    }
  }

  for (const area of INTEREST_AREAS) {
    if (area.pattern.test(userText)) {
      profile.interest = area.interest;
      facts.push(`Interested in: ${area.interest}`);
      break;
    }
  }

  return profile;
}

/* ------------------------------------------------------------------ *
 * Continuity — what route was this conversation already following?
 * ------------------------------------------------------------------ */

const BUSINESS_INTENT_SET = new Set<string>(BUSINESS_INTENTS);

/**
 * The last business the conversation settled on, read back out of the
 * transcript so a one-word answer such as "this week" or "design" continues
 * that thread instead of starting over.
 */
export function previousRoute(messages: OmniMessage[]): BusinessIntent | undefined {
  const userMessages = messages.filter((message) => message.role === "user");
  for (let index = userMessages.length - 2; index >= 0; index -= 1) {
    const { intent, scores } = classifyIntent(userMessages[index].content);
    if (BUSINESS_INTENT_SET.has(intent)) return intent as BusinessIntent;
    const runnerUp = Object.entries(scores)
      .filter(([key]) => BUSINESS_INTENT_SET.has(key))
      .sort((a, b) => b[1] - a[1])[0];
    if (runnerUp) return runnerUp[0] as BusinessIntent;
  }
  return undefined;
}

/**
 * Qualifying questions, declared once so the assistant can recognise its own
 * question being answered on the next turn.
 */
const QUALIFICATIONS: Record<OmniQualification["id"], OmniQualification> = {
  interest: {
    id: "interest",
    prompt: "Which area do you want to be good at?",
    options: [
      "Writing & content",
      "Design & brand",
      "Media & Video",
      "AI engineering",
      "Marketing & growth",
      "Business & operations",
    ],
  },
  experience: {
    id: "experience",
    prompt: "How much experience do you already have?",
    options: ["Complete beginner", "Some exposure", "Already working in it"],
  },
  timeline: {
    id: "timeline",
    prompt: "When would you want the work delivered?",
    options: ["This week", "In a month", "Over a quarter", "Still planning"],
  },
  contact: {
    id: "contact",
    prompt: "I can pass this to a project manager. How would you like to be reached?",
    options: ["Use the contact form", "WhatsApp instead", "Just keep exploring"],
  },
};

/** The question the assistant asked most recently, if it asked one. */
function pendingQualification(messages: OmniMessage[]): OmniQualification | null {
  const lastAssistant = [...messages].reverse().find((message) => message.role === "assistant");
  if (!lastAssistant) return null;
  const declared = lastAssistant.qualificationId;
  if (declared && QUALIFICATIONS[declared]) return QUALIFICATIONS[declared];
  return (
    Object.values(QUALIFICATIONS).find((q) => lastAssistant.content.includes(q.prompt)) ?? null
  );
}

/** Which business a qualifying question belongs to. */
const QUALIFICATION_ROUTE: Record<OmniQualification["id"], BusinessIntent> = {
  interest: "academy",
  experience: "academy",
  timeline: "agency",
  contact: "agency",
};

/** True when the message is one of the answers the assistant offered. */
function answersQualification(text: string, question: OmniQualification): boolean {
  const normalized = text.trim().toLowerCase();
  return question.options.some((option) => {
    const value = option.toLowerCase();
    return normalized.includes(value) || value.includes(normalized);
  });
}

/**
 * True when a short reply continues the current thread — either because it is
 * one of the offered answers, or because it carries no routing signal of its
 * own and the assistant had just asked a question.
 */
function continuesThread(text: string, messages: OmniMessage[], route?: BusinessIntent): boolean {
  if (!route) return false;
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  if (words === 0) return false;

  const question = pendingQualification(messages);
  if (question) {
    if (answersQualification(text, question)) return true;
    return words <= 8 && classifyIntent(text).intent === "unknown";
  }

  const lastAssistant = [...messages].reverse().find((message) => message.role === "assistant");
  if (!lastAssistant) return false;
  if (
    words <= 10 &&
    /^(what about|how (does|do|is|are)|and |when |is it|can i|tell me more)/i.test(text) &&
    ["unknown", "pricing"].includes(classifyIntent(text).intent)
  )
    return true;
  if (!lastAssistant.content.includes("?")) return false;
  if (words > 4) return false;
  const { intent, confidence } = classifyIntent(text);
  return intent === "unknown" || confidence < 0.8;
}

/** Explicit business names, so a two-part question gets two cards. */
const NAME_PATTERNS: { id: SubsidiaryId; pattern: RegExp }[] = [
  { id: "agency", pattern: /\b(ndh agency|the agency|agence)\b/i },
  { id: "academy", pattern: /(academy|académie)/i },
  { id: "agricapital", pattern: /\b(agricapital|agrivest|venture)\b/i },
  { id: "estore", pattern: /(e-?store)/i },
  { id: "schooldesk", pattern: /(schooldesk|school desk)/i },
  { id: "travel", pattern: /\b(ndh travel|travel platform)\b/i },
  { id: "ihospital", pattern: /\b(ihospital|i-?hospital|hospital platform)\b/i },
];

export function mentionedSubsidiaries(text: string): SubsidiaryId[] {
  return NAME_PATTERNS.filter((entry) => entry.pattern.test(text)).map((entry) => entry.id);
}

/* ------------------------------------------------------------------ *
 * Course recommendation
 * ------------------------------------------------------------------ */

const THEME_BOOSTS: { pattern: RegExp; slugs: string[] }[] = [
  {
    pattern: /\b(agent|agents|automation|automat|n8n|zapier|workflow)\b/i,
    slugs: ["build-ai-agents", "ai-workflow-automation", "no-code-ai-apps"],
  },
  {
    pattern: /\b(prompt|chatgpt|claude|gemini|llm)\b/i,
    slugs: ["prompt-engineering", "build-ai-agents"],
  },
  {
    pattern: /\b(saas|startup|launch|subscription|billing)\b/i,
    slugs: ["saas-boilerplate-launch", "no-code-ai-apps"],
  },
  {
    pattern: /\b(logo|brand|identity|branding)\b/i,
    slugs: ["ai-branding-and-identity", "ai-graphic-design"],
  },
  {
    pattern: /\b(ui|ux|interface|prototype|figma|product design)\b/i,
    slugs: ["ai-ui-ux-design", "ai-graphic-design"],
  },
  {
    pattern: /\b(video|youtube|reel|edit(ing)?|motion)\b/i,
    slugs: ["ai-video-editing", "ai-youtube-growth-management", "ai-3d-product-animation"],
  },
  { pattern: /\b(podcast|audio|sound)\b/i, slugs: ["ai-podcast-production", "ai-video-editing"] },
  {
    pattern: /\b(write|writing|copy|copywriting|blog|article|seo)\b/i,
    slugs: ["ai-copywriting", "ai-blogging-and-seo", "ai-content-strategy"],
  },
  {
    pattern: /\b(linkedin|personal brand|ghostwrit)\b/i,
    slugs: ["ai-linkedin-ghostwriting", "ai-copywriting"],
  },
  {
    pattern: /\b(email|newsletter|funnel|crm|hubspot|gohighlevel)\b/i,
    slugs: ["ai-email-marketing", "ai-crm-setup-hubspot-gohighlevel"],
  },
  {
    pattern: /\b(ads?|facebook ads|google ads|paid)\b/i,
    slugs: ["ai-paid-ads", "ai-conversion-rate-optimization"],
  },
  {
    pattern: /\b(social media|instagram|content calendar|community)\b/i,
    slugs: ["ai-social-media-management", "ai-content-strategy"],
  },
  {
    pattern: /\b(photo|retouch|product shot)\b/i,
    slugs: ["ai-photography-and-retouching", "ai-illustration"],
  },
  {
    pattern: /\b(illustrat|art|draw|midjourney)\b/i,
    slugs: ["ai-illustration", "ai-graphic-design"],
  },
  {
    pattern: /\b(data|excel|spreadsheet|dashboard|analysis)\b/i,
    slugs: ["ai-data-entry-and-analysis", "ai-project-management"],
  },
  {
    pattern: /\b(project manage|scrum|delivery|jira)\b/i,
    slugs: ["ai-project-management", "ai-workflow-automation"],
  },
  {
    pattern: /\b(support|help ?desk|customer service)\b/i,
    slugs: ["ai-customer-support", "ai-virtual-assistant"],
  },
  {
    pattern: /\b(assistant|virtual assistant|admin|scheduling)\b/i,
    slugs: ["ai-virtual-assistant", "ai-customer-support"],
  },
  {
    pattern: /\b(ebook|book|publish)\b/i,
    slugs: ["ai-e-book-writing-and-design", "ai-copywriting"],
  },
  { pattern: /\b(script|screenplay|story)\b/i, slugs: ["ai-scriptwriting", "ai-video-editing"] },
  {
    pattern: /\b(3d|animation|product video)\b/i,
    slugs: ["ai-3d-product-animation", "ai-video-generation"],
  },
];

const STOP_WORDS = new Set([
  "the",
  "and",
  "for",
  "with",
  "you",
  "your",
  "want",
  "need",
  "looking",
  "learn",
  "course",
  "courses",
  "about",
  "that",
  "this",
  "have",
  "from",
  "into",
  "can",
  "how",
  "what",
  "which",
  "would",
  "like",
  "please",
  "help",
  "some",
  "more",
  "best",
  "good",
  "start",
  "starting",
  "begin",
  "beginner",
  "should",
  "tell",
  "give",
  "show",
  "make",
  "made",
  "them",
  "they",
  "there",
  "where",
]);

export type CourseMatch = {
  course: StaticCourse;
  /** 0-1 relevance score. */
  score: number;
  reason: string;
};

export function recommendCourses(
  text: string,
  options: { profile?: OmniProfile; limit?: number } = {},
): CourseMatch[] {
  const { profile, limit = 3 } = options;
  const haystack = `${text} ${profile?.goal ?? ""} ${profile?.interest ?? ""}`.toLowerCase();
  const tokens = haystack
    .split(/[^a-z0-9+]+/)
    .filter((token) => token.length > 2 && !STOP_WORDS.has(token));

  const boostScores = new Map<string, number>();
  for (const boost of THEME_BOOSTS) {
    if (boost.pattern.test(haystack)) {
      boost.slugs.forEach((slug, index) => {
        const current = boostScores.get(slug) ?? 0;
        boostScores.set(slug, Math.max(current, 1 - index * 0.15));
      });
    }
  }

  const matches: CourseMatch[] = STATIC_COURSES.map((course) => {
    const corpus = `${course.title} ${course.summary} ${course.school}`.toLowerCase();
    let score = 0;
    const hits: string[] = [];

    for (const token of new Set(tokens)) {
      if (corpus.includes(token)) {
        score += 0.22;
        hits.push(token);
      }
    }

    const boosted = boostScores.get(course.slug);
    if (boosted) {
      score += boosted * 0.9;
      hits.push(course.school.toLowerCase());
    }

    // Beginner-friendly framing: the catalogue is designed for practical, first-run learners.
    if (
      profile?.experience === "beginner" &&
      /prompt|no-code|workflow|copywriting|social/i.test(course.slug)
    ) {
      score += 0.08;
    }
    if (
      profile?.experience === "advanced" &&
      /agents|saas|automation|project-management/i.test(course.slug)
    ) {
      score += 0.1;
    }

    const reason = hits.length
      ? `Matches ${Array.from(new Set(hits)).slice(0, 3).join(", ")}`
      : "A practical starting point in the catalogue";

    return { course, score: Math.min(1, score), reason };
  });

  return matches
    .filter((match) => match.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}

/* ------------------------------------------------------------------ *
 * Answer composition
 * ------------------------------------------------------------------ */

/** Courses offered when a request is too general to match against anything. */
const STARTER_COURSES = ["prompt-engineering", "no-code-ai-apps", "ai-copywriting"];

const FAMILY_LINE =
  "NDH has seven businesses: four active — Agency for managed digital delivery, Academy for 60 practical AI-skills courses across 6 schools, AgriCapital for cooperative farming investments, and eStore for multi-vendor commerce. SchoolDesk, Travel and iHospital are Coming Soon.";

type RouteCopy = { owner: SubsidiaryId; headline: string; body: string; chips: string[] };

const ROUTE_COPY: Record<BusinessIntent, RouteCopy> = {
  agency: {
    owner: "agency",
    headline: "Managed delivery through dedicated PM teams.",
    body: BUSINESS_PROFILES.agency.description,
    chips: ["How does PM isolation work?", "How are milestones verified?", "Talk to the team"],
  },
  academy: {
    owner: "academy",
    headline: "60 practical courses across 6 specialized schools.",
    body: `${BUSINESS_PROFILES.academy.description} Pre-project readiness quizzes prepare learners for capstone deliverables.`,
    chips: ["What are the 6 schools?", "Recommend a course", "Verify a certificate"],
  },
  agricapital: {
    owner: "agricapital",
    headline: "Cooperative farming with transparent equity.",
    body: `${BUSINESS_PROFILES.agricapital.description} NDH AgriCapital was formerly called Venture. Farming carries risk: returns are not guaranteed.`,
    chips: [
      "How is farm equity calculated?",
      "What do farm operators record?",
      "How are harvest profits distributed?",
    ],
  },
  estore: {
    owner: "estore",
    headline: "Multi-vendor commerce, locally and across borders.",
    body: `${BUSINESS_PROFILES.estore.description} Checkout supports Paystack and Flutterwave, with automated vendor payout ledgers.`,
    chips: [
      "How do vendors onboard?",
      "Can I sell physical products?",
      "How do shipping and payouts work?",
    ],
  },
  schooldesk: {
    owner: "schooldesk",
    headline: "SchoolDesk — Coming Soon.",
    body: BUSINESS_PROFILES.schooldesk.description,
    chips: ["Ask about SchoolDesk", "What does NDH do?"],
  },
  travel: {
    owner: "travel",
    headline: "NDH Travel — Coming Soon.",
    body: BUSINESS_PROFILES.travel.description,
    chips: ["Ask about NDH Travel", "What does NDH do?"],
  },
  ihospital: {
    owner: "ihospital",
    headline: "NDH iHospital — Coming Soon.",
    body: BUSINESS_PROFILES.ihospital.description,
    chips: ["Ask about iHospital", "What does NDH do?"],
  },
};

const BUSINESS_BLURBS = Object.fromEntries(
  Object.entries(BUSINESS_PROFILES).map(([id, profile]) => [
    id,
    `${profile.tagline}${SUBSIDIARIES.find((item) => item.id === id)?.state === "coming" ? " Coming Soon — not available yet." : ""}`,
  ]),
) as Record<BusinessIntent, string>;

function chipSet(intent: OmniIntent): string[] {
  if (intent === "pricing") {
    return ["Course fees", "Product prices", "How work is quoted", "Payment methods"];
  }
  if (intent === "unknown" || intent === "greeting" || intent === "about" || intent === "help") {
    return [
      "What does NDH do?",
      "Find a course",
      "Shop or sell online",
      "School software",
      "Invest in a farm cycle",
    ];
  }
  if (intent === "contact") {
    return ["Find a course", "School software", "Invest in a farm cycle"];
  }
  if (intent === "thanks") {
    return ["Find a course", "Shop or sell online", "What does NDH do?"];
  }
  return (
    ROUTE_COPY[intent as BusinessIntent]?.chips ?? [
      "What does NDH do?",
      "Find a course",
      "School software",
    ]
  );
}

function bandLabel(key: string): string {
  return en[key as TranslationKey] ?? key;
}

/**
 * Deliberately figure-free: the parent gateway is a landing page and shows no
 * prices, so the consultant explains how pricing works in each business and
 * hands the numbers to the page that owns them.
 */
function pricingAnswer(): string {
  return "Confirm current terms with the business providing the service. Academy lists course details; eStore vendors list their products and checkout terms; Agency confirms a project’s scope and terms through its PM team. AgriCapital contributions fund farm cycles, with equity calculated from the shared ledger and profits distributed after harvest and sale. Investment returns are not guaranteed. SchoolDesk, Travel and iHospital are Coming Soon, not bookable services.";
}

function aboutAnswer(): string {
  return [
    FAMILY_LINE,
    "The businesses share one identity and one standard, but each one is independent — you deal directly with the business that fits your need.",
    "Tell me what you are trying to do and I will open the right door.",
  ].join("\n\n");
}

function helpAnswer(): string {
  return [
    "Here is what I can route you to:",
    `◦ Learn: ${BUSINESS_BLURBS.academy} — NDH Academy.`,
    `◦ Buy: ${BUSINESS_BLURBS.estore} — NDH eStore.`,
    `◦ Coming Soon for schools: ${BUSINESS_BLURBS.schooldesk} — NDH SchoolDesk.`,
    `◦ Build: ${BUSINESS_BLURBS.agency} — NDH Agency.`,
    `◦ Cooperative farming: ${BUSINESS_BLURBS.agricapital} — NDH AgriCapital.`,
    "Pick one, or describe your situation in your own words.",
  ].join("\n\n");
}

function routeCard(
  owner: SubsidiaryId,
  body: string,
  hrefOverride?: string,
  ctaOverride?: string,
): OmniCard {
  const subsidiary = SUBSIDIARIES.find((item) => item.id === owner);
  const coming = subsidiary?.state === "coming";
  const href = coming
    ? "/contact"
    : (hrefOverride ?? (subsidiary ? subsidiaryHref(subsidiary) : "/contact"));
  return {
    kind: "route",
    href,
    title: subsidiary ? bandLabel(`eco.${subsidiary.id}.name`) : "NDH",
    body,
    meta: coming ? "Coming Soon — enquiries only" : subsidiary?.domain,
    cta: coming ? "Ask about this upcoming business" : (ctaOverride ?? "Explore business"),
    external: !coming && !hrefOverride && Boolean(subsidiary?.external),
  };
}

function qualificationFor(intent: OmniIntent, profile: OmniProfile): OmniQualification | undefined {
  if (intent === "academy") {
    if (!profile.interest) return QUALIFICATIONS.interest;
    if (!profile.experience) return QUALIFICATIONS.experience;
    return undefined;
  }
  if (intent === "agency") {
    if (!profile.timeline) return QUALIFICATIONS.timeline;
    return QUALIFICATIONS.contact;
  }
  return undefined;
}

/** A short acknowledgement when someone answers the assistant's own question. */
function acknowledgement(intent: OmniIntent, profile: OmniProfile): string | null {
  if (intent === "agency" && profile.timeline) {
    const label =
      profile.timeline === "urgent"
        ? "Noted — this week."
        : profile.timeline === "normal"
          ? "Noted — a few weeks."
          : "Noted — still planning.";
    return `${label} A project manager would confirm what is realistic once the scope is clear.`;
  }
  if (intent === "academy" && profile.interest) {
    return `Good — ${profile.interest.toLowerCase()} it is.`;
  }
  return null;
}

export function respond(input: {
  messages: OmniMessage[];
  /** Auto-detected region, folded into the facts so answers fit the visitor. */
  region?: RegionId;
  limitCourses?: number;
}): OmniReply {
  const messages = input.messages.filter((m) => m.content.trim().length > 0);
  const lastUser = [...messages].reverse().find((m) => m.role === "user");
  const text = lastUser?.content ?? "";
  const profile = deriveProfile(messages);
  if (input.region) profile.facts.push(`Region: ${regionLabel(input.region)}`);

  const { intent: rawIntent, confidence, scores } = classifyIntent(text);

  // "How much does it cost?" with a clear business signal should still route.
  let intent = rawIntent;
  if (rawIntent === "pricing") {
    const alternative = Object.entries(scores)
      .filter(([key]) => key !== "pricing" && key !== "greeting")
      .sort((a, b) => b[1] - a[1])[0];
    if (alternative) intent = alternative[0] as OmniIntent;
  }

  // Continuity: a short reply continues the route that asked the question.
  const question = pendingQualification(messages);
  const route = question ? QUALIFICATION_ROUTE[question.id] : previousRoute(messages);
  const continued = continuesThread(text, messages, route);
  if (continued && route) {
    intent = route;
    profile.route = route;
  } else if (BUSINESS_INTENT_SET.has(intent)) {
    profile.route = intent as BusinessIntent;
  }

  // A price question phrased inside another need ("how much is a course") still
  // has to explain how pricing works for the business that owns the number.
  const pricingSignal =
    rawIntent === "pricing" ||
    /\b(price|pricing|cost|how much|fees?|pay|payment|charge|rate|quote|budget|prix|coût|combien|سعر|أسعار|تكلفة|كم)\b/i.test(
      text,
    );

  const chips = chipSet(intent);
  const cards: OmniCard[] = [];
  const lead: string[] = [];

  /* ---- conversation-level intents ---- */

  if (intent === "thanks") {
    return {
      intent,
      confidence,
      text: "Happy to help. If anything else comes up — a course, a product, a school platform or an idea — I am right here.",
      cards: [],
      chips,
      profile,
      owner: profile.route ? (ROUTE_COPY[profile.route].owner as SubsidiaryId) : undefined,
    };
  }

  if (intent === "about" || intent === "help" || intent === "greeting" || intent === "unknown") {
    const reply =
      intent === "about"
        ? aboutAnswer()
        : intent === "help"
          ? helpAnswer()
          : intent === "greeting"
            ? "Welcome to Najeeb Digital Hub. I route people across the whole family — learning, commerce, cooperative farming and managed digital delivery, with three platforms Coming Soon. What are you trying to do?"
            : "I can point you to the right business in the family. Tell me what you are trying to do, or pick one of these:";
    cards.push({
      kind: "summary",
      href: "/#businesses",
      title: "All seven businesses",
      body: "Browse the directory and open the one that fits.",
      meta: "ndh.com.ng",
      cta: "See the family",
    });
    return { intent, confidence, text: reply, cards, chips, profile };
  }

  if (intent === "contact") {
    return {
      intent,
      confidence,
      text: [
        `Visit us at ${SITE_CONTACT.address}. Call ${SITE_CONTACT.phone}, email ${SITE_CONTACT.email} or ${SITE_CONTACT.support}, or use WhatsApp.`,
        "Use the contact page for general enquiries or to ask about an upcoming platform. AgriCapital is for cooperative farming, not general startup fundraising. SchoolDesk, Travel and iHospital are Coming Soon.",
      ].join("\n\n"),
      cards: [
        {
          kind: "route",
          href: "/contact",
          title: "Contact the family",
          body: "One form reaches every business — projects, courses, products and school platforms.",
          meta: "ndh.com.ng/contact",
          cta: "Open the contact page",
        },
      ],
      chips,
      profile,
    };
  }

  if (intent === "pricing") {
    return { intent, confidence, text: pricingAnswer(), cards, chips, profile };
  }

  /* ---- a question that names more than one business ---- */

  const mentioned = mentionedSubsidiaries(text);

  /**
   * "I need a website and a course for my staff" names two needs without
   * naming two businesses. When the message joins them explicitly, answer for
   * both instead of dropping one.
   */
  if (mentioned.length === 0 && /\b(and|plus|also|as well as)\b|&/i.test(text)) {
    const routes = text
      .split(/\b(?:and|plus|also|as well as)\b|&/i)
      .map((clause) => ({ clause, intent: classifyIntent(clause).intent }))
      .filter(
        ({ intent: candidate, clause }) =>
          BUSINESS_INTENT_SET.has(candidate) &&
          !(
            candidate === "schooldesk" &&
            intent === "academy" &&
            !/(schooldesk|management|grading|report cards|records)/i.test(clause)
          ),
      )
      .map(({ intent: candidate }) => candidate as BusinessIntent);
    const distinct = [...new Set(routes)];
    if (distinct.length > 1) mentioned.push(...distinct.slice(0, 3));
  }

  if (mentioned.length > 1) {
    const known = mentioned.filter((id) => id in BUSINESS_BLURBS) as (
      BusinessIntent | "travel" | "ihospital"
    )[];
    for (const id of known.slice(0, 3)) {
      const subsidiary = SUBSIDIARIES.find((item) => item.id === id);
      if (!subsidiary) continue;
      cards.push(routeCard(id, BUSINESS_BLURBS[id]));
    }
    return {
      intent,
      confidence,
      text: `Different needs, different businesses in the family. ${known
        .slice(0, 3)
        .map((id) => `${bandLabel(`eco.${id}.name`)} is ${BUSINESS_BLURBS[id]}`)
        .join(", and ")}.`,
      cards,
      chips,
      profile,
    };
  }

  /* ---- academy: recommend from the catalogue ---- */

  if (intent === "academy") {
    const certificateQuestion = /(certificat\w*|credential\w*|verif\w*|serial|شهاد|تحقق)/i.test(
      text,
    );
    if (certificateQuestion || /(schools?|curriculum|60|six|écoles?|مدارس|ست)/i.test(text)) {
      return {
        intent,
        confidence,
        profile,
        owner: "academy",
        chips,
        text: `${ROUTE_COPY.academy.body}\n\n${ACADEMY_SCHOOLS.map((school) => `${school.name}: ${school.topics}`).join("\n")}\n\nSigned certificates can be checked at /verify.`,
        cards: [
          routeCard("academy", BUSINESS_PROFILES.academy.tagline),
          ...(certificateQuestion
            ? [
                {
                  kind: "route" as const,
                  href: "/verify",
                  title: "Verify an Academy certificate",
                  body: "Check the signed certificate using its verification details.",
                  cta: "Verify certificate",
                },
              ]
            : []),
        ],
      };
    }
    let matches = recommendCourses(text, { profile, limit: input.limitCourses ?? 3 });

    /**
     * A generic request ("I want to learn a digital skill") has nothing to match
     * against, so offer the catalogue's strongest starting points rather than
     * answering with no direction at all.
     */
    if (matches.length === 0) {
      matches = STARTER_COURSES.map((slug) => {
        const course = STATIC_COURSES.find((item) => item.slug === slug);
        return course ? { course, score: 0, reason: "A popular place to start" } : null;
      }).filter((match): match is CourseMatch => match !== null);
    }

    const note = continued ? acknowledgement("academy", profile) : null;
    const intro = ROUTE_COPY.academy;
    const body = [
      ...(note ? [note] : []),
      ...(pricingSignal ? [pricingAnswer()] : []),
      intro.body,
      matches.length > 0
        ? "These are matching courses from the gateway’s cached selection, not the full 60-course Academy catalogue. Confirm current availability on the official Academy site."
        : "Tell me the skill you want and I will pick the exact course from the catalogue.",
    ].join("\n\n");

    for (const match of matches) {
      cards.push({
        kind: "course",
        href: `/academy/${match.course.slug}`,
        title: match.course.title,
        body: match.course.summary,
        meta: `${match.course.school} · ${match.reason}`,
        cta: "View course",
      });
    }

    cards.push(routeCard("academy", "Explore the full official 60-course Academy scope."));

    return {
      intent,
      confidence,
      text: body,
      cards,
      chips,
      qualification: qualificationFor("academy", profile),
      profile,
      owner: "academy",
    };
  }

  /* ---- business routing intents ---- */

  const copy = ROUTE_COPY[intent as BusinessIntent];
  if (!copy) {
    return {
      intent: "unknown",
      confidence,
      text: helpAnswer(),
      cards: [],
      chips: chipSet("unknown"),
      profile,
    };
  }

  const note = continued ? acknowledgement(intent, profile) : null;
  if (note) lead.push(note);
  lead.push(copy.body);

  if (intent === "agency" && profile.timeline && !note) {
    lead.push(
      "When you are ready, send the brief — a project manager replies with scope and a fixed fee in writing.",
    );
  }

  cards.push(routeCard(copy.owner, copy.headline));

  if (question?.id === "contact" && continuesThread(text, messages, route)) {
    cards.push({
      kind: "route",
      href: "/contact",
      title: "Contact the family",
      body: "Send the brief in writing and a project manager replies with scope and a fixed fee.",
      meta: "ndh.com.ng/contact",
      cta: "Open the contact page",
    });
  }

  const qualification = qualificationFor(intent, profile);

  // After a few turns, offer a summary the person can hand over.
  const userTurns = messages.filter((m) => m.role === "user").length;
  if (userTurns >= 3 && profile.facts.length >= 2) {
    cards.push({
      kind: "summary",
      href: "/contact",
      title: "Your brief so far",
      body: profile.facts.slice(-4).join(" · "),
      meta: "Attach this when you contact the team",
      cta: "Send it to the team",
    });
  }

  return {
    intent,
    confidence,
    text: lead.join("\n\n"),
    cards,
    chips,
    qualification,
    profile,
    owner: copy.owner,
  };
}
