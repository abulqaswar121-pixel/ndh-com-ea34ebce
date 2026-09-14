# Academy: paywall, precise video segments, pre-project quiz, ratings, testimonials

Five features, built on the curriculum already imported (30 courses, 195 lessons with start/end times).

## 1. Content paywall and public teasers

Today the public course page shows the full syllabus, preparation, checklist, project brief and grading rubric. That is the product given away for free.

Public visitors will see only the hook:
- Title, school, short summary and a 2-3 sentence intro (first part of the introduction only)
- Up to 4 headline outcomes ("what you'll be able to do")
- Course facts: number of lessons, total watch time, certificate, self-paced
- Only the free preview lesson title, plus locked, blurred placeholders for the rest ("Lesson 4 — unlocks on enrolment")
- Price and the enrol button, plus the rating and student testimonials

Everything else — full objective list, lesson titles beyond the preview, preparation, checklist, common mistakes, project brief, rubric, video links, practice tasks — is only returned after an active enrolment is verified on the server.

How it is enforced: the public path keeps using the read-only public reader and a restricted database view that exposes only teaser columns, so even a crafted request cannot read the paid fields. Full content moves to a signed-in server call that checks an active enrolment (or admin) before returning anything. Access rules on the lessons table stay locked to enrolled students.

## 2. Video start/stop and automatic completion

Each lesson already stores its video and exact start/end seconds.

- Load the YouTube IFrame Player API once, play from `start_seconds`, and poll playback; when the time reaches `end_seconds` the player pauses on the final frame and shows "Lesson complete".
- Guard against skipping: the lesson is marked complete only when the watched time inside the segment covers at least ~90% of its length, tracked in small increments so scrubbing to the end does not count.
- On completion, record it once on the server (enrolment verified), update the course progress percentage, and auto-advance to the next lesson after a short confirmation.
- Manual "Mark as complete" stays available as a fallback, and re-watching never double-counts.
- Works on phones (lower-resolution playback, no autoplay with sound) and respects reduced-motion.

## 3. AI pre-project quiz

Before the final project unlocks, the student sits a short readiness quiz generated from that course's real lesson content.

Workflow:
1. Student finishes all required lessons; "Start readiness quiz" unlocks.
2. Server generates 8 questions (6 multiple choice, 2 short answer) from the course objectives plus the actual lesson titles, practice tasks and knowledge checks. Questions and answers are stored server-side; the student's browser never receives the answer key.
3. Multiple choice is graded instantly in the database. Short answers are graded by AI against the lesson material, returning a score and one line of coaching per answer.
4. Pass mark 70%. Passing unlocks the authored final project brief and rubric. Failing shows which topics to revisit, links back to those exact lessons, and allows a retake after a short cooldown with a freshly generated set.
5. Attempts, scores and feedback are stored for admin review.

Reliability: strict structured output so the quiz shape is always valid, one retry on a transient AI failure, and a clear message (never a silent generic answer) if the AI service is unavailable or out of credit.

## 4. Course rating system

- A rating belongs to one student and one course, with one row maximum, so no one can pad a score.
- A rating can only be created when the student has an active enrolment and has completed the course (all required lessons, or a certificate issued). Enforced in the database, not only in the interface.
- Fields: stars 1-5, optional written review, created and edited timestamps. Editing is allowed; each edit replaces the previous value.
- The public course page shows the average, the count and a star breakdown, read from a small aggregate view so no personal data is exposed. Courses with fewer than 3 ratings show "New course" instead of a misleading average.
- Admin can hide an abusive review; hidden reviews keep counting or not according to an admin flag.

## 5. Testimonials engine

- Students who completed a course can submit a testimonial from their portal: quote, optional role, permission-to-publish checkbox. The course is attached automatically.
- Submissions arrive as pending. Admin > Content gets a review queue: approve, edit lightly for typos, feature, or reject. Approving marks it published with a "Verified student" badge; only approved ones are ever public.
- The Academy landing page shows a rotating selection of featured testimonials in the existing horizontal rail, preferring featured, then most recent approved; the course page shows testimonials for that course.
- The existing agency testimonials stay untouched — student testimonials are separated by type so the two sets never mix.

## Technical notes

- New tables: `course_ratings` (unique per student+course, completion-gated by a security-definer check), `student_testimonials` (status pending/approved/rejected, featured flag, course reference), `quiz_attempts` (questions, answer key, student answers, score, passed, feedback). All additive, with explicit permissions and access rules; answer keys and pending rows are never readable by the public role.
- New public teaser view over `courses` plus a `course_teaser(slug)` function returning only free-preview lesson titles and locked counts; the existing `course_outline` function is narrowed to teaser data.
- Paid content served by new authenticated server functions in `src/lib/academy.functions.ts` guarded by enrolment checks; `src/lib/catalog.functions.ts` keeps only teaser reads.
- Player logic extracted into a `LessonPlayer` component using the YouTube IFrame API with a watched-seconds accumulator; completion posted through an authenticated server function.
- AI calls go through the existing Lovable AI gateway helper, server-side only, with structured JSON output and status-aware error handling.
- Ratings aggregate exposed through a view with average, count and distribution only.

## Verification

- Signed-out course page exposes no syllabus, brief or rubric — checked in the browser and by calling the public read path directly.
- Enrolled student sees full content; segment starts and stops at the stored seconds; skipping to the end does not complete the lesson; completing updates progress and unlocks the quiz at 100%.
- Quiz generates, grades, blocks the project below 70% and unlocks it above.
- Rating blocked before completion, allowed once after, average and count correct on the public page.
- Testimonial stays invisible until approved, then appears on the Academy page.
- Checked on phone portrait, phone landscape, tablet and desktop.
