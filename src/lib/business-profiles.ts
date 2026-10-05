/** Owner-verified business reference, supplied 5 October 2026.
 * Describes business scope, not a live monitoring feed or a complete course catalogue.
 */
export const ACADEMY_SCHOOLS = [
  {
    name: "AI Engineering",
    topics: "Agents, No-Code Apps, Prompt Engineering, SaaS Launch, Automations",
  },
  {
    name: "Design & Brand",
    topics: "3D Product Animation, UI/UX, Brand Systems, Illustration, Retouching",
  },
  {
    name: "Media & Video",
    topics: "AI Video Generation, Video Editing, Podcast Production, YouTube Growth",
  },
  {
    name: "Writing & Content",
    topics: "Copywriting, Content Strategy, SEO & Blogging, Ghostwriting, E-books",
  },
  { name: "Marketing & Growth", topics: "Email Marketing, Paid Ads, CRO, Social Media Management" },
  {
    name: "Business & Operations",
    topics:
      "CRM Setup (HubSpot/GHL), Support, Virtual Assistance, Project Management, Data Analysis",
  },
] as const;

export const ACADEMY_SNAPSHOT = { courses: 60, schools: ACADEMY_SCHOOLS.length } as const;
export const AGENCY_SNAPSHOT = { departments: 10 } as const;

export const BUSINESS_PROFILES = {
  agency: {
    name: "NDH Agency",
    category: "Enterprise Digital Delivery",
    tagline:
      "Enterprise-grade engineering, design, and AI automation delivered through dedicated PM teams.",
    description:
      "A managed digital services bureau with 10 core departments, including Brand Strategy, UI/UX, Full-Stack Web/App Engineering, Custom AI Systems and Growth Marketing. Dedicated project managers enforce a confidential isolation layer: clients and talents never communicate directly.",
    point1: "PM-led quality control and milestone verification",
    point2: "Confidential client–talent separation and talent escrow payouts",
  },
  academy: {
    name: "NDH Academy",
    category: "Education & Tech Talent",
    tagline: "60 practical courses across 6 schools with verifiable certificates.",
    description:
      "60 practical AI-skills courses across AI Engineering, Design & Brand, Media & Video, Writing & Content, Marketing & Growth, and Business & Operations. Structured video lessons lead to capstone project deliverables and signed, cryptographically verifiable certificates.",
    point1: "Structured video lessons and pre-project readiness quizzes",
    point2: "Capstone deliverables and certificate verification at /verify",
  },
  agricapital: {
    name: "NDH AgriCapital",
    category: "Agriculture Investment & Cooperative Farming",
    tagline: "Transparent shared-ledger farming investments with automated harvest equity payouts.",
    description:
      "Contributors fund livestock and crop cycles via Paystack or direct transfer. Equity is calculated live from a shared contribution ledger. Farm operators log feeding, growth milestones and expenses; after harvest and sale, the admin closes the cycle and distributes profits in proportion to each contributor’s equity stake.",
    point1: "Shared contribution ledger and live equity calculations",
    point2: "Operator expense logs and proportional harvest profit distribution",
  },
  estore: {
    name: "NDH eStore",
    category: "Commerce & Retail Infrastructure",
    tagline: "Multi-vendor storefront engine powering local and cross-border commerce.",
    description:
      "A global storefront engine for digital and physical products. Merchants onboard automatically, manage products and inventory, and run custom storefronts at /store/:vendorSlug, with domestic and international shipping routes.",
    point1: "Paystack and Flutterwave checkout",
    point2: "Custom vendor storefronts and automated vendor payout ledgers",
  },
  schooldesk: {
    name: "NDH SchoolDesk",
    category: "Education Technology · Coming Soon",
    tagline: "EdTech operating system for school management, grading, and automated report cards.",
    description:
      "Coming Soon. A planned school operating system for management, grading and automated report cards. It is not yet available for onboarding or live school operations.",
    point1: "Planned school management and grading tools",
    point2: "Automated report cards · Coming Soon",
  },
  travel: {
    name: "NDH Travel",
    category: "Travel Services · Coming Soon",
    tagline: "Travel concierge, flight booking, and visa advisory services.",
    description:
      "Coming Soon. Travel concierge, flight booking and visa advisory services are in the pipeline; bookings and service availability are not yet open.",
    point1: "Planned concierge and flight booking services",
    point2: "Visa advisory · Coming Soon",
  },
  ihospital: {
    name: "NDH iHospital",
    category: "Digital Healthcare · Coming Soon",
    tagline: "Telemedicine and digital clinic management infrastructure.",
    description:
      "Coming Soon. Telemedicine and digital clinic management infrastructure are in development. The platform is not yet providing consultations or clinical services.",
    point1: "Planned telemedicine infrastructure",
    point2: "Digital clinic management · Coming Soon",
  },
} as const;
