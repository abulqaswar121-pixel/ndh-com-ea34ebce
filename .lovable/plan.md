# Fix sign-up and sign-in

## What's actually wrong (verified against the live database)

1. **No table permissions exist anywhere in the app database.** A query of the permission catalogue returned zero rows for every public table — the app's users (signed-in, signed-out, and server) have no read or write rights on any table, including `profiles` and `user_roles`. Security rules alone are not enough; without these grants every request is rejected. This is why sign-in appears to hang or bounce: Google login itself succeeds (the auth log shows a 200), but the app then cannot read the account's role, so it never lands on a portal.

2. **Older accounts have no role and no profile row.** Of the 18 accounts, only 2 have a role. The automatic "new account" trigger is installed and working (accounts created after 23 Aug got a role and a profile), but every account created before it was installed was left without one. Those users can authenticate and still go nowhere.

3. **Email sign-in fails for Google-created accounts.** Several accounts — including abulqaswar121@gmail.com — exist with a Google identity only, no password. Signing in with email/password on those returns "Invalid login credentials", and signing up again returns "User already registered". Both messages are correct but unhelpful, so it reads as broken.

## The fix

### 1. Restore database permissions (migration)
Grant the correct privileges on every existing public table, matched to each table's existing security policies:
- signed-in users: read/write on the tables their policies allow
- signed-out visitors: read only on genuinely public tables (services, blog posts, published courses/schools, case studies)
- server/admin role: full access for server functions

### 2. Backfill missing accounts (same migration)
For every existing auth account with no profile or no role, insert a profile row and a default `client` role — the same thing the trigger does for new signups. No role other than client is granted; admin/pm/talent stay admin-assigned only.

### 3. Make the login page honest about Google-only accounts
On the login form, when email/password fails with invalid credentials, show a clearer message pointing to "Continue with Google", and on signup, when the account already exists, say so and offer the sign-in link instead of the raw error. No change to auth logic itself.

### 4. Unblock the loading state
If a signed-in user still ends up without a role, stop the portal gate from spinning forever: after the role lookup completes with nothing, show a short "your account isn't set up yet — contact support" screen with a sign-out button, instead of an endless spinner.

## Verification
- Re-query permissions to confirm every table is granted.
- Re-query accounts to confirm all have a profile and a role.
- Sign in through a real browser with a test account and confirm it reaches the client portal.

## Technical notes
- One SQL migration: `GRANT` statements per table + backfill `INSERT ... ON CONFLICT DO NOTHING` into `profiles` and `user_roles`.
- Frontend edits limited to `src/routes/login.tsx`, `src/routes/signup.tsx`, and `src/components/RequireRole.tsx`.
- No changes to generated integration files, the signup trigger's role logic, or the role security model.
