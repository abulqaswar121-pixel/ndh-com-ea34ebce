# Fix live authentication + clean up stale users

## Diagnosis (verified directly against the backend)

- The backend currently holds **19 user accounts**, all email-confirmed, created June–August 2026. They are **not** the cause of the sign-up/sign-in failure — each account is an independent row and cannot block another user's authentication.
- One row is a leftover test artifact: `invalid-preview-check@example.invalid` (created 2026-08-29). Safe to delete.
- The real, confirmed root cause of "temporarily unavailable" on ndh.com.ng: the **deployed frontend bundle was built without the browser auth configuration** (`VITE_SUPABASE_URL` / `VITE_SUPABASE_PUBLISHABLE_KEY`). Login/signup run entirely in the browser, so the auth client throws immediately and the UI shows the fallback message. Refreshing can never fix this.
- The code fix is already in place (build-time bridge that injects the managed public URL/key and **fails the build** if they are absent, so a broken bundle can never be deployed again). It is waiting on a publish.

## Plan

1. **Clean up the stale test user**
   - Delete `invalid-preview-check@example.invalid` from auth (and any linked profile/roles rows) using the privileged server path.
   - Keep all real users untouched. Keep `abunnajeeh7@gmail.com` as admin.

2. **Verify the build carries the browser auth config**
   - Confirm the new production bundle contains `uwhiftozhvrvtulwtrve.supabase.co` and the publishable key, and no longer contains the empty `{}.SUPABASE_URL` pattern.

3. **Publish**
   - Publish the current build so the fixed bundle replaces the broken one on ndh.com.ng.

4. **Verify on the live site with fresh browser sessions (no prior storage)**
   - `/signup`: create a disposable account → no "temporarily unavailable", confirmation email flow shown.
   - `/login`: sign in with an existing account → routes to the correct portal; sign out and back in.
   - Browser console: no "Missing Supabase environment variable(s)" errors, no failed auth requests.
   - Start Google sign-in and confirm the flow opens and returns correctly.
   - Delete the disposable test account afterwards.

## Technical details

- User deletion goes through `supabaseAdmin` (Auth Admin API) inside a server function — never exposed to the browser; cascades remove linked `profiles` / `user_roles` rows.
- The build-time bridge reads only the managed **publishable** values; the service-role secret is never touched or shipped.
- Acceptance is judged only on ndh.com.ng from fresh browser contexts with recorded evidence — not from localhost or a warm refresh.
