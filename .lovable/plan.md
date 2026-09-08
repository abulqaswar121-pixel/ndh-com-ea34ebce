# Portal amendments: no way back to the public site, real pages, in-portal Academy, rotation fix

## What I checked and can confirm

1. **Links back to the public site exist.** The account menu in the portal has a "Back to main site" link to the homepage, and the footer of every portal page links to Terms and Privacy on the public site. Nothing currently stops a signed-in person from typing the homepage address either.
2. **Portal navigation is scroll-to-section, not pages.** Every sidebar item for student, client, project manager, talent and admin points at the same single page with a section anchor, so tapping a menu item just scrolls. Confirmed in the portal menu setup and in the portal pages themselves.
3. **The student portal has no course catalogue.** It only lists courses already enrolled in, plus a "Browse Academy" link that leaves the portal for the public catalogue.
4. **Opening a course detail page is genuinely broken.** I requested a live course page and the server returned an error, showing "Course unavailable". The cause is confirmed in the server log: the course outline lookup is refused permission to read the lessons table for visitors who are not signed in. The catalogue list page itself works — only the detail page fails.
5. **Rotation.** The layout rules only react to screen width, and several tall sections assume a portrait window, so turning the phone sideways gives a cramped, misaligned page. Nothing in the site adapts to a short, wide window.

## What I will build

### 1. Sealed portals
- Remove "Back to main site" from the account menu.
- Portal footer keeps support email, Terms and Privacy, but those open the in-portal copies rather than the marketing site.
- Signed-in users who land on a public marketing page (home, agency, academy, work, blog, about, contact) are sent straight to their own portal home. Signing out is the only way back to the public site.

### 2. One page per menu item
Each sidebar entry becomes its own page with its own address and title:

```text
Student   /portal/student, /courses, /catalogue, /catalogue/<course>, /certificates, /account
Client    /portal/client, /projects, /new-brief, /invoices, /escrow, /account
PM        /portal/pm, /projects, /briefs, /new-project, /tasks, /account
Talent    /portal/talent, /tasks, /earnings, /profile, /account
Admin     /portal/admin, /reviews, /access, /users, /applications, /courses, /content, /enquiries, /payouts
```

The portal home of each role becomes a short dashboard summary; the existing section content moves into its own page unchanged. Every page listed gets created in the same pass so no menu item is a dead link. An "Account" page is added for each role (name, email, password change, sign out).

### 3. Academy inside the student portal
- A catalogue page inside the portal listing every published course with search and school filter, matching the public catalogue.
- A course detail page inside the portal with outline, objectives, price and enrol/continue action.

### 4. The broken course page
Fix the outline lookup so it can read lessons on behalf of visitors, with a controlled, read-only path limited to published courses. This repairs the public course page and makes the in-portal one work too.

### 5. Rotation and sizing
- Use dynamic viewport height everywhere so browser bars don't clip content.
- Add short-window rules: when the window is wide but not tall (a phone on its side), the top bar becomes compact, page padding tightens, hero and header blocks stop reserving portrait-sized height, and the portal menu stays a slide-out drawer instead of jumping to the desktop sidebar.
- Make grids and header rows shrink safely so nothing overflows sideways at 640-900px widths.
- Check the result at portrait and landscape phone sizes before finishing.

## Technical notes

- Portal routes move to a `_authenticated/portal/<role>/` folder with a layout route holding `PortalShell` and an `Outlet`; children are leaf pages. Menu items become real route links with active highlighting.
- Public marketing routes get a redirect guard driven by the existing auth/role hook.
- Course outline fix: a database migration making the outline function run with definer rights, fixed search path, restricted to published courses, plus the matching execute grant.
- Responsive work is CSS only, in `src/styles.css`, using `100dvh` and `(max-height: 520px) and (orientation: landscape)` blocks alongside the existing width breakpoints.
- No change to payments, enrolment, messaging or task logic.
