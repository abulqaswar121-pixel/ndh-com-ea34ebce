/**
 * Offline mirror of the published NDH catalogue.
 *
 * Why this exists
 * ---------------
 * The public Academy, Blog and Agency surfaces read their content from
 * Supabase through `createServerFn`. If that read fails — a cold edge region,
 * a paused database, or a build sandbox without egress — the page would
 * otherwise render an "unavailable" state and look broken to a first-time
 * visitor.
 *
 * This is a partial cached selection, not the full official 60-course scope.
 * The official profile lives in business-profiles.ts; do not invent missing rows.
 * These entries are copied from the seed migrations
 * (supabase/migrations/*courses*, *posts*) so the fallback matches what the
 * database serves. When the live read succeeds it always wins; this module is
 * only ever consulted after an error is caught.
 *
 * Keep in sync: when a course or post is added in Supabase, add it here too.
 * The Omni-Hub AI consultant also reads this catalogue for course
 * recommendations, which is why it must mirror the published rows.
 */

export type StaticCoursePricing = {
  /** Nigerian naira price. */
  ng: number;
  /** Global (USD) price. */
  global: number;
};

export type StaticCourse = {
  slug: string;
  title: string;
  summary: string;
  school: string;
  ngn: number;
  usd: number;
  regionPricing: StaticCoursePricing;
};

export type StaticPost = {
  slug: string;
  title: string;
  excerpt: string;
  body: string;
  author_name: string;
  published_at: string;
  cover_image_url: string | null;
};

