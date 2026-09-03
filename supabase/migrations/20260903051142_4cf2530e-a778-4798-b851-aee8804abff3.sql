INSERT INTO public.lessons (course_id, title, content, notes, position, is_free_preview)
SELECT
  c.id,
  replace(t.title, '{course}', c.title),
  replace(replace(replace(t.content, '{course}', c.title), '{summary}', coalesce(c.summary, 'the skills covered in this course')), '{school}', coalesce(c.school, 'the Academy')),
  t.notes,
  t.position,
  (t.position = 1)
FROM public.courses c
CROSS JOIN (
  VALUES
    (1,
     'Welcome and how {course} works',
     E'## What this course is\n\n{summary}\n\nThis course sits in the {school} school at NDH Academy. It is self-paced: work through the lessons in order, mark each one as watched, then sit the final assessment and submit the practical project.\n\n## How you will be assessed\n\n1. Complete every lesson.\n2. Sit the final assessment (pass mark 60%).\n3. Submit the practical project.\n4. A reviewer checks your project and your certificate is issued with a unique verification number.\n\n## What you need\n\nA laptop or phone with a reliable connection, and a free account on the main tools covered. No prior experience is assumed — we start from the fundamentals.',
     'Set aside about 20 minutes for this lesson.'),
    (2,
     'The landscape: tools, roles and where the money is',
     E'## The current landscape\n\nBefore touching a tool, it helps to see the whole field: who pays for {course} work, what a finished piece of work looks like, and which tools the market actually uses.\n\n## Who buys this work\n\n- Small businesses that need the outcome but have no in-house team.\n- Agencies subcontracting overflow work.\n- Startups that need speed more than polish.\n\n## Choosing your toolkit\n\nPick one primary tool and learn it deeply, then add a second for the tasks the first one handles badly. Chasing every new release is the most common way beginners lose months.\n\n## Task\n\nList three businesses near you that could use this work, and note what each of them would want delivered.',
     'Keep your list — you will use it again in the project lesson.'),
    (3,
     'Core workflow, step by step',
     E'## The workflow\n\nEvery professional job in this field follows the same spine:\n\n1. **Brief** — what is wanted, for whom, by when.\n2. **Research** — references, constraints, existing material.\n3. **Draft** — the fast, disposable first version.\n4. **Refine** — the version you would show a client.\n5. **Deliver** — packaged files, in the right format, with a short note.\n\n## Why the order matters\n\nSkipping research is what produces work that looks fine but misses the point. Skipping the throwaway draft is what makes people precious about weak ideas.\n\n## Task\n\nRun one small piece of work through all five steps and time each stage.',
     'Aim for one hour end to end. Speed comes later.'),
    (4,
     'Working with AI without losing quality',
     E'## Direction, not delegation\n\nAI is a fast assistant with no judgement. Your value is the judgement: the brief you write, the references you choose, and what you reject.\n\n## Prompting that works\n\n- State the audience and the outcome, not just the object.\n- Give one concrete reference or example.\n- Ask for options, then choose — never accept the first result.\n- Iterate in small, named changes so you can undo.\n\n## Quality control\n\nCheck every AI output for: factual errors, generic phrasing, rights and licensing, and whether it actually answers the brief. Anything you would not defend in front of a client does not ship.\n\n## Task\n\nTake one output you generated in lesson 3 and improve it through three deliberate rounds of revision. Save all four versions.',
     'The saved versions make a strong portfolio story.'),
    (5,
     'Standards, quality checks and common mistakes',
     E'## What a professional standard means here\n\n- It answers the brief in one look.\n- It is consistent: spacing, tone, naming, formats.\n- It is delivered in the format the client can actually use.\n- It can be revised without starting over.\n\n## The mistakes that cost jobs\n\n1. Delivering raw AI output with no editing pass.\n2. Ignoring file naming and versioning.\n3. Missing deadlines quietly instead of flagging early.\n4. No backup of source files.\n\n## Your checklist\n\nBuild a short pre-delivery checklist you run every single time. Five to eight items is enough.\n\n## Task\n\nWrite your checklist and apply it to the work from lesson 4.',
     'Keep the checklist somewhere you will actually open it.'),
    (6,
     'Pricing, clients and getting paid',
     E'## Pricing without guessing\n\nStart from time: estimate hours, multiply by the rate you need, then sanity-check against what similar work sells for locally and internationally. Quote per project, not per hour, once you know your speed.\n\n## The first conversation\n\nAsk: what is the outcome, who decides, what is the deadline, what is the budget range. If a client refuses all four, that is information too.\n\n## Getting paid\n\n- Take a deposit before starting (50% is normal).\n- Put scope and revision count in writing, even in a WhatsApp message.\n- Deliver watermarked or low-resolution previews until final payment where that applies.\n\n## Task\n\nWrite a one-page rate card for your services with three tiers.',
     'You can reuse this rate card on your NDH talent profile.'),
    (7,
     'Building a portfolio that wins work',
     E'## Three pieces beat thirty\n\nClients skim. Three strong, well-explained pieces convert better than a large gallery of unexplained work.\n\n## How to present one piece\n\n- The brief, in one line.\n- What you did, in three lines.\n- The result — a number, a quote, or a clear before and after.\n- The final work, shown properly.\n\n## Self-initiated work counts\n\nIf you have no clients yet, pick a real business, do the work unasked, and present it as a concept. Say clearly that it is a concept.\n\n## Task\n\nWrite the case-study text for the work you produced across lessons 3 to 5.',
     'This text doubles as your project submission notes.'),
    (8,
     'Preparing for the assessment and your project',
     E'## The final assessment\n\nA mixed paper: multiple choice, short answer and one written question, drawn from everything in this course. Pass mark is 60%. It is timed, so review your notes before you start.\n\n## The practical project\n\nYou receive a brief and submit real work against it. Reviewers look for: does it answer the brief, is it delivered to a professional standard, and can you explain your decisions.\n\n## How to prepare\n\n- Reread your notes from every lesson.\n- Redo the lesson 3 workflow once more, faster.\n- Have your checklist and rate card ready.\n\n## After you pass\n\nYour certificate carries a unique number and can be verified by any employer. It appears in your student portal as soon as your project is approved.',
     'Take the assessment when you are rested — you get the best of your own thinking.')
) AS t(position, title, content, notes)
WHERE NOT EXISTS (SELECT 1 FROM public.lessons l WHERE l.course_id = c.id);