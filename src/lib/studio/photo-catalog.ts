import graphic from '@/assets/studio/graphic-design.jpg.asset.json';
import video from '@/assets/studio/video-editing.jpg.asset.json';
import copy from '@/assets/studio/copywriting.jpg.asset.json';
import website from '@/assets/studio/website-design.jpg.asset.json';
import branding from '@/assets/studio/branding.jpg.asset.json';
import automation from '@/assets/studio/automation.jpg.asset.json';
import graphicPhoto from '@/assets/topics/course-ai-graphic-design.jpg.asset.json';
import videoPhoto from '@/assets/topics/course-ai-video-editing.jpg.asset.json';
import copyPhoto from '@/assets/topics/course-ai-copywriting.jpg.asset.json';
import websitePhoto from '@/assets/topics/service-development.jpg.asset.json';
import brandingPhoto from '@/assets/topics/service-brand-identity.jpg.asset.json';
import automationPhoto from '@/assets/topics/service-ai-automation.jpg.asset.json';
import gateway from '@/assets/studio/gateway.png.asset.json';
import regular from '@/assets/studio/dm-sans-400.ttf.asset.json';
import bold from '@/assets/studio/dm-sans-700.ttf.asset.json';
import heavy from '@/assets/studio/dm-sans-800.ttf.asset.json';

export const PHOTO_PALETTE = { navy: '#0A1A30', paper: '#F8FAFC', blue: '#0099F5', white: '#FFFFFF', muted: '#CBD5E1' };
export const PHOTO_FONTS = [regular.url, bold.url, heavy.url];
export const PHOTO_GATEWAY = gateway.url;
export type PhotoTemplate = { id: string; brandId: 'academy' | 'agency'; name: string; headline: string; subhead: string; bullets: string[]; cta: string; url: string; artwork: string; photo: string };
export const PHOTO_TEMPLATES: PhotoTemplate[] = [
  { id: 'graphic-design', brandId: 'academy', name: 'NDH Academy', headline: 'AI Graphic Design', subhead: 'Turn your ideas into standout visuals.', bullets: ['Social media graphics', 'Flyers and posters', 'Brand visuals'], cta: 'Explore the Course', url: 'https://ndhacademy.lovable.app', artwork: graphic.url, photo: graphicPhoto.url },
  { id: 'video-editing', brandId: 'academy', name: 'NDH Academy', headline: 'AI Video Editing', subhead: 'Make every frame count.', bullets: ['Edit and trim clips', 'Add captions', 'Polish your videos'], cta: 'Explore the Course', url: 'https://ndhacademy.lovable.app', artwork: video.url, photo: videoPhoto.url },
  { id: 'copywriting', brandId: 'academy', name: 'NDH Academy', headline: 'AI Copywriting', subhead: 'Write words that move people.', bullets: ['Sales messages', 'Website content', 'Social media captions'], cta: 'Explore the Course', url: 'https://ndhacademy.lovable.app', artwork: copy.url, photo: copyPhoto.url },
  { id: 'website-design', brandId: 'agency', name: 'NDH Agency', headline: 'Website Design & Development', subhead: 'Give your business a professional home online.', bullets: ['Business websites', 'Online stores', 'Mobile-friendly design'], cta: "Let’s Build Your Website", url: 'https://agency.ndh.com.ng', artwork: website.url, photo: websitePhoto.url },
  { id: 'branding', brandId: 'agency', name: 'NDH Agency', headline: 'Branding & Visual Design', subhead: 'Give your business a look people remember.', bullets: ['Logo and identity', 'Flyers and social posts', 'Brand consistency'], cta: "Let’s Shape Your Brand", url: 'https://agency.ndh.com.ng', artwork: branding.url, photo: brandingPhoto.url },
  { id: 'automation', brandId: 'agency', name: 'NDH Agency', headline: 'AI Automation', subhead: 'Less repetitive work. More time to grow.', bullets: ['Customer follow-ups', 'Connected workflows', 'Routine tasks'], cta: 'Explore Automation', url: 'https://agency.ndh.com.ng', artwork: automation.url, photo: automationPhoto.url },
];
export function photoTemplate(id: string) {
  const found = PHOTO_TEMPLATES.find(t => t.id === id);
  if (!found) throw new Error('Choose an available photo template.');
  return found;
}
export function lagosDay(now = new Date()) {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'Africa/Lagos', year: 'numeric', month: '2-digit', day: '2-digit' }).format(now);
}
export function dailyTemplate(day: string, brands: string[]) {
  const available = PHOTO_TEMPLATES.filter(t => brands.includes(t.brandId));
  if (!available.length) throw new Error('Select Academy or Agency.');
  const index = Math.floor(Date.parse(day + 'T00:00:00Z') / 86400000) % available.length;
  const template = available[index];
  if (!template) throw new Error('Invalid posting date.');
  return template;
}
export function photoCaption(t: PhotoTemplate) {
  return `${t.headline}\n\n${t.subhead}\n\n${t.bullets.map(b => '• ' + b).join('\n')}\n\n${t.cta}: ${t.url}\n\n#NDH #${t.brandId === 'academy' ? 'NDHAcademy' : 'NDHAgency'}`;
}