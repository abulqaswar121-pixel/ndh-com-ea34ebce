# Repair the authentication preview bundle

## Confirmed cause

- The Lovable Cloud backend is connected, active, and responding normally.
- The required browser and server authentication variables are currently present.
- The preview server started earlier than the latest environment injection.
- The error recorded from the phone comes from an older compiled JavaScript bundle (`index-B0CTs5NM.js`) that did not contain those browser variables.
- The current application build itself passes.

## Fix

1. Restart the supervised preview server once so it starts with the current authentication environment.
2. Wait for the new preview server to become ready and confirm the fresh bundle no longer emits the missing-variable error.
3. Open `/signup` at a mobile viewport and verify:
   - the red configuration error is gone;
   - the page finishes loading;
   - an email signup attempt returns a real authentication response rather than hanging;
   - the Google button starts the managed Google authentication flow.
4. Check the latest build, runtime, console, and network signals after the browser test.
5. If the phone retains the obsolete bundle after the server restart, force a preview reload/cache refresh and verify the newly generated asset hash is being served.

## Scope

No database migration or authentication-policy change is needed for this error. Application code will only be changed if the fresh bundle still fails after the environment-aware restart.
