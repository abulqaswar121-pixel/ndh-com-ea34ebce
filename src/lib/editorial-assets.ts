import apex from '@/assets/editorial/case-apex.jpg.asset.json';
import miftah from '@/assets/editorial/case-miftah.jpg.asset.json';
import markaz from '@/assets/editorial/case-markaz.jpg.asset.json';
import story from '@/assets/editorial/case-story.jpg.asset.json';
import platform from '@/assets/editorial/case-platform.jpg.asset.json';
import results from '@/assets/editorial/case-results.jpg.asset.json';

export const caseStudyImages: Record<string, string> = {
  'apex-agri-capital-shared-farm-ledger': apex.url,
  'miftah-al-arabiyyah-arabic-curriculum': miftah.url,
  'markazussalaf-academic-operations-engine': markaz.url,
  'the-inheritance-of-shadows-story-series': story.url,
  'ndh-agency-academy-web-platform': platform.url,
  'basic-studies-result-reporting-system': results.url,
};

export function caseStudyImage(slug: string, storedUrl?: string | null) {
  return storedUrl || caseStudyImages[slug] || null;
}
