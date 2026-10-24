/**
 * Extra reading content for each NDH business page (/businesses/$id).
 * Names, taglines and descriptions stay in business-profiles.ts; this file only
 * adds the cover photo and the "what's inside" lists.
 * Planned businesses describe intended scope, never launch dates or results.
 */
import type { SubsidiaryId } from "./ecosystem";
import agency from "@/assets/covers/agency.jpg";
import academy from "@/assets/covers/academy.jpg";
import agricapital from "@/assets/covers/agricapital.jpg";
import estore from "@/assets/covers/estore.jpg";
import mall from "@/assets/covers/mall.jpg";
import cloud from "@/assets/covers/cloud.jpg";
import schooldesk from "@/assets/covers/schooldesk.jpg";
import express from "@/assets/covers/express.jpg";
import pay from "@/assets/covers/pay.jpg";
import travel from "@/assets/covers/travel.jpg";
import ihospital from "@/assets/covers/ihospital.jpg";
import foundation from "@/assets/covers/foundation.jpg";

export type BusinessDetail = {
  cover: string;
  audience: string;
  features: { title: string; body: string }[];
};

export const BUSINESS_DETAILS: Record<SubsidiaryId, BusinessDetail> = {
  agency: {
    cover: agency,
    audience: "Businesses, founders and organisations that need digital work done properly.",
    features: [
      { title: "Websites & apps", body: "Full-stack web and mobile products, built and launched." },
      { title: "Brand & design", body: "Logos, brand systems and UI/UX that look sharp everywhere." },
      { title: "AI & automation", body: "Custom AI systems and workflows that save hours each week." },
      { title: "A dedicated PM", body: "One project manager handles your brief, milestones and quality." },
    ],
  },
  academy: {
    cover: academy,
    audience: "Learners who want practical AI skills they can earn with.",
    features: [
      { title: "60 courses", body: "Across six schools, from AI engineering to business operations." },
      { title: "Video lessons", body: "Short, structured lessons with readiness quizzes." },
      { title: "Real projects", body: "Every course ends with a capstone deliverable." },
      { title: "Verified certificates", body: "Anyone can check a certificate online." },
    ],
  },
  agricapital: {
    cover: agricapital,
    audience: "People who want to fund real farming cycles and share the harvest.",
    features: [
      { title: "Fund a cycle", body: "Contribute to livestock or crop cycles by card or transfer." },
      { title: "Shared ledger", body: "Your equity share is calculated openly from contributions." },
      { title: "Farm updates", body: "Operators log feeding, growth and expenses." },
      { title: "Harvest payouts", body: "Profits are shared by equity after harvest and sale." },
    ],
  },
  estore: {
    cover: estore,
    audience: "Shoppers and small vendors who want a simple online store.",
    features: [
      { title: "Many vendors", body: "Independent sellers run their own shop space." },
      { title: "Easy checkout", body: "Cart, checkout and order tracking in one place." },
      { title: "Seller tools", body: "Vendors manage products, stock and orders." },
      { title: "Buyer accounts", body: "Order history and saved details for repeat buyers." },
    ],
  },
  mall: {
    cover: mall,
    audience: "Shoppers looking for cars, fashion, electronics and more in one trusted place.",
    features: [
      { title: "One front door", body: "Many categories, from cars to clothing, in one mall." },
      { title: "Verified sellers", body: "NDH checks and promotes partner sellers." },
      { title: "Buyer trust", body: "Clear listings and support handled by NDH." },
      { title: "Partner sales", body: "Sellers grow through NDH promotion." },
    ],
  },
  cloud: {
    cover: cloud,
    audience: "Businesses that need AI tools, hosting and ready-made software.",
    features: [
      { title: "AI tools", body: "Ready AI assistants and automations for daily work." },
      { title: "Hosting", body: "Reliable hosting for websites and apps." },
      { title: "Business software", body: "Tools for sales, records and teams." },
      { title: "Support", body: "Setup help from the NDH team." },
    ],
  },
  schooldesk: {
    cover: schooldesk,
    audience: "Schools — including integrated Conventional + Islamiyya schools.",
    features: [
      { title: "Single or dual school", body: "Choose one section or both at setup." },
      { title: "Your own names", body: "Name classes, halqahs and groups the way you work." },
      { title: "Results & Tahfeez", body: "Scores, report cards and memorisation logs." },
      { title: "Fees & salaries", body: "Billing, payments and staff payroll in one place." },
    ],
  },
  express: {
    cover: express,
    audience: "Sellers and families who need parcels delivered fast.",
    features: [
      { title: "Doorstep delivery", body: "Pick-up and drop-off across the city." },
      { title: "Live tracking", body: "Follow your parcel from start to finish." },
      { title: "For sellers", body: "Built to work with NDH eStore and Mall." },
      { title: "Cold chain", body: "Planned support for fresh and farm goods." },
    ],
  },
  pay: {
    cover: pay,
    audience: "Merchants and buyers who want safe payments.",
    features: [
      { title: "Merchant payments", body: "Accept payments easily." },
      { title: "Escrow", body: "Money is held safely until delivery is confirmed." },
      { title: "Payouts", body: "Clear payouts for sellers and talents." },
      { title: "One wallet", body: "Planned use across the NDH family." },
    ],
  },
  travel: {
    cover: travel,
    audience: "Travellers, pilgrims and students going abroad.",
    features: [
      { title: "Flights & hotels", body: "Planned booking in one place." },
      { title: "Hajj & Umrah", body: "Planned guided packages." },
      { title: "Visa help", body: "Planned document guidance." },
      { title: "Study trips", body: "Planned support for students." },
    ],
  },
  ihospital: {
    cover: ihospital,
    audience: "Clinics, hospitals and their patients.",
    features: [
      { title: "Patient records", body: "Planned digital records for clinics." },
      { title: "Appointments", body: "Planned booking and reminders." },
      { title: "Billing", body: "Planned clinic billing." },
      { title: "Teleconsult", body: "Planned remote consultations." },
    ],
  },
  foundation: {
    cover: foundation,
    audience: "Young people and communities who need a fair start.",
    features: [
      { title: "Scholarships", body: "Planned free digital training for youth." },
      { title: "School drives", body: "Planned equipment and laptop drives." },
      { title: "Outreach", body: "Planned community and charity outreach." },
      { title: "Partners", body: "Planned work with donors and NGOs." },
    ],
  },
};
