# What's Remaining — Final Stretch to a Complete Site

Confirmed by checking the live monitoring findings, security scan, and the actual route files today.

## Confirmed problems to fix first

1. **Student projects never reach the admin review queue (high severity)**
   Students submit practical projects into one table, but the admin "Project Review Queue" reads a different, always-empty table. Result: projects can't be approved and certificates are never issued. Fix: point the admin queue at the real student submissions table (or unify the two), then test submit → review → certificate end to end.

2. **Portal menu disappears on short, wide screens (medium)**
   On a phone/tablet rotated landscape with a short height, the sidebar hides but no menu button appears, so portal users get stuck on one page. Fix: show the menu button whenever the sidebar is hidden.

3. **Security scan items to verify and clear**
   Some flagged items reference files that may no longer exist (e.g. instructor/HOD grading code) — verify each against the current code, fix the real ones (notably the email-send endpoint accepting any signed-in user), and mark the rest accordingly.

## Remaining roadmap items

4. **Certificate verification page** — public `/verify/$code` page so employers can confirm a certificate is genuine. This is what makes your certificates worth something.
5. **FAQ page** — answers for pricing, enrolment, refunds, timelines; linked in footer and support chat.
6. **Service detail pages** — each agency service gets its own page: what you get, process, timeline, starting price, "Start a brief" button.
7. **Privacy/Terms content pass** — replace placeholder-lean text with full, proper policies.
8. **Real content publishing** — case studies, testimonials, blog posts via the admin panel (needs your real material; I can draft for your review).
9. **Live Paystack test** — switch from test keys to live keys and run one real transaction to prove enrolment activates.
10. **Analytics + Search Console** — measurement and indexing for ndh.com.ng.

## Suggested additions (raise it to Coursera/Upwork class)

- **"My learning" continue-where-you-left-off** on the student dashboard (resume button jumping to the last open lesson).
- **Trust row on the homepage** — payment badges, refund promise, response-time promise.
- **Testimonials strip on the homepage** fed from the admin panel (hidden until you publish real ones).
- **JSON-LD structured data** (Course, Organization, FAQ) for Google rich results.
- **Course ratings/reviews** from enrolled students after completion — strong conversion signal for the Academy.
- **Talent availability toggle** so project managers only assign work to available talent.

## What you need to provide (outside my control)

- Verify DNS for `notify.ndh.com.ng` so emails actually send.
- The admin notification email address for enquiry alerts.
- Live Paystack keys when ready for real money.
- Real testimonials, case studies and blog drafts (or ask me to draft them).

## Proposed order of work

1. Fix the certificate-issuing pipeline (admin review queue) — students are blocked today.
2. Fix the landscape menu bug.
3. Verify and clear security findings.
4. Certificate verification page + FAQ + service detail pages + legal pass.
5. Analytics/Search Console, then content publishing and live payment test last (needs your input).

## Technical notes

- Admin review queue fix: update `src/routes/_authenticated/portal/admin.reviews.tsx` and `reviewSubmission` in `src/lib/admin.functions.ts` to read/approve `student_projects` (what students actually write to), keeping the certificate insert. No data migration needed if we read from the live table.
- Landscape fix: one CSS/media-query change so `.portal-menu-button` appears whenever `.portal-sidebar` is hidden.
- Verification page: public route querying `certificates` by code via a narrow public-read function (no RLS exposure of other fields).
- Each phase ends with a browser test against the running preview.
