/**
 * Extra reading content for each NDH business page (/businesses/$id).
 * Names, roles and descriptions stay in business-profiles.ts; this file only
 * adds the cover photo and the "what's inside" lists.
 * Planned businesses describe intended scope, never launch dates or results.
 */
import type { SubsidiaryId } from "./ecosystem";
import agencyFull from "@/assets/covers/agency-1280.webp";
import agencyCard from "@/assets/covers/agency-640.webp";
import academyFull from "@/assets/covers/academy-1280.webp";
import academyCard from "@/assets/covers/academy-640.webp";
import farmfundFull from "@/assets/covers/agricapital-1280.webp";
import farmfundCard from "@/assets/covers/agricapital-640.webp";
import shoposFull from "@/assets/covers/estore-1280.webp";
import shoposCard from "@/assets/covers/estore-640.webp";
import mallFull from "@/assets/covers/mall-1280.webp";
import mallCard from "@/assets/covers/mall-640.webp";
import cloudFull from "@/assets/covers/cloud-1280.webp";
import cloudCard from "@/assets/covers/cloud-640.webp";
import schoolosFull from "@/assets/covers/schooldesk-1280.webp";
import schoolosCard from "@/assets/covers/schooldesk-640.webp";
import expressFull from "@/assets/covers/express-1280.webp";
import expressCard from "@/assets/covers/express-640.webp";
import payFull from "@/assets/covers/pay-1280.webp";
import payCard from "@/assets/covers/pay-640.webp";
import travelFull from "@/assets/covers/travel-1280.webp";
import travelCard from "@/assets/covers/travel-640.webp";
import healthFull from "@/assets/covers/ihospital-1280.webp";
import healthCard from "@/assets/covers/ihospital-640.webp";
import foundationFull from "@/assets/covers/foundation-1280.webp";
import foundationCard from "@/assets/covers/foundation-640.webp";

export type BusinessDetail = {
  /** 1280px WebP for the profile hero. */
  cover: string;
  /** 640px WebP for directory cards and menu thumbnails. */
  coverSmall: string;
  audience: string;
  features: { title: string; body: string }[];
};

