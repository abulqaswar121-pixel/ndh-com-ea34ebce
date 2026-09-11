# Real case studies & testimonials — /work + /agency

## Decisions locked in

- Apex Agri-Capital live link: `apexagri-capital.lovable.app` (the `farm-fund-hub` link in the brief is dropped).
- Content lives in the database (case_studies + testimonials tables) so it appears on /work and is editable in Admin > Content; /agency gets a featured section between "How we work" and the closing CTA.
- Testimonials render role + organisation as written; real names slot in the moment you send them (one-line edit each).

## What gets built

### 1. Database content (one migration, literal inserts)

Insert into `case_studies` (all `is_published = true`):

| # | Slug | Client | Category |
|---|------|--------|----------|
| 1 | apex-agri-capital-shared-farm-ledger | Apex Agri-Capital | Web App Development / Business Systems |
| 2 | miftah-al-arabiyyah-arabic-curriculum | Miftah al-Arabiyyah | Content & Curriculum Development |
| 3 | markazussalaf-academic-operations-engine | Markazussalaf | Business Support / Document Systems |
| 4 | the-inheritance-of-shadows-story-series | Digital Story Series | Digital Media & Publishing |
| 5 | ndh-agency-academy-web-platform | NDH | Web Engineering & Platform Design |
| 6 | basic-studies-result-reporting-system | Basic Studies | Administrative & Educational Software |

Each row: description as summary, highlights folded into challenge/approach/result fields, plus `live_url` and `category` columns added if missing (the current table has no live-link or category field).

Insert into `testimonials` (all published, each with a `badge` column value like "Verified Project Delivery"):

1. Markazussalaf Institute — Academic Director — Verified Project Delivery
2. Apex Agri-Capital — Co-Founding Partner — Verified App Deployment
3. Miftah al-Arabiyyah Project — Lead Review Committee Member — Verified Curriculum Project

A light migration adds `category`, `live_url`, and `highlights` (text array or extra paragraphs) to `case_studies` and `badge` to `testimonials` if those columns don't exist. No RLS changes — existing public-read policies already cover both tables.

### 2. /work page upgrade

- Cards show the category tag, client eyebrow, summary, challenge/approach/result, and a "View live project" external link when `live_url` exists.
- Everything already flows from the database — no hardcoded content on this page.

### 3. /agency featured section

New "Selected work" band placed between the four-step process and the closing CTA panel:

- Responsive grid: 3 columns desktop, 1 column mobile, using existing tokens (bordered cards, hairline, hover lift + accent line, Reveal animation).
- Shows the 6 projects pulled from the database (featured subset, not hardcoded), each with icon, category tag, title, one-line description, and a "View case study" link to /work.
- "Client & stakeholder verification" subsection directly below: 3 testimonial cards with quote, role, organisation, and the "Verified ..." badge pill.

### 4. Admin content manager

- Case study form gains category and live-URL fields so all six entries stay editable without code changes.
- Testimonial form gains the badge field.

## Technical notes

- One migration only: `ALTER TABLE ... ADD COLUMN IF NOT EXISTS` + literal `INSERT`s (no seeding via tools or page load).
- `listCaseStudies()` and the homepage testimonial query may need the new columns added to their select lists.
- External links open in a new tab with `rel="noopener noreferrer"`.
- Purely content + presentation; no auth, payments, or schema-policy changes beyond the two additive columns.

## Still needed from you

- The three real testimonial names when ready (they'll replace the role-only display).
