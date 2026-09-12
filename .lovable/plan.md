# How NDH works today, and what is not okay

## A. The agency side — step by step

1. A visitor reads the Agency page and a service page, then sends a brief through Contact.
2. The enquiry is saved and two emails go out: a thank-you to the sender and an alert to you.
3. If they sign up as a client, they can post a brief from their portal.
4. A project manager sees unclaimed briefs and claims one. Nobody is notified when a brief arrives — the manager has to be looking.
5. Inside the project, client and manager exchange messages, share files and track tasks. This part works.
6. Invoice, escrow, payment, payout — this is where it stops. See problems 1 to 3.

## B. The academy side — step by step

1. 30 published courses with 240 lessons and prices in two currencies (Nigeria and international).
2. A student signs up, picks a course, and pays through Paystack. The price is read on the server, so it cannot be tampered with. Free courses enrol instantly.
3. Payment is confirmed two ways: the provider calls us back, and we double-check on return. Enrolment activates and a receipt email is sent.
4. The student works through lessons, progress is recorded, then takes an assessment and submits a practical project.
5. You review the project in Admin. On approval a certificate is created and emailed.
6. Anyone can verify a certificate on the public verification page.

This chain is complete in code but has never run end to end with a real learner: 0 enrolments, 1 payment stuck at "pending", 0 certificates.

## C. Money

- Course payments: built and live-capable. One test attempt exists that never completed, so a real card payment has still not been proven.
- Agency payments: not built at all. No way to raise an invoice, no way to take client money for a project, escrow can never fill.
- Talent pay: a talent can request a payout, but their balance is never calculated by anything, so it is always zero and the request cannot be checked.

## D. Email

Every email is written and wired (enquiry thank-you, your alert, invitation, talent accepted/rejected, payment receipt, certificate issued, sign-up and password emails).

They are not being delivered. The sending domain setup failed, and the log shows 7 attempts: 5 failed, 1 stuck, 1 dead. Nothing you send reaches anyone right now.

## E. Public content

- Courses 30, case studies 6, testimonials 3 — all live.
- Blog: 0 posts. The editor works, there is just nothing published.
- Enquiries 0, talent profiles 0 — no real traffic has come through yet.

---

# What is not okay — in priority order

1. **Email delivery is dead.** Sending domain failed to provision. Fix the domain, resend the DNS records, re-verify, set your real alert address, then send a test of every message type.
2. **Agency money has no path.** Add invoice creation for admin/PM, client payment of an invoice through Paystack, and automatic escrow movement (held on payment, released on project completion).
3. **Talent balances are never calculated.** When a project invoice is paid and released, credit the assigned talent; block payout requests above the available balance.
4. **Course payment never proven with a real card.** Run one live transaction end to end: pay, confirm enrolment activates, receipt arrives, lessons unlock.
5. **Nobody is told when a brief arrives.** Email you and the project managers on new brief, and email the client when a manager is assigned.
6. **No student has ever completed the funnel.** Walk one test learner from enrol to certificate to public verification, to prove it before real students arrive.
7. **Blog is empty** — your main search channel is unused.
8. **Old conflicting database definitions** for invoices remain in history and should be tidied so future work does not follow the wrong one.

# Suggested order of work

1. Email domain repair and full send test.
2. Agency invoicing + client payment + escrow + talent earnings.
3. New-brief and assignment notifications.
4. Live payment test and full student walk-through.
5. Blog posts and remaining content.

# Technical notes

Invoices and escrow are currently read-only tables with no insert policy and no writer anywhere in the app; the agency money work needs new policies, server functions and admin/client screens. `talent_earnings` needs a write path tied to escrow release. `ADMIN_NOTIFICATION_EMAIL` is not set and falls back to `hello@ndh.com.ng`. Paystack keys are present; live/test mode still needs confirming.
