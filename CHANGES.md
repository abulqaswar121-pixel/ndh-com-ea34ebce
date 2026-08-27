# NDH Changes

- `src/lib/academy.functions.ts` — server-side Academy Exam and project generation/review actions.
- `src/lib/admin.functions.ts` — Admin-only review, certificate, PM access, and invitation actions.
- `src/lib/payment.functions.ts` — server-side Paystack transaction initialization hook.
- `src/routes/_authenticated/portal/admin.tsx` — Admin queue, invitations, PM access, payout queue, user search, and Course Editor.
- `src/routes/_authenticated/portal/student.tsx` — enrolled courses, progress, and certificate list.
- `src/routes/_authenticated/certificate.$id.tsx` — student-owned certificate view and print/download action.
- `src/routes/_authenticated/exam.$slug.tsx` — Exam timer, question form, submission, and score display.
- `src/routes/_authenticated/learning.$slug.tsx` — ordered lessons and student progress writes.
- `src/routes/_authenticated/project.$slug.tsx` — AI brief generation and project submission.
- `src/styles.css` — visual/responsive styling retained from staged work.
- `supabase/migrations/20260826100000_stage5_academy_flow.sql` — student progress, Exam attempt, and project tables with RLS.

Generated Supabase clients/types, route tree, auth infrastructure, `.env`, Supabase config, and SupportChat were not edited.
- `supabase/migrations/20260827090000_payments_and_certificates.sql` — Paystack transaction record and verified-payment enrollment activation function.
- `src/routes/api/public/paystack-webhook.ts` — verified Paystack webhook endpoint using Web Crypto signature validation and server-side enrollment activation.
- `src/routeTree.gen.ts` — regenerated automatically by TanStack Start to register newly added routes; not manually edited.
