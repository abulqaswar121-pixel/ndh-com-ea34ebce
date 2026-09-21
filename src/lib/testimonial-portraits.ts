import ahmad from '@/assets/testimonials/ahmad-tijjani.jpg';
import najeeb from '@/assets/testimonials/najeeb-ahmad.jpg';
import muhsin from '@/assets/testimonials/muhsin-musa.jpg';
import chidi from '@/assets/testimonials/chidi-okafor.jpg';
import fatoumata from '@/assets/testimonials/fatoumata-diallo.jpg';
import sarah from '@/assets/testimonials/sarah-jenkins.jpg';
import amina from '@/assets/testimonials/amina-yusuf.jpg';
import tariq from '@/assets/testimonials/tariq-mahmoud.jpg';
import kwesi from '@/assets/testimonials/kwesi-mensah.jpg';
import zainab from '@/assets/testimonials/zainab-malik.jpg';

const portraits: Record<string, string> = {
  'dr ahmad muhammad tijjani': ahmad,
  'ahmad muhammad tijjani': ahmad,
  'najeeb ahmad': najeeb,
  'muhsin musa': muhsin,
  'chidi okafor': chidi,
  'fatoumata diallo': fatoumata,
  'sarah jenkins': sarah,
  'amina yusuf': amina,
  'tariq mahmoud': tariq,
  'kwesi mensah': kwesi,
  'zainab malik': zainab,
};

export function testimonialPortrait(authorName: string, storedUrl?: string | null) {
  if (storedUrl) return storedUrl;
  const key = authorName
    .toLowerCase()
    .replace(/[^a-z\s]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
  return portraits[key] ?? null;
}
