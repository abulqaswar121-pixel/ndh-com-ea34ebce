# Portals: give them their own shell — confirmed problems and recommended design

## First, where we stopped

Done in recent sessions: sign-in fixed; 30 courses with 240 lessons; Paystack checkout → enrolment → lesson player with progress; transactional email (enquiry, receipt, certificate, invitations); client/PM project workspaces with messaging, files and tasks.

Still open: publish real case studies / testimonials / blog posts; certificate verification page, FAQ, service detail pages, real Privacy & Terms; talent application review and earnings; 3 security findings; live payment test; analytics. Outside my control: verify the email sending domain DNS, add live Paystack keys, supply real content.

## What I confirmed about the portals just now

Every portal file (`client`, `student`, `talent`, `pm`, `admin`, plus the learning, exam, project, certificate and workspace pages) wraps its content in `PageShell` — the **public marketing shell**. So a signed-in user sees:

- The marketing top nav: Agency, Academy, Work, Blog, About, Contact.
- A **"Get started"** button that sends an already-signed-in user to the signup form.
- The full marketing footer: social links, "Work with us", Terms, Privacy, and a **"Sign in"** link — shown to someone already signed in.
- **No sign-out anywhere.** The only sign-out button in the whole app is on the error screen shown when an account has no role. A normal signed-in user genuinely cannot log out.
- No indication of who is signed in, and no way to switch between portals for someone who holds two roles (a client who also studies).

So your read is correct on all counts.

## Recommendation: one dedicated portal shell, five different sidebars

Build a `PortalShell` used by every signed-in page — completely separate from the public site.

**Shared frame (all portals)**
- Slim top bar: logo (links to that role's portal home, not the marketing homepage), the portal name, and on the right an account menu with the user's name/email, "Account settings", "Back to main site", and **Sign out**.
- Left sidebar on desktop, slide-out drawer on mobile, with the links for that role only.
- No marketing nav, no "Get started", no marketing footer. A minimal footer: support email, Terms, Privacy.
- Role switcher in the account menu, shown only when the user holds more than one role.
- Sign-out done properly: cancel in-flight requests, clear cached data, sign out, then go to the sign-in page with history replaced so Back can't reopen the portal.

**Student portal** — sidebar: Dashboard, My courses, Certificates, Browse Academy, Account.
Dashboard: continue-where-you-left-off card, progress across courses, next lesson, certificates earned. Lesson player keeps its own focused layout (lesson list rail, no sidebar clutter).

**Client portal** — sidebar: Dashboard, Projects, New brief, Invoices, Escrow, Messages, Account.
Dashboard: active projects with status and next milestone, unpaid invoice total, unread messages count.

**Project manager portal** — sidebar: Dashboard, My projects, Open briefs, Tasks, Clients, Account.
Dashboard: projects by status, tasks due this week, unclaimed briefs badge.

**Talent portal** — sidebar: Dashboard, My tasks, Earnings, Payouts, My profile, Account.
Dashboard: assigned tasks by deadline, available balance, payout status. Profile page for headline, skills, rate and availability (missing today).

**Admin portal** — sidebar: Dashboard, Review queue, Users & roles, Invitations, Courses & lessons, Content (testimonials, case studies, posts), Enquiries, Talent applications, Payouts, Account.
Dashboard: counts that matter — new enquiries, pending reviews, enrolments, revenue this month.

## Build order

1. `PortalShell` + account menu + working sign-out + mobile drawer.
2. Swap all signed-in pages off `PageShell` onto `PortalShell`, each with its own sidebar set.
3. Add the per-role dashboard summary at the top of each portal.
4. Add the missing pages the sidebars point at (talent profile, admin users & roles page, admin talent applications), or leave them out of the sidebar until built — I would build them, they are small.

## Technical notes

New `src/components/PortalShell.tsx` (frame + account menu) and a small role→sidebar config. `RequireRole` stays as the gate. Sign-out follows the correct order: cancel queries, clear cache, `signOut()`, navigate to `/login` with replace. Portal styles added as their own block in `src/styles.css`, reusing existing tokens. No change to any public page, and no business logic changes beyond wiring sign-out.

## Also queued in the roadmap

Once approved I'll add this portal work to `roadmap.md` alongside the remaining launch items above.
