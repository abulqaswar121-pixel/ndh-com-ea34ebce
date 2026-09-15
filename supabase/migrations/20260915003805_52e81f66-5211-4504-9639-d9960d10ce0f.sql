UPDATE public.case_studies
SET cover_image_url = CASE slug
  WHEN 'apex-agri-capital-shared-farm-ledger' THEN '/__l5e/assets-v1/d0abae15-da96-4f45-b0f6-003a3d330203/case-apex.jpg'
  WHEN 'miftah-al-arabiyyah-arabic-curriculum' THEN '/__l5e/assets-v1/63a1617a-1c3c-465a-b095-5a0d21e176bd/case-miftah.jpg'
  WHEN 'markazussalaf-academic-operations-engine' THEN '/__l5e/assets-v1/0eb25962-4e1f-4f9f-8e09-d560f6aaa6dd/case-markaz.jpg'
  WHEN 'the-inheritance-of-shadows-story-series' THEN '/__l5e/assets-v1/40845d6a-b2e9-40ee-be95-096015645b51/case-story.jpg'
  WHEN 'ndh-agency-academy-web-platform' THEN '/__l5e/assets-v1/552fb64b-c94c-442e-b6df-556d9325af8e/case-platform.jpg'
  WHEN 'basic-studies-result-reporting-system' THEN '/__l5e/assets-v1/edf6980a-576e-4901-a5e3-b1a29c3223f2/case-results.jpg'
  ELSE cover_image_url
END,
updated_at = now()
WHERE slug IN (
  'apex-agri-capital-shared-farm-ledger',
  'miftah-al-arabiyyah-arabic-curriculum',
  'markazussalaf-academic-operations-engine',
  'the-inheritance-of-shadows-story-series',
  'ndh-agency-academy-web-platform',
  'basic-studies-result-reporting-system'
);

INSERT INTO public.posts (slug, title, excerpt, body, cover_image_url, author_name, is_published, published_at)
VALUES
(
  'turning-a-business-idea-into-a-clear-digital-project-brief',
  'Turning a Business Idea into a Clear Digital Project Brief',
  'A practical way to explain the problem, users, priorities and boundaries before digital work begins.',
  E'A useful project brief does not need to be long. It needs to remove the most expensive forms of guesswork.\n\nStart with the problem\nDescribe what is currently difficult, slow or unreliable. Avoid beginning with a preferred feature. A team can propose a better route when it understands the real obstacle.\n\nName the people who will use it\nA client, administrator and field operator often need very different experiences. List the main users, what each one needs to achieve, and any information they should not see.\n\nSeparate essential outcomes from ideas\nWrite the three outcomes the first version must deliver. Keep additional ideas in a later list. This protects the budget and makes the first release easier to test.\n\nShare the working conditions\nMention the expected launch window, available content, existing tools, approval process and realistic budget range. Constraints are useful design information, not something to hide.\n\nDefine what success looks like\nUse observable outcomes: a report that takes minutes instead of days, a contribution history members can inspect, or a course a learner can complete on a phone. Avoid impressive-sounding numbers that have no evidence behind them.\n\nA clear brief is the beginning of a good working relationship. It gives the project manager enough context to ask sharper questions, agree the scope and match the right people to the work.',
  '/__l5e/assets-v1/f6109384-262d-4ee0-baab-6b94015cdf96/blog-brief.jpg',
  'Najeeb Digital Hub',
  true,
  now() - interval '2 days'
),
(
  'learning-ai-skills-that-hold-up-in-real-work',
  'Learning AI Skills That Hold Up in Real Work',
  'The difference between trying an AI tool and building a repeatable skill you can use responsibly on a real project.',
  E'AI tools can produce a quick first result, but professional work asks for more: judgement, verification and a repeatable process.\n\nLearn the task, not only the tool\nTools change quickly. The lasting skill is understanding the work around them: research, writing, image direction, data handling, review or delivery. Learn what a good result looks like before optimising for speed.\n\nWork from a clear input\nStrong outputs begin with context. Define the audience, purpose, format, constraints and source material. Treat prompting as briefing a capable assistant rather than entering a magic phrase.\n\nBuild a review habit\nCheck facts, names, calculations, links, permissions and tone. For visual work, inspect small details and remove accidental text or misleading elements. AI assistance does not transfer responsibility away from the person delivering the work.\n\nKeep evidence of your process\nSave the brief, key decisions, revisions and final checks. This makes the work easier to improve and gives a reviewer something concrete to assess.\n\nFinish with a real project\nA skill becomes useful when it survives a complete task. Build something for a realistic audience, follow a rubric and respond to feedback. That is why NDH Academy courses connect lessons to a project rather than stopping at passive video watching.\n\nThe goal is not to use AI everywhere. It is to know where it helps, where human judgement is essential and how to deliver work that another person can trust.',
  '/__l5e/assets-v1/8f36c93f-dce9-408e-8747-1bc13fe4c187/blog-ai.jpg',
  'Najeeb Digital Hub',
  true,
  now() - interval '1 day'
),
(
  'what-to-review-before-digital-work-goes-live',
  'What to Review Before Digital Work Goes Live',
  'A focused final review for clarity, access, content, payments and the small-screen experience.',
  E'Launch review is not only a final glance at the home page. It is a structured check of the paths people will actually take.\n\nFollow complete journeys\nStart as a new visitor. Find the service or course, open the details, complete the important action and confirm what happens next. Repeat the journey as each signed-in role when the product has different portals.\n\nCheck the words and evidence\nRemove placeholder copy, unsupported claims and outdated links. Confirm names, prices, dates and contact details. Every image should help explain the subject and should not pretend to show a delivered result when it is only editorial.\n\nTest the smallest screen\nUse portrait and landscape views. Look for clipped headings, hidden controls, crowded navigation and forms that are difficult to complete. A layout that works on a desktop can still fail when a phone rotates.\n\nTest money and messages\nFor paid products, complete a controlled payment and confirm the receipt, access change and transaction record. Trigger important emails and confirm both the sender and recipient experience.\n\nReview permissions\nA public visitor should not see private course material or project files. A signed-in user should see only the work connected to their role. Administrative actions must be checked on the server, not only hidden in the interface.\n\nPrepare a recovery route\nErrors should explain what the person can do next. Keep a support route visible, preserve records needed to investigate, and make sure a failed payment or upload can be retried safely.\n\nGood launch review is quiet work, but it protects trust. The goal is not to claim perfection; it is to find the expensive problems before a real user does.',
  '/__l5e/assets-v1/9d881cda-092c-420a-bdef-43e6721792b0/blog-review.jpg',
  'Najeeb Digital Hub',
  true,
  now()
)
ON CONFLICT (slug) DO UPDATE SET
  title = excluded.title,
  excerpt = excluded.excerpt,
  body = excluded.body,
  cover_image_url = excluded.cover_image_url,
  author_name = excluded.author_name,
  is_published = excluded.is_published,
  published_at = excluded.published_at,
  updated_at = now();