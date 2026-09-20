import apex from '@/assets/editorial/case-apex-custom.png.asset.json';
import miftah from '@/assets/editorial/case-miftah-custom.png.asset.json';
import markaz from '@/assets/editorial/case-markaz-islamic-tech.jpg.asset.json';
import story from '@/assets/editorial/case-story-custom.png.asset.json';
import platform from '@/assets/editorial/case-platform.jpg.asset.json';
import results from '@/assets/editorial/case-results.jpg.asset.json';
import blogBrief from '@/assets/editorial/blog-brief.jpg.asset.json';
import blogAi from '@/assets/editorial/blog-ai.jpg.asset.json';
import blogReview from '@/assets/editorial/blog-review.jpg.asset.json';

export const caseStudyImages: Record<string, string> = {
  'apex-agri-capital-shared-farm-ledger': apex.url,
  'miftah-al-arabiyyah-arabic-curriculum': miftah.url,
  'markazussalaf-academic-operations-engine': markaz.url,
  'the-inheritance-of-shadows-story-series': story.url,
  'ndh-agency-academy-web-platform': platform.url,
  'basic-studies-result-reporting-system': results.url,
};

export function caseStudyImage(slug: string, storedUrl?: string | null) {
  return caseStudyImages[slug] || storedUrl || null;
}

export const blogImages: Record<string, string> = {
  'turning-a-business-idea-into-a-clear-digital-project-brief': blogBrief.url,
  'learning-ai-skills-that-hold-up-in-real-work': blogAi.url,
  'what-to-review-before-digital-work-goes-live': blogReview.url,
};

export function blogImage(slug: string, storedUrl?: string | null) {
  return blogImages[slug] || storedUrl || null;
}
