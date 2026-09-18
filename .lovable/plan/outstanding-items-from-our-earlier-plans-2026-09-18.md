# Outstanding items from our earlier plans

Everything below is planned but not yet finished. Done items (portals, academy paywall, video segments, quiz, ratings, testimonials engine, case studies, blog, per-course images, mobile layouts) are excluded.

## 1. Fix email delivery (highest impact)
Sending-domain setup failed and 5 of 7 logged emails never sent; the admin notification address is unset, so alerts fall back to hello@ndh.com.ng.
- Re-run the email sending-domain setup and verify it.
- Set the real admin notification email.
- Re-test enquiry, payment-receipt, certificate and invitation emails end to end.

## 2. Live Paystack verification + one full student journey
One payment is stuck "pending"; live/test mode is unconfirmed, and every student-side academy flow (player completion, quiz, rating) is untested because no real enrolment exists.
- Confirm Paystack live keys and mode.
- Run one small real purchase, confirm receipt email, then complete a lesson, the readiness quiz and a rating as that student.

## 3. Clear open security findings
- Run the security scan and fix anything it flags (RLS, grants, exposed keys).

## 4. Talent & PM workflow completion
The pay model is agreed (fixed fee per task for talents; fixed fee or 10–15% for PMs; Friday payout batch) but not fully wired.
- Notifications when a new brief matches a PM's service area and when a PM assigns a task to a talent.
- Escrow release on client acceptance; earnings credited to PM and talent.
- Admin payout list (Friday batch) with balances that can never be overdrawn.

## 5. Real testimonial details
The three published testimonials still need your real client names (and genuine portraits if available; otherwise initials stay).

## 6. Analytics
- Turn on project analytics so you can see visits, top pages and sign-ups.

## Technical details
- Email: Lovable Cloud sending-domain tool; secrets via the secrets tool (never in code).
- Paystack: existing payment functions; test with a low-amount live charge, then reconcile the stuck pending payment row.
- Security: security--run_security_scan, then targeted RLS/grant fixes via migration.
- Payouts: new tables for task fees, earnings ledger and payout batches, plus admin review UI.

Tell me which of these to start with — or approve this and I'll work through them in the order above.
