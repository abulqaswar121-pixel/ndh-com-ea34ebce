# Repair live authentication and public content

## Confirmed problems

- The phone-facing preview is throwing `Missing Supabase environment variable(s): SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY`, so its browser bundle cannot initialize authentication.
- The fresh local app has the required environment values and loads correctly, confirming this is a preview/deployment configuration problem rather than a phone cache problem.
- The database is active and contains 19 accounts, 19 profiles, 20 role rows, and 30 published courses.
- The checked public tables have RLS policies but **no Data API grants at all** for visitors, signed-in users, or trusted server access. This blocks course, blog, case-study, profile, and role reads even when authentication itself succeeds.
- Login and signup pages have no clear close/back control.

## Fix

### 1. Restore backend access correctly
- Apply one migration granting only the privileges already permitted by each table's RLS policies.
- Restore anonymous read access only for published public content, authenticated access for user-owned data, and trusted server access where required.
- Keep roles protected: signup can create only `client` or `student`; no user can grant themselves `talent`, `pm`, or `admin`.
- Re-query grants and verify profile/role rows remain complete after the migration.

### 2. Repair the live auth configuration
- Refresh the Lovable Cloud auth/environment integration and restart the preview runtime so the browser bundle receives its public auth URL and publishable key.
- Verify the actual phone-facing preview asset, not only localhost.
- Keep private credentials server-side; only the public browser configuration may enter the frontend bundle.

### 3. Make authentication reliable and navigable
- Add a visible close/back-to-home icon to both `/login` and `/signup`, with an accessible label and mobile-safe placement.
- Separate Google and email loading states so one action cannot leave the entire form spinning.
- Preserve the correct email-confirmation state after signup instead of implying the user is immediately signed in.
- Keep helpful messages for Google-only accounts and ensure every failure exits loading state.

### 4. End-to-end verification
- Create a fresh client test account through the real signup form and confirm the profile plus default `client` role are created automatically.
- Sign out, sign back in with that account, and confirm it reaches `/portal/client` without hanging.
- Start the Google flow and confirm the managed provider opens successfully; complete a real Google login with an available test session where possible.
- Verify `/academy`, an individual course page, `/blog`, and `/work` on the hosted preview. Empty blog/work collections must show intentional empty states, not “unavailable”.
- Check mobile screenshots, runtime errors, network responses, and the latest build signal before reporting completion.

## Scope

No redesign or unrelated feature work. This pass fixes the live configuration, permissions, authentication flow, public-data failures, and the requested close/back controls.
