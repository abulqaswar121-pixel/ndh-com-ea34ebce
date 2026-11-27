import { describe, expect, it } from 'vitest';
import { dailyPlan } from './daily-plan';
import { dailyTemplate, lagosDay, photoTemplate } from './photo-catalog';
describe('NDH daily photo rules', () => {
  it('uses the Lagos date when UTC is still the previous day', () => { expect(lagosDay(new Date('2026-11-26T23:15:00Z'))).toBe('2026-11-27'); });
  it('selects only the businesses enabled by the admin', () => { expect(dailyTemplate('2026-11-27', ['agency']).brandId).toBe('agency'); expect(() => dailyTemplate('2026-11-27', [])).toThrow(); });
  it('keeps the six approved courses and services with their actual links', () => {
    expect(photoTemplate('graphic-design').headline).toBe('AI Graphic Design');
    expect(photoTemplate('graphic-design').url).toBe('https://ndhacademy.lovable.app');
    expect(photoTemplate('website-design').url).toBe('https://agency.ndh.com.ng');
  });
  it('makes a Black Friday greeting without invented prices or discounts', () => { const p = dailyPlan(new Date('2026-11-27T08:00:00Z'), ['academy', 'agency']); expect(p.headline).toBe('Black Friday'); expect(p.approved).toBe(false); expect(p.caption).not.toMatch(/%|₦|discount/i); });
  it('uses original artwork for a regular course or service day', () => { const p = dailyPlan(new Date('2026-12-02T08:00:00Z'), ['academy']); expect(p.approved).toBe(true); expect(p.template.brandId).toBe('academy'); });
  it('creates a Christmas greeting on December 25', () => { expect(dailyPlan(new Date('2026-12-25T08:00:00Z'), ['agency']).headline).toBe('Merry Christmas'); });
});