export const BUSINESS_DETAILS: Record<SubsidiaryId, BusinessDetail> = {
  academy: {
    cover: academyFull,
    coverSmall: academyCard,
    audience: "Learners who want practical digital skills they can earn with.",
    features: [
      { title: "60 courses", body: "Six schools, from AI engineering to business operations." },
      { title: "Structured lessons", body: "Short video lessons with readiness quizzes." },
      { title: "Real projects", body: "Every course ends with a capstone deliverable." },
      {
        title: "Verified certificates",
        body: "Anyone can check a certificate online before hiring.",
      },
    ],
  },
  agency: {
    cover: agencyFull,
    coverSmall: agencyCard,
    audience: "Businesses, founders and organisations that need digital work done properly.",
    features: [
      {
        title: "Web engineering",
        body: "Full-stack websites, platforms and apps, built and launched.",
      },
      {
        title: "Brand & design",
        body: "Logos, brand systems and UI/UX that look sharp everywhere.",
      },
      {
        title: "AI & automation",
        body: "Custom AI systems and workflows that save hours each week.",
      },
      {
        title: "A dedicated PM",
        body: "One project manager owns your brief, milestones and quality.",
      },
    ],
  },
  shopos: {
    cover: shoposFull,
    coverSmall: shoposCard,
    audience: "Small businesses, traders and boutiques moving sales online.",
    features: [
      { title: "Custom shop", body: "Your own branded storefront with products and categories." },
      { title: "Payments built in", body: "Collect payment at checkout with order tracking." },
      {
        title: "Marketing tools",
        body: "Discounts, campaigns and customer lists in the dashboard.",
      },
      { title: "Low plans", body: "Affordable monthly or yearly pricing, no developer needed." },
    ],
  },
  schoolos: {
    cover: schoolosFull,
    coverSmall: schoolosCard,
    audience: "Nursery, primary and secondary schools, plus colleges.",
    features: [
      {
        title: "Admissions & records",
        body: "Student admissions, class placement, guardians and documents in one register.",
      },
      {
        title: "CA & exams",
        body: "Continuous assessment and exam scores tallied without a single spreadsheet.",
      },
      {
        title: "Auto-graded report cards",
        body: "Term reports and instant broadsheets generated straight from recorded scores.",
      },
      {
        title: "Fees & receipts (₦)",
        body: "Invoices, naira receipts, fee-debt tracking and payment reminders per family.",
      },
      {
        title: "Staff payroll",
        body: "Staff records, allowances and salary runs in the same system as academics.",
      },
      {
        title: "Parent portal",
        body: "Parents check results, fees and notices — with SMS and WhatsApp alerts.",
      },
    ],
  },
  farmfund: {
    cover: farmfundFull,
    coverSmall: farmfundCard,
    audience: "People who want to fund real farming cycles and share the harvest.",
    features: [
      {
        title: "Verified cycles",
        body: "Fund livestock or crop cycles that have passed verification.",
      },
      {
        title: "Shared ledger",
        body: "Your equity share is calculated openly from contributions.",
      },
      {
        title: "Operator tracking",
        body: "Operators log feeding, growth milestones and expenses.",
      },
      { title: "Harvest payouts", body: "Profits shared by equity after harvest and sale." },
    ],
  },
  mall: {
    cover: mallFull,
    coverSmall: mallCard,
    audience: "Shoppers who want one trusted place to buy, and vendors who want reach.",
    features: [
      { title: "One front door", body: "Fashion, phones, electronics, home goods and more." },
      { title: "Vendor affiliates", body: "Partner sellers promote and sell through NDH." },
      { title: "Direct retail", body: "NDH-stocked products with clear pricing and delivery." },
      { title: "Buyer trust", body: "Verified sellers and NDH-handled support." },
    ],
  },
  cloud: {
    cover: cloudFull,
    coverSmall: cloudCard,
    audience: "Businesses that need AI tools, hosting and ready-made software.",
    features: [
      { title: "AI services", body: "Ready assistants and automations for daily work." },
      { title: "API hosting", body: "Run and scale APIs without managing servers." },
      { title: "Business software", body: "Tools for sales, records, finance and teams." },
      { title: "Managed setup", body: "The NDH team sets it up and supports it." },
    ],
  },
  express: {
    cover: expressFull,
    coverSmall: expressCard,
    audience: "Sellers and families who need parcels delivered fast.",
    features: [
      { title: "Local dispatch", body: "Pick-up and same-city drop-off." },
      { title: "Tracking", body: "Follow a parcel from dispatch to doorstep." },
      { title: "For merchants", body: "Built to plug into Mall and ShopOS orders." },
      { title: "Farm produce", body: "Planned haulage for FarmFund harvests." },
    ],
  },
  pay: {
    cover: payFull,
    coverSmall: payCard,
    audience: "Merchants and buyers who want safe, clean payments.",
    features: [
      { title: "Processing", body: "Card and transfer checkout for merchants." },
      { title: "Billing", body: "Subscriptions, invoices and reminders." },
      { title: "Payouts", body: "Clear merchant and talent payouts." },
      { title: "Escrow", body: "Buyer-protection escrow until delivery is confirmed." },
    ],
  },
  travel: {
    cover: travelFull,
    coverSmall: travelCard,
    audience: "Travellers, pilgrims and families planning a trip.",
    features: [
      { title: "Flights", body: "Reservations handled by real consultants." },
      { title: "Holidays", body: "Curated packages for families and groups." },
      { title: "Hajj & Umrah", body: "Guided pilgrimage travel support." },
      { title: "Documents", body: "Practical guidance on travel requirements." },
    ],
  },
  health: {
    cover: healthFull,
    coverSmall: healthCard,
    audience: "Clinics, hospitals and the patients they serve.",
    features: [
      { title: "Telemedicine", body: "Remote consultations that reach rural patients." },
      { title: "Clinic bookings", body: "Appointment scheduling and reminders." },
      { title: "Health records", body: "Digital records for providers." },
      { title: "Billing", body: "Clinic invoicing and payment records." },
    ],
  },
  foundation: {
    cover: foundationFull,
    coverSmall: foundationCard,
    audience: "Young people and communities who need a fair start.",
    features: [
      { title: "Scholarships", body: "Free digital-skills training for young people." },
      { title: "School drives", body: "Equipment and laptop drives for schools." },
      { title: "Outreach", body: "Community and charity programmes." },
      { title: "Open reporting", body: "Partners see where every naira goes." },
    ],
  },
};
