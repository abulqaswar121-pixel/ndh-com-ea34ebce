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
    name: "NDH FarmFund",
    category: "Agriculture Investment & Cooperative Farming",
    tagline: "Transparent shared-ledger farming investments with automated harvest equity payouts.",
    description:
      "Contributors fund livestock and crop cycles via Paystack or direct transfer. Equity is calculated live from a shared contribution ledger. Farm operators log feeding, growth milestones and expenses; after harvest and sale, the admin closes the cycle and distributes profits in proportion to each contributor’s equity stake.",
    point1: "Shared contribution ledger and live equity calculations",
    point2: "Operator expense logs and proportional harvest profit distribution",
  },
  estore: {
    name: "NDH Market",
    category: "Commerce & Retail Infrastructure",
    tagline: "Multi-vendor storefront engine powering local and cross-border commerce.",
    description:
      "A global storefront engine for digital and physical products. Merchants onboard automatically, manage products and inventory, and run custom storefronts at /store/:vendorSlug, with domestic and international shipping routes.",
    point1: "Paystack and Flutterwave checkout",
    point2: "Custom vendor storefronts and automated vendor payout ledgers",
  },
  schooldesk: {
    name: "NDH SchoolOS",
    category: "Education Technology · Coming Soon",
    tagline: "Run a single or integrated (Conventional + Islamiyya) school: results, Tahfeez, fees and salaries.",
    description:
      "Coming Soon. A school operating system for single and integrated Conventional + Islamiyya schools: students, results, report cards, Tahfeez records, fees and staff salaries. Not yet open for onboarding.",
    point1: "Planned school management and grading tools",
    point2: "Automated report cards · Coming Soon",
  },
  travel: {
    name: "NDH Travel",
    category: "Travel Services · Coming Soon",
    tagline: "Flights, hotels, Umrah packages and visa guidance.",
    description:
      "Coming Soon. Travel concierge, flight booking and visa advisory services are in the pipeline; bookings and service availability are not yet open.",
    point1: "Planned concierge and flight booking services",
    point2: "Visa advisory · Coming Soon",
  },
  mall: {
    name: "NDH Mall",
    category: "Shopping Marketplace · Coming Soon",
    tagline: "One trusted online mall for cars, fashion, phones, electronics and home goods.",
    description:
      "Coming Soon. A Jumia-style shopping mall where buyers see one trusted NDH storefront, while NDH promotes and sells verified partner products on commission. Orders are not open yet.",
    point1: "Cars, fashion, phones, electronics and home goods",
    point2: "Verified partner sellers · Coming Soon",
  },
  cloud: {
    name: "NDH Cloud",
    category: "AI, Software & Hosting · Coming Soon",
    tagline: "Ready AI tools, business software and website hosting under one roof.",
    description:
      "Coming Soon. AI assistants, automation tools, ready business software such as invoicing and inventory, plus website hosting and domains for African businesses.",
    point1: "AI assistants and business automation",
    point2: "Business software and hosting · Coming Soon",
  },
  express: {
    name: "NDH Express",
    category: "Delivery & Logistics · Coming Soon",
    tagline: "City dispatch and doorstep parcel delivery.",
    description:
      "Coming Soon. Bikes and vans for parcels, documents and farm produce, built to serve NDH Market, NDH Mall and NDH FarmFund first.",
    point1: "Doorstep parcel and document delivery",
    point2: "Farm produce haulage · Coming Soon",
  },
  pay: {
    name: "NDH Pay",
    category: "Payments & Escrow · Coming Soon",
    tagline: "Safe checkout and escrow that holds money until delivery is confirmed.",
    description:
      "Coming Soon. Merchant checkout and buyer protection escrow for sellers, freelancers and customers across the NDH family.",
    point1: "Merchant checkout and payment links",
    point2: "Buyer protection escrow · Coming Soon",
  },
  foundation: {
    name: "NDH Foundation",
    category: "Community Impact · Coming Soon",
    tagline: "Tech scholarships and support for young people and schools.",
    description:
      "Coming Soon. The giving arm of NDH: free digital-skills scholarships, school equipment drives and community outreach.",
    point1: "Digital-skills scholarships for young people",
    point2: "School and community outreach · Coming Soon",
  },
  ihospital: {
    name: "NDH Health",
    category: "Digital Healthcare · Coming Soon",
    tagline: "Online doctor visits, health records and digital clinics.",
    description:
      "Coming Soon. Telemedicine and digital clinic management infrastructure are in development. The platform is not yet providing consultations or clinical services.",
    point1: "Planned telemedicine infrastructure",
    point2: "Digital clinic management · Coming Soon",
  },
} as const;