export const STATIC_COURSES: StaticCourse[] = [
  {
    slug: "ai-copywriting",
    title: "AI Copywriting",
    summary: "Write clear, persuasive copy for landing pages, ads and campaigns with AI.",
    school: "Writing & Content",
    ngn: 15000,
    usd: 25,
    regionPricing: { ng: 15000, global: 25 },
  },
  {
    slug: "ai-content-strategy",
    title: "AI Content Strategy",
    summary: "Plan, organise and scale a content system with AI-assisted research.",
    school: "Writing & Content",
    ngn: 15000,
    usd: 25,
    regionPricing: { ng: 15000, global: 25 },
  },
  {
    slug: "ai-blogging-and-seo",
    title: "AI Blogging & SEO",
    summary: "Create useful, search-aware articles with an AI-assisted workflow.",
    school: "Writing & Content",
    ngn: 15000,
    usd: 25,
    regionPricing: { ng: 15000, global: 25 },
  },
  {
    slug: "ai-scriptwriting",
    title: "AI Scriptwriting",
    summary: "Develop scripts for video, podcasts and short-form content.",
    school: "Writing & Content",
    ngn: 15000,
    usd: 25,
    regionPricing: { ng: 15000, global: 25 },
  },
  {
    slug: "ai-graphic-design",
    title: "AI Graphic Design",
    summary: "Create visual assets with AI design tools and a focused art direction process.",
    school: "Design & Brand",
    ngn: 18000,
    usd: 29,
    regionPricing: { ng: 18000, global: 29 },
  },
  {
    slug: "ai-branding-and-identity",
    title: "AI Branding & Identity",
    summary: "Build a coherent brand system with AI-assisted exploration and refinement.",
    school: "Design & Brand",
    ngn: 18000,
    usd: 29,
    regionPricing: { ng: 18000, global: 29 },
  },
  {
    slug: "ai-ui-ux-design",
    title: "AI UI/UX Design",
    summary: "Move from user needs to clear interfaces and prototypes with AI support.",
    school: "Design & Brand",
    ngn: 18000,
    usd: 29,
    regionPricing: { ng: 18000, global: 29 },
  },
  {
    slug: "ai-illustration",
    title: "AI Illustration",
    summary: "Direct and refine custom AI illustrations for a defined visual brief.",
    school: "Design & Brand",
    ngn: 18000,
    usd: 29,
    regionPricing: { ng: 18000, global: 29 },
  },
  {
    slug: "ai-video-editing",
    title: "AI Video Editing",
    summary: "Edit, caption and package video content with an AI-assisted workflow.",
    school: "Media & Video",
    ngn: 18000,
    usd: 29,
    regionPricing: { ng: 18000, global: 29 },
  },
  {
    slug: "ai-video-generation",
    title: "AI Video Generation",
    summary: "Explore AI video generation and shape usable visual sequences.",
    school: "Media & Video",
    ngn: 18000,
    usd: 29,
    regionPricing: { ng: 18000, global: 29 },
  },
  {
    slug: "ai-podcast-production",
    title: "AI Podcast Production",
    summary: "Plan, edit and package a podcast using AI-assisted production tools.",
    school: "Media & Video",
    ngn: 18000,
    usd: 29,
    regionPricing: { ng: 18000, global: 29 },
  },
  {
    slug: "ai-photography-and-retouching",
    title: "AI Photography & Retouching",
    summary: "Improve and prepare images with AI-assisted retouching techniques.",
    school: "Media & Video",
    ngn: 18000,
    usd: 29,
    regionPricing: { ng: 18000, global: 29 },
  },
  {
    slug: "ai-social-media-management",
    title: "AI Social Media Management",
    summary: "Plan social content and use AI to support publishing and review.",
    school: "Marketing & Growth",
    ngn: 18000,
    usd: 29,
    regionPricing: { ng: 18000, global: 29 },
  },
  {
    slug: "ai-paid-ads",
    title: "AI Paid Ads",
    summary: "Prepare paid advertising campaigns with AI-assisted research and creative work.",
    school: "Marketing & Growth",
    ngn: 18000,
    usd: 29,
    regionPricing: { ng: 18000, global: 29 },
  },
  {
    slug: "ai-email-marketing",
    title: "AI Email Marketing",
    summary: "Build useful email campaigns and flows with AI support.",
    school: "Marketing & Growth",
    ngn: 18000,
    usd: 29,
    regionPricing: { ng: 18000, global: 29 },
  },
  {
    slug: "prompt-engineering",
    title: "Prompt Engineering",
    summary: "Write structured prompts that produce more consistent AI results.",
    school: "AI Engineering",
    ngn: 25000,
    usd: 39,
    regionPricing: { ng: 25000, global: 39 },
  },
  {
    slug: "build-ai-agents",
    title: "Build AI Agents",
    summary: "Design practical agent workflows with AI tools and integrations.",
    school: "AI Engineering",
    ngn: 25000,
    usd: 39,
    regionPricing: { ng: 25000, global: 39 },
  },
  {
    slug: "no-code-ai-apps",
    title: "No-Code AI Apps",
    summary: "Turn a clear product idea into a working no-code AI application.",
    school: "AI Engineering",
    ngn: 25000,
    usd: 39,
    regionPricing: { ng: 25000, global: 39 },
  },
  {
    slug: "ai-workflow-automation",
    title: "AI Workflow Automation",
    summary: "Map repeatable work and connect tools into an AI-assisted workflow.",
    school: "AI Engineering",
    ngn: 25000,
    usd: 39,
    regionPricing: { ng: 25000, global: 39 },
  },
  {
    slug: "ai-virtual-assistant",
    title: "AI Virtual Assistant",
    summary: "Build modern virtual-assistant workflows supported by AI tools.",
    school: "Business & Operations",
    ngn: 20000,
    usd: 32,
    regionPricing: { ng: 20000, global: 32 },
  },
  {
    slug: "ai-customer-support",
    title: "AI Customer Support",
    summary: "Plan helpful AI-assisted support experiences for customers.",
    school: "Business & Operations",
    ngn: 20000,
    usd: 32,
    regionPricing: { ng: 20000, global: 32 },
  },
  {
    slug: "ai-project-management",
    title: "AI Project Management",
    summary: "Use AI to plan, track and report on project work.",
    school: "Business & Operations",
    ngn: 20000,
    usd: 32,
    regionPricing: { ng: 20000, global: 32 },
  },
  {
    slug: "ai-data-entry-and-analysis",
    title: "AI Data Entry & Analysis",
    summary: "Speed up structured data work and produce clearer analysis with AI.",
    school: "Business & Operations",
    ngn: 20000,
    usd: 32,
    regionPricing: { ng: 20000, global: 32 },
  },
  {
    slug: "ai-youtube-growth-management",
    title: "AI YouTube Growth Management",
    summary: "Audit a channel, plan content and use AI tools to guide growth decisions.",
    school: "Marketing & Growth",
    ngn: 18000,
    usd: 29,
    regionPricing: { ng: 18000, global: 29 },
  },
  {
    slug: "ai-linkedin-ghostwriting",
    title: "AI LinkedIn Ghostwriting",
    summary: "Write consistent LinkedIn posts in a defined founder voice.",
    school: "Writing & Content",
    ngn: 15000,
    usd: 25,
    regionPricing: { ng: 15000, global: 25 },
  },
  {
    slug: "ai-e-book-writing-and-design",
    title: "AI E-book Writing & Design",
    summary: "Create, design and package a non-fiction e-book from outline to export.",
    school: "Writing & Content",
    ngn: 15000,
    usd: 25,
    regionPricing: { ng: 15000, global: 25 },
  },
  {
    slug: "ai-3d-product-animation",
    title: "AI 3D Product Animation",
    summary: "Create a short product turntable from references and prepare delivery files.",
    school: "Design & Brand",
    ngn: 18000,
    usd: 29,
    regionPricing: { ng: 18000, global: 29 },
  },
  {
    slug: "ai-crm-setup-hubspot-gohighlevel",
    title: "AI CRM Setup — HubSpot/GoHighLevel",
    summary: "Map a sales process and configure a working CRM automation.",
    school: "Business & Operations",
    ngn: 20000,
    usd: 32,
    regionPricing: { ng: 20000, global: 32 },
  },
  {
    slug: "ai-conversion-rate-optimization",
    title: "AI Conversion Rate Optimization",
    summary: "Audit a landing page and recommend changes grounded in user behaviour.",
    school: "Marketing & Growth",
    ngn: 18000,
    usd: 29,
    regionPricing: { ng: 18000, global: 29 },
  },
  {
    slug: "saas-boilerplate-launch",
    title: "SaaS Boilerplate Launch",
    summary: "Configure and deploy a working SaaS starter with auth, billing and dashboard.",
    school: "AI Engineering",
    ngn: 25000,
    usd: 39,
    regionPricing: { ng: 25000, global: 39 },
  },
];

