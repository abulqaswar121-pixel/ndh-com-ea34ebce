import { supabaseAdmin as db } from '@/integrations/supabase/client.server';
import { dailyPlan } from './daily-plan';
import { photoTemplate, photoCaption, lagosDay } from './photo-catalog';
import { renderServerPhoto } from './photo-render.server';
import type { Database } from '@/integrations/supabase/types';
export type DailyRow = Database['public']['Tables']['studio_daily_flyers']['Row'];
export async function dailySettings(recipient: string) {
  const { data, error } = await db.from('studio_daily_settings').select('*').eq('id', 1).maybeSingle();
  if (error) throw new Error('Could not load daily flyer settings.');
  if (data) return data;
  const created = await db.from('studio_daily_settings').insert({ id: 1, recipient_email: recipient, enabled: true }).select().single();
  if (created.error) throw new Error('Could not save daily flyer settings.');
  return created.data;
}
export async function flyerLink(path: string) {
  const result = await db.storage.from('studio-flyers').createSignedUrl(path, 7 * 86400, { download: true });
  if (result.error) throw new Error('Could not create private download link.');
  // Return the public browser origin, never the sandbox-internal database URL.
  const url = new URL(result.data.signedUrl);
  const browserUrl = import.meta.env.VITE_SUPABASE_URL;
  return new URL(url.pathname + url.search, browserUrl).href;
}
export async function createDailyFlyer(origin: string, options: { automatic: boolean; templateId?: string; headline?: string; subhead?: string; approved?: boolean }, recipient: string) {
  const settings = await dailySettings(recipient); const plan = dailyPlan(new Date(), settings.brand_ids);
  if (options.automatic) {
    if (!settings.enabled) return null;
    const existing = await db.from('studio_daily_flyers').select('*').eq('day', plan.day).eq('automatic', true).maybeSingle();
    if (existing.error) throw new Error('Could not check today’s flyer.');
    if (existing.data?.state === 'ready') return existing.data;
    if (existing.data?.state === 'creating' && Date.now() - Date.parse(existing.data.updated_at) < 10 * 60000) return null;
    if (existing.data) {
      const deleted = await db.from('studio_daily_flyers').delete().eq('id', existing.data.id).eq('state', existing.data.state);
      if (deleted.error) throw new Error('Could not retry today’s flyer.');
    }
  }
  const t = options.templateId ? photoTemplate(options.templateId) : plan.template;
  const headline = options.headline ?? plan.headline; const subhead = options.subhead ?? plan.subhead;
  const inserted = await db.from('studio_daily_flyers').insert({ day: lagosDay(), automatic: options.automatic, template_id: t.id, brand_id: t.brandId, headline, caption: photoCaption({ ...t, headline, subhead }) }).select().single();
  if (inserted.error?.code === '23505') return null;
  if (inserted.error) throw new Error('Could not save this flyer.');
  const row = inserted.data;
  try {
    const image = await renderServerPhoto(t, headline, subhead, options.approved ?? plan.approved, origin);
    const path = `${row.id}/flyer.${image.extension}`;
    const upload = await db.storage.from('studio-flyers').upload(path, image.bytes, { contentType: image.mime, upsert: true });
    if (upload.error) throw new Error('Could not upload flyer.');
    const saved = await db.from('studio_daily_flyers').update({ state: 'ready', file_path: path, updated_at: new Date().toISOString() }).eq('id', row.id).select().single();
    if (saved.error) throw new Error('Could not finish saving flyer.');
    return saved.data;
  } catch (error) {
    await db.from('studio_daily_flyers').update({ state: 'failed', updated_at: new Date().toISOString() }).eq('id', row.id);
    throw error;
  }
}