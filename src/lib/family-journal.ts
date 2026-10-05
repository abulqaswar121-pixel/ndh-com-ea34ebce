/** Evergreen editorial guides. No invented publication dates or company milestones. */
export const FAMILY_ARTICLES = [
  {
    slug: "finding-your-place-in-the-ndh-family",
    title: "One family, different doors: where to start with NDH",
    excerpt:
      "From learning a skill to running a storefront or contributing to a farm cycle, start with the outcome you need — then find the business built around it.",
    category: "The NDH family",
    author_name: "NDH Editorial",
    published_at: null,
    cover_image_url: "/images/ndh-hero-960.webp",
    sections: [
      {
        heading: "Start with the need, not the name",
        body: "It is easy to arrive at a digital platform knowing you need help, but not knowing which service to choose. Start with a simple sentence: ‘I want to…’ Learn a useful skill. Build something for my business. Run a storefront. Join a cooperative farm cycle. That sentence is a better starting point than a list of features.",
      },
      {
        heading: "Choose a focused starting point",
        body: "NDH Academy offers 60 practical AI-skills courses across 6 specialized schools, with readiness quizzes, capstones and signed verifiable certificates. NDH Agency delivers engineering, design and AI services through dedicated PM teams. NDH eStore powers multi-vendor digital and physical storefronts. NDH AgriCapital, formerly Venture, supports cooperative farm-cycle investment using a transparent shared contribution ledger.",
      },
      {
        heading: "A connected need can involve more than one business",
        body: "You might want to learn how to manage a website and also need help building it. A school might need an operational platform as well as learning support for its team. Describe both needs when you get in touch. You do not need to reduce a real problem to one category just to start a conversation.",
      },
      {
        heading: "Check what is available today",
        body: "The family directory separates available businesses from those still in the pipeline. NDH SchoolDesk, Travel and iHospital are Coming Soon, not services you should assume are ready to use. Check the destination page and confirm availability directly before making plans or sharing sensitive information.",
      },
      {
        heading: "Take one useful next step",
        body: "Explore the relevant business, write down one question, and get in touch if the fit is unclear. Tell us your goal, what you have already tried and any timing that matters. A clear starting point is more useful than a perfect brief.",
      },
    ],
  },
  {
    slug: "before-your-school-adopts-a-digital-platform",
    title: "Before your school adopts a digital platform",
    excerpt:
      "A practical checklist for understanding routines, protecting records and helping people adjust to a new way of working.",
    category: "Schools & systems",
    author_name: "NDH Editorial",
    published_at: null,
    cover_image_url: "/images/ndh-academy-960.webp",
    sections: [
      {
        heading: "Map the routine you want to improve",
        body: "Start with one workflow: attendance, communicating with families, recording results or finding student information. Write down who does each step, what they need and where delays happen. A digital platform should make that routine clearer rather than simply move a confusing process onto a screen.",
      },
      {
        heading: "Decide who needs access",
        body: "A teacher, an administrator and a parent do not need the same view of a school’s records. Before evaluating a platform, list each role and the information that role should be able to see or change. Ask the provider how access is granted, reviewed and removed when someone leaves.",
      },
      {
        heading: "Treat student information with care",
        body: "Collect only the information needed for the task. Ask where records are stored, how they can be exported, what happens if something is entered incorrectly and how deletion requests are handled. Do not upload real student records into an unfamiliar demonstration account just to see how it works.",
      },
      {
        heading: "Plan for the way your school actually works",
        body: "Consider the devices staff use, connectivity, busy reporting periods and the time available for training. Try a small, agreed workflow before changing everything at once. Keep a clear backup process for interruptions and name someone staff can contact when they get stuck.",
      },
      {
        heading: "Evaluate a tool against your needs",
        body: "Write down the questions your school needs answered before a demonstration. SchoolDesk is the NDH family’s upcoming school-management, grading and automated-report-card platform. It is Coming Soon, not available for live onboarding or school operations. Ask about plans without assuming a launch date or feature availability. The right decision depends on a practical fit, not the longest feature list.",
      },
    ],
  },
  {
    slug: "make-a-digital-resource-work-for-you",
    title: "A template is a starting point, not a finished system",
    excerpt:
      "How to choose a digital resource, adapt it to a real task and avoid adding another unused file to your collection.",
    category: "Tools & everyday work",
    author_name: "NDH Editorial",
    published_at: null,
    cover_image_url: "/images/ndh-agency-work-960.webp",
    sections: [
      {
        heading: "Name the job before choosing the tool",
        body: "A useful resource solves a task you can describe. That might be planning a week of content, organising customer enquiries or keeping a project checklist. If you cannot name the task, pause before downloading another template. More files do not automatically make work easier.",
      },
      {
        heading: "Check the practical details",
        body: "Look at the required software, file format, licence and instructions. Can you use it on the device you have? Does it need a separate account or application? Is it intended for personal work, a team or client use? Confirm these details on the product page or with the seller rather than making assumptions.",
      },
      {
        heading: "Adapt it with a small real example",
        body: "Keep an untouched copy, then try the resource with one small task. Replace the sample text, remove fields you do not need and use labels your team understands. Do not put confidential information into a shared file until you have checked who can access it.",
      },
      {
        heading: "Build a routine around it",
        body: "Decide who will update the resource, when it will be reviewed and where the current version will live. A simple file used consistently often helps more than an elaborate system nobody maintains. Review the result after a few uses and change what gets in the way.",
      },
      {
        heading: "Know when you need a different kind of help",
        body: "NDH eStore is a multi-vendor commerce platform for digital and physical products, with merchant onboarding, custom storefronts, inventory, shipping and vendor payout ledgers. A digital resource may be one product in that wider marketplace; it does not define the platform’s full scope. If your challenge is learning how to use a tool, explore Academy. If it needs custom delivery, explore Agency. Choose the level of support that matches the task rather than forcing a ready-made resource to do everything.",
      },
    ],
  },
];

export function familyArticle(slug: string) {
  const article = FAMILY_ARTICLES.find((item) => item.slug === slug);
  return article
    ? {
        ...article,
        body: article.sections.map((section) => `${section.heading}\n${section.body}`).join("\n\n"),
      }
    : null;
}

/** Bundled covers keep the seeded articles readable without an external image CDN. */
export function journalCover(slug: string, storedUrl?: string | null) {
  const localCovers: Record<string, string> = {
    "turning-a-business-idea-into-a-clear-digital-project-brief": "/images/ndh-hero-960.webp",
    "learning-ai-skills-that-hold-up-in-real-work": "/images/ndh-academy-960.webp",
    "what-to-review-before-digital-work-goes-live": "/images/ndh-agency-work-960.webp",
  };
  return localCovers[slug] ?? storedUrl ?? "/images/ndh-hero-960.webp";
}
