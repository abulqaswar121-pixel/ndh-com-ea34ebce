import aiEngineering from '@/assets/topics/school-ai-engineering.jpg.asset.json';
import businessOps from '@/assets/topics/school-business-operations.jpg.asset.json';
import designBrand from '@/assets/topics/school-design-brand.jpg.asset.json';
import marketingGrowth from '@/assets/topics/school-marketing-growth.jpg.asset.json';
import videoMedia from '@/assets/topics/school-video-media.jpg.asset.json';
import writingContent from '@/assets/topics/school-writing-content.jpg.asset.json';

import svcBrand from '@/assets/topics/service-brand-identity.jpg.asset.json';
import svcDesign from '@/assets/topics/service-design-product.jpg.asset.json';
import svcDev from '@/assets/topics/service-development.jpg.asset.json';
import svcContent from '@/assets/topics/service-content-writing.jpg.asset.json';
import svcMarketing from '@/assets/topics/service-marketing-growth.jpg.asset.json';
import svcVideo from '@/assets/topics/service-video-media.jpg.asset.json';
import svcData from '@/assets/topics/service-data-business.jpg.asset.json';
import svcAi from '@/assets/topics/service-ai-automation.jpg.asset.json';

const schoolImages: Record<string, { url: string; alt: string }> = {
  'AI Engineering': { url: aiEngineering.url, alt: 'A developer building and testing software on a laptop' },
  'Business & Operations': { url: businessOps.url, alt: 'Colleagues reviewing business reports together' },
  'Design & Brand': { url: designBrand.url, alt: 'A designer working with colour swatches and sketches' },
  'Marketing & Growth': { url: marketingGrowth.url, alt: 'A team planning a marketing campaign on a board' },
  'Video & Media': { url: videoMedia.url, alt: 'An editor working on video footage at a computer' },
  'Writing & Content': { url: writingContent.url, alt: 'A writer drafting content on a laptop' },
};

export function schoolImage(school?: string | null) {
  if (!school) return null;
  return schoolImages[school] ?? null;
}

const serviceImages: Record<string, { url: string; alt: string }> = {
  'brand-identity': { url: svcBrand.url, alt: 'Designers sketching brand ideas on paper' },
  'design-product': { url: svcDesign.url, alt: 'A product board covered in flow and interface notes' },
  development: { url: svcDev.url, alt: 'A developer building a web product at a desk' },
  'content-writing': { url: svcContent.url, alt: 'A writer making notes beside a laptop and coffee' },
  'marketing-growth': { url: svcMarketing.url, alt: 'A marketer reviewing campaign performance' },
  'video-media': { url: svcVideo.url, alt: 'A production crew filming on set' },
  'data-business': { url: svcData.url, alt: 'Business charts and reports reviewed on a laptop' },
  'ai-automation': { url: svcAi.url, alt: 'An engineer setting up automated workflows on a computer' },
};

export function serviceImage(slug?: string | null) {
  if (!slug) return null;
  return serviceImages[slug] ?? null;
}
