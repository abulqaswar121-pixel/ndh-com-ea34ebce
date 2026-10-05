# NDH official profile alignment

Reference supplied by the business owner on 5 October 2026. This supersedes the
earlier gateway assumptions about Venture, eStore, SchoolDesk and Academy size.

## Authoritative data

- `src/lib/business-profiles.ts`: names, official categories and card taglines,
  operating descriptions, features, six Academy schools and confirmed counts.
- `src/lib/ecosystem.ts`: identities/icons, launch states, category membership,
  safe destinations and the derived family snapshot.
- English directory copy and the model consultant brief read the profile data
  directly. French and Arabic translations mirror it, with parity checks.

## Confirmed scope

| Business | Scope | Status |
| --- | --- | --- |
| NDH Academy | 60 practical AI-skills courses; 6 specialized schools; video lessons, readiness quizzes, capstones and signed cryptographically verifiable certificates | Active |
| NDH AgriCapital | Formerly Venture; cooperative livestock/crop investment, shared contribution ledger, live equity, operator feeding/growth/expense logs, proportional profit distribution after harvest/sale and admin cycle close | Active |
| NDH eStore | Multi-vendor digital/physical commerce, merchant onboarding, `/store/:vendorSlug`, inventory, local/international shipping, Paystack/Flutterwave checkout and automated vendor payout ledgers | Active |
| NDH Agency | 10 core departments; dedicated PM teams, strict confidential client–talent isolation, quality control, milestone verification and talent escrow payouts | Active |
| NDH SchoolDesk | School management, grading and automated report cards | Coming Soon |
| NDH Travel | Concierge, flight booking and visa advisory | Coming Soon |
| NDH iHospital | Telemedicine and digital clinic management | Coming Soon |

AgriCapital uses the Sprout icon. Contributions are via Paystack or direct
transfer. The platform description does not promise positive investment returns.

Academy schools: AI Engineering; Design & Brand; Media & Video; Writing &
Content; Marketing & Growth; Business & Operations. Topics are stored explicitly
in `ACADEMY_SCHOOLS` and rendered on About and the gateway Academy catalogue.

Only five Agency department examples were named in the reference: Brand
Strategy, UI/UX, Full-Stack Web/App Engineering, Custom AI Systems and Growth
Marketing. The code does not invent the other five department names.

## Destination decisions and outstanding owner inputs

- Agency, Academy and eStore use the supplied official `*.ndh.com.ng` domains,
  rather than preferring a Lovable preview URL.
- No new AgriCapital domain was supplied. Its previously configured
  `https://ndhventure.lovable.app` destination is retained until the owner
  confirms the renamed production address. No DNS/deployment change is implied.
- Pipeline cards/menu entries have no launch links. Consultant pipeline cards
  lead only to `/contact`, clearly labelled as enquiries about an upcoming
  business — never booking, onboarding, migration or medical consultation.
- Certificate verification is again visible, per the updated official brief,
  and uses the existing `/verify` route. Verification infrastructure itself is
  unchanged.
- The cached Academy selection still has 30 real entries. It is explicitly
  labelled as partial; the verified 60-course business scope does not create
  imaginary course rows or lesson counts. Full catalogue content must come
  from the Academy owner/service.

## Metrics policy

The homepage now displays 7 businesses, 4 active, 3 Coming Soon, 60 courses,
6 specialized schools and 10 Agency departments. Earlier unverified task,
specialist, learner, country, satisfaction and uptime numbers were removed from
the parent snapshot. It is labelled as official scope, not live telemetry.

## Validation

- `npx tsx scripts/check-official-profiles.ts`: profile/schema checks, exact
  locale key parity, official domains, 28 English/French/Arabic intent cases,
  certificate routing, pipeline restrictions, mixed needs and follow-up context.
- `node scripts/check-family-pages.mjs`: public SSR/links smoke checks against
  a running development server.
- Browser tests at 375px and 1440px for EN/FR/AR: 4 linked active cards, 3 inert
  Coming Soon cards, correct metrics, working menu and no horizontal overflow.
- TypeScript, targeted lint and production build pass.

No database schema, farm payouts, payment processing, certificate signing or
client–talent access-control implementation was changed by this content/routing
alignment. It describes the supplied official businesses, not an infrastructure
audit or a deployment of those subsidiary systems.
