# Full site audit — what is broken or missing, page by page

Everything below was checked against the live code and the database, not assumed.

## The single biggest gap

**Nobody can actually buy or start a course.** The "Enrol now" button on a course page links to the signup form and stops there. The payment function exists on the server but no page ever calls it. There are 30 courses and 60 price rows in the database, but **0 lessons, 0 enrolments, 0 payments, 0 certificates**. So the whole Academy is a brochure right now.

## Public pages

**Home (`/`)** — Static. No testimonials strip, no featured courses pulled from the database, no case studies, no trust row (payment badges, response time, real address). Nothing here proves the business is real.

**Academy list (`/academy`)** — Loads the 30 real courses correctly. Missing: search, filter by school/level/price, sorting, and any "most popular" ordering.

**Course page (`/academy/{course}`)** — Shows title, price and outcomes, but:
- Enrol goes to signup, not to checkout. No payment, no enrolment created.
- Curriculum section says lessons "are being finalised" because there are genuinely **0 lessons in the database** for all 30 courses.
- No instructor, no student count, no reviews, no FAQ, no preview lesson.

**Agency (`/agency`)** — Still just 8 icons and 4 process steps. No individual service pages, no deliverables, no timelines, no indicative pricing, no per-service "start a brief" CTA.

**Work (`/work`)** — Wired to the database correctly, but **0 case studies published**, so every visitor sees an empty state.

**Blog (`/blog`)** — Wired correctly, but **0 posts published**. Empty for every visitor.

**Contact (`/contact`)** — Form saves to the database properly. Missing: no email alert to you when an enquiry arrives, no acknowledgement email to the sender. **0 enquiries** so far. You would not know if one came in.

**Talent application (`/talent-application`)** — Submits, but nothing reviews it: no admin screen lists applications, and `talent_profiles` is empty.

**About / Privacy / Terms** — Privacy and Terms are 33 lines each — placeholder-length, not real policies. This matters if you take payments.

**Missing routes entirely** — no `/verify/{code}` certificate verification page (a certificate nobody can verify is worth little to an employer), no FAQ, no pricing page, no per-service pages, no cookie notice.

## Portals

**Student** — Lists enrolments and certificates. "Continue learning" links back to the Academy list instead of the lesson player. No progress, because there are no lessons. Exam and Project pages exist but can never unlock (unlock requires 100% lesson completion; there are no lessons).

**Client** — "Message PM" and "Files" buttons are decorative: no click handler, no messaging, no file storage. Escrow section is a hardcoded empty box. No way for a client to raise a new brief from inside the portal.

**PM** — "Client PM chat" and "Assign talent" buttons are also dead, no handlers. No way to create a project, add tasks, or set deadlines.

**Talent** — Earnings read from a table with no rows and no process that ever writes to it, so earnings are permanently zero and "Request payout" can never be used. No profile, no portfolio, no availability.

**Admin** — The strongest portal, but: PM access is granted by pasting a raw user ID (no user picker), invitations only produce a link you must copy manually (no email sent), there is no talent-application review, no project/task creation, no lesson uploader, and no enrolment or revenue overview.

## Cross-cutting

- **No transactional email at all**: no welcome, enrolment receipt, certificate issued, enquiry alert, or invitation email.
- **Payments never tested end to end**; live keys not in place.
- **Three open security findings** from the last scan: an endpoint any signed-in user can call, a self-approval path, and a table policy that lets students edit their own submissions after grading.
- **No analytics or Search Console** on the live domain.

## Suggested order to fix

1. Lessons + working enrol/checkout so a course can actually be bought and studied.
2. Email: enquiry alerts, receipts, invitations, certificate issued.
3. Client/PM portal: real messaging, files, project and task creation.
4. Content: publish first case studies, testimonials and posts through the admin panel.
5. Certificate verification page, service detail pages, FAQ, real privacy/terms.
6. Talent pipeline: application review, profiles, earnings that are actually written.
7. Security findings, payment go-live test, analytics.

Tell me which of these to start with and I will plan that piece in detail.
