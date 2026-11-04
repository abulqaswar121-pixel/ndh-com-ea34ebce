/** Owner-verified business reference for the NDH ecosystem.
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

/**
 * `role` is the one-line description the owner uses for each business — it is
 * printed on the directory card, the profile page and inside the Studio.
 */
export const BUSINESS_PROFILES = {
  academy: {
    name: "NDH Academy",
    role: "Tech, digital skills & certified professional training.",
    category: "Education & Tech Talent",
    tagline: "Practical AI and digital skills, taught properly and certified publicly.",
    description:
      "A practical learning platform for tech and digital skills. 60 courses across six schools — AI Engineering, Design & Brand, Media & Video, Writing & Content, Marketing & Growth, Business & Operations — take learners from foundations to a real capstone and a verifiable certificate employers can check.",
    point1: "Structured lessons, readiness quizzes and real capstone projects",
    point2: "Certificates anyone can verify before hiring",
  },
  agency: {
    name: "NDH Agency",
    role: "Managed digital services, web engineering, branding & project talent.",
    category: "Enterprise Digital Delivery",
    tagline: "A managed digital services bureau for serious work.",
    description:
      "Web engineering, brand systems, UI/UX, AI automation and growth marketing delivered by vetted specialists under a dedicated project manager. Scope, milestones and quality checks are agreed up front, so clients get finished work instead of a folder of loose files.",
    point1: "One project manager owns your brief, timeline and quality",
    point2: "Engineering, branding, automation and talent under one contract",
  },
  shopos: {
    name: "NDH ShopOS",
    role: "Cloud online store builder for small businesses.",
    category: "Commerce · Cloud Storefronts",
    tagline: "Launch a real online shop in minutes, on a low monthly or yearly plan.",
    description:
      "A cloud store builder for small businesses. Create a custom shop with product catalogue, checkout, payment collection and marketing tools on affordable monthly or yearly plans — no developer, no hosting bill, no code. Built for traders, boutiques, pharmacies, food vendors and service businesses moving online.",
    point1: "Payments, orders and marketing tools in one dashboard",
    point2: "Low monthly or yearly plans with no technical setup",
  },
  schoolos: {
    name: "NDH SchoolOS",
    role: "Complete operating system for modern schools & colleges.",
    category: "Education Technology · School Management",
    tagline: "Admissions, CA & exams, auto-graded report cards, fees, payroll and a parent portal.",
    description:
      "A universal school management platform for nursery, primary, secondary schools and colleges: student admissions, continuous assessment (CA and exams), auto-graded report cards, school fees and receipts in naira, staff payroll and a parent portal. Zero spreadsheet headaches, fee debt tracking, instant broadsheets and parent SMS/WhatsApp notices.",
    point1: "Zero spreadsheet headaches, with fee debt tracking for every family",
    point2: "Instant broadsheets and parent SMS/WhatsApp notices",
  },
  farmfund: {
    name: "NDH FarmFund",
    role: "Agricultural investment platform with verified farming cycles.",
    category: "Agriculture · Investment",
    tagline: "Fund verified farming cycles and share the harvest, transparently.",
    description:
      "An agricultural investment platform. Investors fund verified farming cycles and share profits at harvest, while operators log feeding, growth and expenses in the open. Every contribution builds a shared ledger, and payouts are distributed in proportion to each investor's equity stake at cycle close.",
    point1: "Verified cycles with operator tracking you can follow",
    point2: "Transparent shared ledger and proportional harvest payouts",
  },
  mall: {
    name: "NDH Mall",
    role: "Consumer shopping, vendor affiliate platform and direct product retail.",
    category: "Shopping Marketplace",
    tagline: "One trusted online mall for everyday shopping.",
    description:
      "In development. A consumer shopping platform combining a vendor affiliate programme with direct NDH product retail — one trusted storefront, verified sellers, NDH fulfilment and a single checkout across fashion, phones, electronics, home goods and more.",
    point1: "Vendor affiliate programme plus direct NDH retail",
    point2: "One trusted checkout and delivery promise",
  },
  cloud: {
    name: "NDH Cloud",
    role: "Software, AI services, API hosting and business automation tools.",
    category: "AI, Software & Hosting",
    tagline: "The software, AI and hosting layer for African businesses.",
    description:
      "In development. Ready-made software, managed AI services, API hosting and business automation — the infrastructure layer every other NDH business, and any African business, can build on.",
    point1: "AI services and API hosting with managed setup",
    point2: "Business automation tools for sales, finance and support",
  },
  express: {
    name: "NDH Express",
    role: "Logistics, local parcel dispatch and delivery network.",
    category: "Logistics",
    tagline: "Same-city dispatch that keeps a promise.",
    description:
      "In development. A local parcel dispatch and delivery network for documents, online orders and farm produce — built to serve NDH Mall, NDH ShopOS merchants and NDH FarmFund first, then opened to every business in the city.",
    point1: "Same-city dispatch with tracking from pickup to doorstep",
    point2: "Built to plug into Mall, ShopOS and FarmFund orders",
  },
  pay: {
    name: "NDH Pay",
    role: "Modern payment processing, billing and merchant payouts.",
    category: "Payments & Billing",
    tagline: "Payments, billing and payouts that settle cleanly.",
    description:
      "In development. Modern payment processing for the family: card and transfer checkout, subscription billing, invoicing and merchant payouts, with buyer-protection escrow for marketplaces and service work.",
    point1: "Checkout, subscriptions and invoices in one account",
    point2: "Merchant payouts and buyer-protection escrow",
  },
  travel: {
    name: "NDH Travel",
    role: "Travel booking, flight reservations and holiday packages.",
    category: "Travel Services",
    tagline: "Book flights, plan holidays, travel lightly.",
    description:
      "In development. Seamless travel booking: flight reservations, holiday packages, hotel stays and Hajj/Umrah guidance, handled by real travel consultants instead of an unhelpful search box.",
    point1: "Flight reservations and curated holiday packages",
    point2: "Consultant-supported bookings for families and groups",
  },
  health: {
    name: "NDH Health",
    role: "Telemedicine, clinic bookings and digital health records.",
    category: "Digital Healthcare",
    tagline: "Digital care that reaches the last mile.",
    description:
      "In development. Telemedicine consultations, clinic appointment booking and digital health records for clinics and hospitals — designed to reduce queues and keep patient history with the clinician who needs it.",
    point1: "Telemedicine consultations and clinic bookings",
    point2: "Secure digital health records for providers",
  },
  foundation: {
    name: "NDH Foundation",
    role: "Non-profit initiatives, tech scholarships and community youth impact.",
    category: "Community Impact",
    tagline: "The giving arm: scholarships, skills and community impact.",
    description:
      "In development. The non-profit arm of NDH: tech scholarships, free digital-skills training for young people, school equipment drives and community outreach, funded by partners and reported openly.",
    point1: "Tech scholarships and free digital-skills training",
    point2: "Open reporting on every funded programme",
  },
} as const;