export const STATIC_POSTS: StaticPost[] = [
  {
    slug: "turning-a-business-idea-into-a-clear-digital-project-brief",
    title: "Turning a Business Idea into a Clear Digital Project Brief",
    excerpt:
      "A practical way to explain the problem, users, priorities and boundaries before digital work begins.",
    body: "A useful project brief does not need to be long. It needs to remove the most expensive forms of guesswork.\n\nStart with the problem\nDescribe what is currently difficult, slow or unreliable. Avoid beginning with a preferred feature. A team can propose a better route when it understands the real obstacle.\n\nName the people who will use it\nA client, administrator and field operator often need very different experiences. List the main users, what each one needs to achieve, and any information they should not see.\n\nSeparate essential outcomes from ideas\nWrite the three outcomes the first version must deliver. Keep additional ideas in a later list. This protects the budget and makes the first release easier to test.\n\nShare the working conditions\nMention the expected launch window, available content, existing tools, approval process and realistic budget range. Constraints are useful design information, not something to hide.\n\nDefine what success looks like\nUse observable outcomes: a report that takes minutes instead of days, a contribution history members can inspect, or a course a learner can complete on a phone. Avoid impressive-sounding numbers that have no evidence behind them.\n\nA clear brief is the beginning of a good working relationship. It gives the project manager enough context to ask sharper questions, agree the scope and match the right people to the work.",
    author_name: "Najeeb Digital Hub",
    published_at: "2026-10-02T09:00:00.000Z",
    cover_image_url: null,
  },
  {
    slug: "learning-ai-skills-that-hold-up-in-real-work",
    title: "Learning AI Skills That Hold Up in Real Work",
    excerpt:
      "The difference between trying an AI tool and building a repeatable skill you can use responsibly on a real project.",
    body: "AI tools can produce a quick first result, but professional work asks for more: judgement, verification and a repeatable process.\n\nLearn the task, not only the tool\nTools change quickly. The lasting skill is understanding the work around them: research, writing, image direction, data handling, review or delivery. Learn what a good result looks like before optimising for speed.\n\nWork from a clear input\nStrong outputs begin with context. Define the audience, purpose, format, constraints and source material. Treat prompting as briefing a capable assistant rather than entering a magic phrase.\n\nBuild a review habit\nCheck facts, names, calculations, links, permissions and tone. For visual work, inspect small details and remove accidental text or misleading elements. AI assistance does not transfer responsibility away from the person delivering the work.\n\nKeep evidence of your process\nSave the brief, key decisions, revisions and final checks. This makes the work easier to improve and gives a reviewer something concrete to assess.\n\nFinish with a real project\nA skill becomes useful when it survives a complete task. Build something for a realistic audience, follow a rubric and respond to feedback. That is why NDH Academy courses connect lessons to a project rather than stopping at passive video watching.\n\nThe goal is not to use AI everywhere. It is to know where it helps, where human judgement is essential and how to deliver work that another person can trust.",
    author_name: "Najeeb Digital Hub",
    published_at: "2026-10-03T09:00:00.000Z",
    cover_image_url: null,
  },
  {
    slug: "what-to-review-before-digital-work-goes-live",
    title: "What to Review Before Digital Work Goes Live",
    excerpt:
      "A focused final review for clarity, access, content, payments and the small-screen experience.",
    body: "Launch review is not only a final glance at the home page. It is a structured check of the paths people will actually take.\n\nFollow complete journeys\nStart as a new visitor. Find the service or course, open the details, complete the important action and confirm what happens next. Repeat the journey as each signed-in role when the product has different portals.\n\nCheck the words and evidence\nRemove placeholder copy, unsupported claims and outdated links. Confirm names, prices, dates and contact details. Every image should help explain the subject and should not pretend to show a delivered result when it is only editorial.\n\nTest the smallest screen\nUse portrait and landscape views. Look for clipped headings, hidden controls, crowded navigation and forms that are difficult to complete. A layout that works on a desktop can still fail when a phone rotates.\n\nTest money and messages\nFor paid products, complete a controlled payment and confirm the receipt, access change and transaction record. Trigger important emails and confirm both the sender and recipient experience.\n\nReview permissions\nA public visitor should not see private course material or project files. A signed-in user should see only the work connected to their role. Administrative actions must be checked on the server, not only hidden in the interface.\n\nPrepare a recovery route\nErrors should explain what the person can do next. Keep a support route visible, preserve records needed to investigate, and make sure a failed payment or upload can be retried safely.\n\nGood launch review is quiet work, but it protects trust. The goal is not to claim perfection; it is to find the expensive problems before a real user does.",
    author_name: "Najeeb Digital Hub",
    published_at: "2026-10-04T09:00:00.000Z",
    cover_image_url: null,
  },
];

/** Six Academy schools, derived from the course list. */
export const STATIC_SCHOOLS = Array.from(new Set(STATIC_COURSES.map((c) => c.school)));

export function findStaticCourse(slug: string): StaticCourse | undefined {
  return STATIC_COURSES.find((course) => course.slug === slug);
}

export function findStaticPost(slug: string): StaticPost | undefined {
  return STATIC_POSTS.find((post) => post.slug === slug);
}
