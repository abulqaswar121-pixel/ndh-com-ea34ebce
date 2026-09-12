# Integrate the final NDH Academy curriculum

## Goal

Turn the uploaded **NDH Master Course Packs & Curriculum** into the Academy’s real learning experience. The existing 30 course records and prices remain, while the current 240 generic lessons are replaced by the document’s 196 verified, non-overlapping video lessons.

## What will be built

### 1. Import the complete curriculum accurately
- Extract all 30 course packs from the 113-page document, not only the first 50 pages shown in the preview.
- Match each pack to its existing Academy course by title/slug.
- Preserve existing course IDs, prices, publication state, enrolments, and certificates.
- Store each course’s exact overview, learning objectives, preparation steps, terminology, tools/resources, final project brief, required deliverables, checklist, common mistakes, and weighted grading rubric.
- Replace generic lesson rows with the 196 verified lesson segments from the document, including title, description, follow-along task, source video, start time, end time, position, and required/free-preview status.
- Make the import repeatable without creating duplicate courses or lessons.

### 2. Improve public course details
- Show the real course-specific overview and objectives instead of generic copy.
- Add useful course facts such as lesson count and curriculum structure.
- Present the exact project outcome and requirements clearly before enrolment.
- Keep the current catalogue, pricing, checkout, and signed-in redirect behavior unchanged.

### 3. Build a proper learner experience
- Replace the basic video iframe with a course player that opens each YouTube lesson at its verified start point and stops at its verified end point.
- Organize the learning page into a compact lesson navigator and focused lesson area.
- For each lesson, show its purpose, during-video guidance, follow-along task, notes, and completion control.
- Add course preparation, reference checklist, and common-mistakes views without overcrowding the lesson player.
- Preserve progress tracking and unlock the final assessment only when all required lessons are complete.
- Support phone portrait, phone landscape, tablet, and desktop layouts, plus reduced-motion preferences.

### 4. Use the authored assessment and project material
- Ground each generated final assessment in the actual course objectives and lesson content rather than the current generic objective text.
- Use the document’s authored final project brief instead of generating a random brief.
- Show required deliverables and the weighted rubric to the learner before submission.
- Let the reviewer score against the same rubric and record criterion-level results, feedback, total score, and approval decision.
- Keep certificate issuance behind passed assessment and approved project review.

### 5. Upgrade Academy administration
- Expand Admin > Courses so an administrator can review and edit course details, lessons, timestamps, preparation, project requirements, and rubric entries.
- Show curriculum completeness and lesson counts per course.
- Keep publishing controls and prevent malformed timestamps or incomplete rubric weights.

### 6. Verification and safety
- Validate that there are exactly 30 matched courses and 196 imported lessons.
- Validate every YouTube ID and start/end range, and confirm no segment overlaps within a source video where the curriculum says it should not.
- Confirm prices remain NGN 15,000/18,000/20,000/25,000 and USD 25/29/32/39 as authored.
- Test one course from public details through learner playback, progress, assessment, project submission, admin review, certificate issuance, and public verification.
- Check the Academy on portrait mobile, landscape mobile, tablet, and desktop.

## Technical details

- Add structured curriculum fields to the existing authoritative `courses` and `lessons` tables, plus rubric storage tied to each course.
- Use an additive, duplicate-safe migration and explicit permissions/access rules for every new table or field.
- Do not import the PDF itself as the learning interface; the document becomes structured Academy content.
- Keep YouTube as the video host and use the IFrame Player API for segment boundaries.
- Existing learner completion rows will be reconciled safely if a replaced placeholder lesson no longer exists.

## Scope boundary

This work covers the Academy curriculum, learner experience, assessments, projects, and course administration. Agency workflow/payments, email repair, and other previously listed work remain queued until this Academy upgrade is complete.
