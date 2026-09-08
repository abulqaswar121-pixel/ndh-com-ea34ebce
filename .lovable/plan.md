# Where we stopped — and what's left to make the site fully working

## Already done (last few sessions)

1. **Sign up / sign in fixed** — the broken auth bundle is repaired; login works.
2. **Academy is real now** — 30 courses in the database, each with 8 lessons (240 total, first lesson is a free preview).
3. **Buying a course works end to end** — course page starts a real Paystack checkout (NG / international price toggle), the return page verifies the payment, grants the student role and activates the enrolment.
4. **Learning area works** — enrolled students get a lesson player with video, notes, "mark as complete" progress, and the exam/project tabs unlock at 100% completion. The student portal shows progress and certificates.
5. **Transactional email wired** — enquiry acknowledgement + alert to you, payment receipt, certificate-issued email, and invitation emails all queue through the branded template on `notify.ndh.com.ng`.
6. **Client & PM portals are functional** — every project has a workspace with messaging, file sharing (50 MB, private), and tasks. Clients can raise a brief; PMs can create projects, claim unassigned briefs, and manage tasks.

## What still needs to be done (in the order you set)

**4. Content — publish your first real material**
- 0 case studies published → `/work` shows an empty state to every visitor.
- 0 blog posts published → `/blog` is empty.
- 0 testimonials → homepage has no social proof.
- The admin panel already has the publishing tools; what is needed is the actual content (real client results, quotes, articles).

**5. Missing public pages**
- Certificate verification page (`/verify/{code}`) so employers can confirm a certificate is real.
- Per-service detail pages under the Agency section (deliverables, process, indicative pricing, "start a brief" button).
- FAQ page; fuller Privacy / Terms (currently placeholder-length).

**6. Talent pipeline**
- No admin screen reviews talent applications yet, so applications pile up unanswered.
- Talent profiles, availability, and an earnings process that actually writes rows so "Request payout" can work.

**7. Security & go-live hygiene**
- 3 open security findings from the last scan (an endpoint any signed-in user can call, a self-approval path, students able to edit submissions after grading).
- 11 linter warnings on database functions (search_path / security definer) — pre-existing, should be hardened.
- Paystack live test: run one real test transaction, confirm the webhook activates the enrolment, then switch to live keys.
- Analytics / Search Console on ndh.com.ng.

## Settings you need to provide/confirm (outside my control)

- **Verify the email sending domain** `notify.ndh.com.ng` DNS — until then no email actually sends.
- **Set `ADMIN_NOTIFICATION_EMAIL`** if enquiry alerts should go somewhere other than hello@ndh.com.ng.
- **Paystack live keys** when you're ready to take real money (test keys are in place).
- **Real content** for case studies, testimonials and blog posts — I can structure them, but the stories must be yours.

## Suggested next step

Pick the next item: (a) certificate verification + FAQ + service pages, (b) talent application review, (c) security findings + payment live test, or (d) help drafting/publishing your first case studies and posts.
