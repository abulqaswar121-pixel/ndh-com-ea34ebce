# Go-Live Plan — Najeeb Digital Hub

Findings below come from reading the live code, the preview console log, and querying the database directly.

## What is actually broken right now

1. **Sign up / sign in fails ("currently unavailable")**
   The preview console shows `Missing Supabase environment variable(s)` thrown from the signup form. The backend keys exist in the project env, so the failure is the browser bundle, not the backend. Fix: make the auth client read the config safely and never throw during render, show a real error message instead of a dead button, then force a clean rebuild and re-test both email and Google sign-in end to end in a real browser before reporting back.

2. **Academy is fake — no course detail pages, no prices**
   `src/routes/academy.tsx` renders 30 course names from a hardcoded array. The `courses`, `lessons` and `course_pricing` tables are **empty (0 rows)**. There is no `/academy/$slug` route, so nothing is tappable. Fix: seed the 30 courses (title, slug, summary, outcomes, level, duration, lessons) plus regional pricing into the database, drive the catalog page from the database, and add a proper course detail page in the style of an open-university listing: hero, price card with Enrol button, what you will learn, curriculum/lesson outline, requirements, certificate note, FAQ.

3. **The "AI exam" wording is exposed to students**
   Public pages advertise "AI-set exam" and "AI-reviewed project". Fix: everywhere public and in the student portal, this becomes plain language — "Final assessment", "Practical project", "Certificate issued after review". The AI generation/grading stays exactly as it is under the hood; only the wording changes.

4. **Services / Agency page is a flat icon list**
   No individual service pages, no scope, no "what you get", no starting price, no enquiry CTA per service. Fix: keep `/agency` as the overview and add service detail pages with deliverables, process, timeline, indicative pricing and a "Start a brief" button that pre-fills the enquiry.

5. **No testimonials or case studies anywhere, and no way to publish them**
   There are no `testimonials` or `case_studies` tables. Fix: create both tables (with grants + RLS: public reads published rows only, admin writes), add an admin panel section to create/edit/publish/unpublish/reorder them, and render them on the homepage and a `/work` page. Nothing fake is added — the sections stay hidden until you publish a real entry.

6. **Contact form does nothing**
   `src/routes/contact.tsx` is a plain form with no submit handler and no storage. Fix: create an `enquiries` table, save every submission, show a success state, and send an email notification to you plus an auto-acknowledgement to the sender through the `notify.ndh.com.ng` sending domain. Add the same wiring to the talent application and course enrolment enquiry.

7. **Email is not wired at all**
   No transactional email exists yet: no welcome email, no enrolment receipt, no certificate-issued email, no password reset branding, no admin alerts. Fix: set up the email infrastructure on `notify.ndh.com.ng`, then send: welcome, enquiry received, enquiry alert to admin, payment receipt, certificate issued, and branded auth (confirm email / reset password) templates.

8. **Blog route is missing**
   The footer/nav concept references a blog but there is no `/blog` route. Fix: add `posts` table + admin editor + `/blog` and `/blog/$slug` with SEO metadata, or drop the link entirely — recommendation: build it, it is your main SEO channel.

9. **Payments not proven**
   Paystack transaction code and webhook exist but nothing has been tested and no course has a price row. Fix: seed pricing, run a live test transaction in test mode, confirm the webhook activates the enrolment, then switch to live keys.

## What to add so it stands next to Coursera / Upwork-class sites

- Course detail page with syllabus accordion, level, duration, certificate preview, and sticky price/enrol card.
- "My learning" progress bar and continue-where-you-left-off on the student portal.
- Public certificate verification page (`/verify/$code`) — this is what makes a certificate trustworthy to an employer.
- Search + filter on the academy catalog (school, level, price).
- Trust row: payment badges, refund/policy note, response-time promise, real contact details.
- A `/work` page for case studies and a testimonials strip fed from the admin panel.
- FAQ page, and JSON-LD structured data (Course, Organization, FAQ) for search visibility.
- Cookie/consent notice and a working privacy/terms link set (routes exist, content needs a pass).
- 404 page, loading and error states on every data route.
- Sitemap.xml + robots.txt pointing at the live domain.

## Things you may need to connect

- **Paystack live keys** (currently only test-capable) — needed before real money moves.
- **Email sending domain** `notify.ndh.com.ng` — DNS records must be verified before any email sends.
- **Google sign-in provider** must be enabled on the backend in the same pass, otherwise Google login errors.
- Optional: Google Analytics / Search Console verification for the live domain.

## Order of work

1. Auth fix + verified sign-up/sign-in test (email and Google).
2. Database: courses + lessons + pricing seeded; testimonials, case studies, enquiries, posts tables with grants and RLS.
3. Academy: DB-driven catalog, course detail page, enrol flow, neutral assessment wording.
4. Services: detail pages and brief CTA.
5. Admin portal: publish testimonials, case studies, blog posts, and view enquiries.
6. Contact + email: form saves, notifications, branded auth emails.
7. Trust and SEO pass: verification page, FAQ, structured data, sitemap, 404.
8. Payment test, full click-through test of every page and both portals, then publish.

## Technical notes

Stack stays TanStack Start + Lovable Cloud. New tables get explicit GRANTs, RLS enabled, public SELECT limited to published rows, writes limited to admin via the existing `has_role` function. Generated Supabase files, `.env`, and the route tree are not hand-edited. Each phase ends with a browser test against the running preview before I report it done.
