/**
 * Extra reading content for each NDH business page (/businesses/$id).
 * Names, roles and descriptions stay in business-profiles.ts; this file only
 * adds the cover photo and the "what's inside" lists.
 * Planned businesses describe intended scope, never launch dates or results.
 */
import type { SubsidiaryId } from "./ecosystem";
import agency from "@/assets/covers/agency.jpg";
import academy from "@/assets/covers/academy.jpg";
import farmfund from "@/assets/covers/agricapital.jpg";
import shopos from "@/assets/covers/estore.jpg";
import mall from "@/assets/covers/mall.jpg";
import cloud from "@/assets/covers/cloud.jpg";
import schoolos from "@/assets/covers/schooldesk.jpg";
import express from "@/assets/covers/express.jpg";
import pay from "@/assets/covers/pay.jpg";
import travel from "@/assets/covers/travel.jpg";
import health from "@/assets/covers/ihospital.jpg";
import foundation from "@/assets/covers/foundation.jpg";

export type BusinessDetail = {
  cover: string;
  audience: string;
  features: { title: string; body: string }[];
};

export const BUSINESS_DETAILS: Record<SubsidiaryId, BusinessDetail> = {
  academy: {
    cover: academy,
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
    cover: agency,
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
    cover: shopos,
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
    cover: schoolos,
    audience: "Schools — including integrated Conventional + Tahfeez schools.",
    features: [
      { title: "Conventional + tahfeez", body: "Run one section or both from a single platform." },
      { title: "Academics", body: "Students, classes, results and report cards." },
      { title: "Fees", body: "Billing, invoices, payment records and reminders." },
      { title: "Staff & payroll", body: "Staff records and salary processing in one place." },
    ],
  },
  farmfund: {
    cover: farmfund,
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
    cover: mall,
    audience: "Shoppers who want one trusted place to buy, and vendors who want reach.",
    features: [
      { title: "One front door", body: "Fashion, phones, electronics, home goods and more." },
      { title: "Vendor affiliates", body: "Partner sellers promote and sell through NDH." },
      { title: "Direct retail", body: "NDH-stocked products with clear pricing and delivery." },
      { title: "Buyer trust", body: "Verified sellers and NDH-handled support." },
    ],
  },
  cloud: {
    cover: cloud,
    audience: "Businesses that need AI tools, hosting and ready-made software.",
    features: [
      { title: "AI services", body: "Ready assistants and automations for daily work." },
      { title: "API hosting", body: "Run and scale APIs without managing servers." },
      { title: "Business software", body: "Tools for sales, records, finance and teams." },
      { title: "Managed setup", body: "The NDH team sets it up and supports it." },
    ],
  },
  express: {
    cover: express,
    audience: "Sellers and families who need parcels delivered fast.",
    features: [
      { title: "Local dispatch", body: "Pick-up and same-city drop-off." },
      { title: "Tracking", body: "Follow a parcel from dispatch to doorstep." },
      { title: "For merchants", body: "Built to plug into Mall and ShopOS orders." },
      { title: "Farm produce", body: "Planned haulage for FarmFund harvests." },
    ],
  },
  pay: {
    cover: pay,
    audience: "Merchants and buyers who want safe, clean payments.",
    features: [
      { title: "Processing", body: "Card and transfer checkout for merchants." },
      { title: "Billing", body: "Subscriptions, invoices and reminders." },
      { title: "Payouts", body: "Clear merchant and talent payouts." },
      { title: "Escrow", body: "Buyer-protection escrow until delivery is confirmed." },
    ],
  },
  travel: {
    cover: travel,
    audience: "Travellers, pilgrims and families planning a trip.",
    features: [
      { title: "Flights", body: "Reservations handled by real consultants." },
      { title: "Holidays", body: "Curated packages for families and groups." },
      { title: "Hajj & Umrah", body: "Guided pilgrimage travel support." },
      { title: "Documents", body: "Practical guidance on travel requirements." },
    ],
  },
  health: {
    cover: health,
    audience: "Clinics, hospitals and the patients they serve.",
    features: [
      { title: "Telemedicine", body: "Remote consultations that reach rural patients." },
      { title: "Clinic bookings", body: "Appointment scheduling and reminders." },
      { title: "Health records", body: "Digital records for providers." },
      { title: "Billing", body: "Clinic invoicing and payment records." },
    ],
  },
  foundation: {
    cover: foundation,
    audience: "Young people and communities who need a fair start.",
    features: [
      { title: "Scholarships", body: "Free digital-skills training for young people." },
      { title: "School drives", body: "Equipment and laptop drives for schools." },
      { title: "Outreach", body: "Community and charity programmes." },
      { title: "Open reporting", body: "Partners see where every naira goes." },
    ],
  },
};
