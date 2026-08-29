WITH v(slug,title,summary,school,ngn,usd) AS (VALUES
('ai-copywriting','AI Copywriting','Write clear, persuasive copy for landing pages, ads and campaigns with AI.','Writing & Content',15000,25),
('ai-content-strategy','AI Content Strategy','Plan, organise and scale a content system with AI-assisted research.','Writing & Content',15000,25),
('ai-blogging-and-seo','AI Blogging & SEO','Create useful, search-aware articles with an AI-assisted workflow.','Writing & Content',15000,25),
('ai-scriptwriting','AI Scriptwriting','Develop scripts for video, podcasts and short-form content.','Writing & Content',15000,25),
('ai-graphic-design','AI Graphic Design','Create visual assets with AI design tools and a focused art direction process.','Design & Brand',18000,29),
('ai-branding-and-identity','AI Branding & Identity','Build a coherent brand system with AI-assisted exploration and refinement.','Design & Brand',18000,29),
('ai-ui-ux-design','AI UI/UX Design','Move from user needs to clear interfaces and prototypes with AI support.','Design & Brand',18000,29),
('ai-illustration','AI Illustration','Direct and refine custom AI illustrations for a defined visual brief.','Design & Brand',18000,29),
('ai-video-editing','AI Video Editing','Edit, caption and package video content with an AI-assisted workflow.','Video & Media',18000,29),
('ai-video-generation','AI Video Generation','Explore AI video generation and shape usable visual sequences.','Video & Media',18000,29),
('ai-podcast-production','AI Podcast Production','Plan, edit and package a podcast using AI-assisted production tools.','Video & Media',18000,29),
('ai-photography-and-retouching','AI Photography & Retouching','Improve and prepare images with AI-assisted retouching techniques.','Video & Media',18000,29),
('ai-social-media-management','AI Social Media Management','Plan social content and use AI to support publishing and review.','Marketing & Growth',18000,29),
('ai-paid-ads','AI Paid Ads','Prepare paid advertising campaigns with AI-assisted research and creative work.','Marketing & Growth',18000,29),
('ai-email-marketing','AI Email Marketing','Build useful email campaigns and flows with AI support.','Marketing & Growth',18000,29),
('prompt-engineering','Prompt Engineering','Write structured prompts that produce more consistent AI results.','AI Engineering',25000,39),
('build-ai-agents','Build AI Agents','Design practical agent workflows with AI tools and integrations.','AI Engineering',25000,39),
('no-code-ai-apps','No-Code AI Apps','Turn a clear product idea into a working no-code AI application.','AI Engineering',25000,39),
('ai-workflow-automation','AI Workflow Automation','Map repeatable work and connect tools into an AI-assisted workflow.','AI Engineering',25000,39),
('ai-virtual-assistant','AI Virtual Assistant','Build modern virtual-assistant workflows supported by AI tools.','Business & Operations',20000,32),
('ai-customer-support','AI Customer Support','Plan helpful AI-assisted support experiences for customers.','Business & Operations',20000,32),
('ai-project-management','AI Project Management','Use AI to plan, track and report on project work.','Business & Operations',20000,32),
('ai-data-entry-and-analysis','AI Data Entry & Analysis','Speed up structured data work and produce clearer analysis with AI.','Business & Operations',20000,32),
('ai-youtube-growth-management','AI YouTube Growth Management','Audit a channel, plan content and use AI tools to guide growth decisions.','Marketing & Growth',18000,29),
('ai-linkedin-ghostwriting','AI LinkedIn Ghostwriting','Write consistent LinkedIn posts in a defined founder voice.','Writing & Content',15000,25),
('ai-e-book-writing-and-design','AI E-book Writing & Design','Create, design and package a non-fiction e-book from outline to export.','Writing & Content',15000,25),
('ai-3d-product-animation','AI 3D Product Animation','Create a short product turntable from references and prepare delivery files.','Video & Media',18000,29),
('ai-crm-setup-hubspot-gohighlevel','AI CRM Setup — HubSpot/GoHighLevel','Map a sales process and configure a working CRM automation.','Business & Operations',20000,32),
('ai-conversion-rate-optimization','AI Conversion Rate Optimization','Audit a landing page and recommend changes grounded in user behaviour.','Marketing & Growth',18000,29),
('saas-boilerplate-launch','SaaS Boilerplate Launch','Configure and deploy a working SaaS starter with auth, billing and dashboard.','AI Engineering',25000,39)
)
INSERT INTO public.courses (slug,title,summary,school,learning_objectives,project_theme,price_amount,currency,is_published)
SELECT v.slug, v.title, v.summary, v.school,
  'Understand the tools and current workflow behind ' || v.title || '.' || chr(10) ||
  'Produce work that meets a professional standard.' || chr(10) ||
  'Complete a practical project that is reviewed before your certificate is issued.',
  'Complete a realistic ' || v.title || ' brief and submit your finished work for review.',
  v.ngn, 'NGN', true
FROM v
WHERE NOT EXISTS (SELECT 1 FROM public.courses c WHERE c.slug = v.slug);

WITH v(slug,ngn,usd) AS (VALUES
('ai-copywriting',15000,25),('ai-content-strategy',15000,25),('ai-blogging-and-seo',15000,25),('ai-scriptwriting',15000,25),
('ai-graphic-design',18000,29),('ai-branding-and-identity',18000,29),('ai-ui-ux-design',18000,29),('ai-illustration',18000,29),
('ai-video-editing',18000,29),('ai-video-generation',18000,29),('ai-podcast-production',18000,29),('ai-photography-and-retouching',18000,29),
('ai-social-media-management',18000,29),('ai-paid-ads',18000,29),('ai-email-marketing',18000,29),
('prompt-engineering',25000,39),('build-ai-agents',25000,39),('no-code-ai-apps',25000,39),('ai-workflow-automation',25000,39),
('ai-virtual-assistant',20000,32),('ai-customer-support',20000,32),('ai-project-management',20000,32),('ai-data-entry-and-analysis',20000,32),
('ai-youtube-growth-management',18000,29),('ai-linkedin-ghostwriting',15000,25),('ai-e-book-writing-and-design',15000,25),
('ai-3d-product-animation',18000,29),('ai-crm-setup-hubspot-gohighlevel',20000,32),('ai-conversion-rate-optimization',18000,29),
('saas-boilerplate-launch',25000,39)
)
INSERT INTO public.course_pricing (course_id, region, currency, amount)
SELECT c.id, r.region, r.currency, CASE WHEN r.region = 'NG' THEN v.ngn ELSE v.usd END
FROM v
JOIN public.courses c ON c.slug = v.slug
CROSS JOIN (VALUES ('NG','NGN'),('GLOBAL','USD')) AS r(region,currency)
WHERE NOT EXISTS (
  SELECT 1 FROM public.course_pricing p WHERE p.course_id = c.id AND p.region = r.region
);