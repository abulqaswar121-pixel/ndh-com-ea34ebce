# Launch Readiness + AI Customer Service Chat

## Where the site stands today

Public pages (Home, Agency, Academy, About, Contact, Terms, Privacy, Login, Signup, Talent application, Invite) are built, styled and have their own SEO metadata. Auth, the five roles, the role-escalation-proof signup trigger, and the database tables all exist.

The gap is behind the login wall: the five portal pages (client, student, talent, PM, admin) are still empty shells — 2 to 18 lines each. Nothing else blocks publishing the marketing site.

## Part 1 — Floating AI customer service chat (build first)

A round chat button pinned bottom-right on every public page.

- Opens a compact panel: greeting, message list, input, "typing" indicator, minimise/close.
- Answers stream in token-by-token so replies feel instant.
- The assistant is grounded in a written brief about NDH: what the agency does, how the Academy works, pricing/regions, how to hire, how to apply as talent, refund/commitment terms. It answers only from that brief and says "let me connect you to the team" plus a link to Contact when it doesn't know.
- Quick-reply chips for the top questions (Hire a team / Join the Academy / Apply as talent / Pricing).
- Conversation kept in the browser for the session; no login required.
- Rate-limited per visitor so the endpoint can't be abused.

Optional (say if you want it): store transcripts in the database so you can read what visitors asked, with a Conversations view in the Admin portal.

## Part 2 — What's left before a confident public launch

Ordered by impact:

1. **Portal contents.** Client (projects, invoices, escrow status), Student (enrolled courses, lessons, submissions), Talent (assigned tasks, earnings, payout requests), PM (project/task board, submission review when granted), Admin (user list, role changes, course + pricing management, payout approvals, audit log). This is the biggest remaining chunk.
2. **Contact form actually sends.** Right now it needs a working submission path — store the message and email you a notification via the notify.ndh.com.ng sender.
3. **Email templates.** Signup confirmation, password reset, invite email — branded, from your domain.
4. **404 and error pages** styled to match the site.
5. **Legal/trust pages** linked from the footer: refunds/commitment terms page (referenced earlier but not built).
6. **Social preview images.** Each key page needs an absolute og:image so links look right when shared.
7. **Analytics + sitemap/robots** so the site can be indexed and measured.
8. **Final pass:** mobile check on every page, security scan, and a published-build smoke test of signup → role redirect → portal.

## Suggestions to raise the bar

- A real portfolio/case-study section once you have client work to show — it is the single biggest trust signal for a global audience.
- A short "How it works" strip on the homepage (Brief → Match → Deliver → Handover) to reduce hesitation before contact.
- Pricing transparency for the Academy per region, visible without signup.
- Response-time promise on Contact ("we reply within one business day") — cheap, and it converts.

## Technical notes

- Chat UI: a client-only component mounted in `src/routes/__root.tsx`, so it appears on every page without touching each route.
- Backend: a streaming server function using the Lovable AI Gateway (Gemini), with the NDH brief as a system prompt. No API key needed from you.
- Abuse control: per-IP rate limit inside the handler; message length capped.
- Styling reuses existing tokens in `src/styles.css` — no new colours.

## Scope of this step

Build Part 1 (the floating AI chat) now. Part 2 items are listed for you to pick from next; nothing there is started in this step.
