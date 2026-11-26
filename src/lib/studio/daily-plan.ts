import { dailyTemplate, lagosDay, photoCaption, type PhotoTemplate } from './photo-catalog';
export function dailyPlan(now: Date, brands: string[]) {
  const day = lagosDay(now); const t = dailyTemplate(day, brands);
  const fixed: Record<string, [string, string]> = {
    '01-01': ['Happy New Year', 'New beginnings. New ideas. Let’s grow together.'],
    '03-08': ['Celebrating Women', 'Here’s to the women creating, leading and making a difference.'],
    '05-01': ['Happy Workers’ Day', 'Celebrating the skill, care and effort behind every great result.'],
    '12-25': ['Merry Christmas', 'Wishing you and your loved ones peace, joy and a wonderful celebration.'],
  };
  let greeting = fixed[day.slice(5)];
  const d = new Date(day + 'T12:00:00Z');
  if (d.getUTCMonth() === 10 && d.getUTCDay() === 5 && d.getUTCDate() >= 23 && d.getUTCDate() <= 29)
    greeting = ['Black Friday', 'Invest in better skills and a stronger business. Explore NDH today.'];
  const template: PhotoTemplate = greeting ? { ...t, headline: greeting[0], subhead: greeting[1], cta: 'Explore NDH', bullets: ['Skills for tomorrow', 'Ideas into action', 'Growing together'] } : t;
  return { day, template, headline: template.headline, subhead: template.subhead, caption: photoCaption(template), approved: !greeting };
}