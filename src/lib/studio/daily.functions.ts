import { createServerFn } from '@tanstack/react-start';
import { getRequest } from '@tanstack/react-start/server';
import { z } from 'zod';
import { requireSupabaseAuth } from '@/integrations/supabase/auth-middleware';
import { PHOTO_TEMPLATES } from './photo-catalog';
export const dailyStudio = createServerFn({ method: 'POST' }).middleware([requireSupabaseAuth]).inputValidator((input: unknown) => z.discriminatedUnion('action', [
  z.object({ action: z.literal('read') }),
  z.object({ action: z.literal('settings'), enabled: z.boolean(), recipient: z.string().email(), senderDomain: z.string().max(253).regex(/^$|^(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z]{2,}$/), brands: z.array(z.enum(['academy', 'agency'])).min(1) }),
  z.object({ action: z.literal('create'), templateId: z.enum(PHOTO_TEMPLATES.map(t => t.id) as [string, ...string[]]), headline: z.string().trim().min(1).max(70), subhead: z.string().trim().min(1).max(160), approved: z.boolean() }),
  z.object({ action: z.literal('today') }),
  z.object({ action: z.literal('email'), id: z.string().uuid() }),
]).parse(input)).handler(async ({ data, context }) => {
  const role = await context.supabase.rpc('has_role', { _user_id: context.userId, _role: 'admin' });
  if (role.error || !role.data) throw new Error('Only NDH admins can manage daily flyers.');
  const { supabaseAdmin: db } = await import('@/integrations/supabase/client.server');
  const { dailySettings, createDailyFlyer, flyerLink } = await import('./daily.server');
  const recipient = process.env['ADMIN_NOTIFICATION_EMAIL'] || 'abunnajeeh7@gmail.com';
  const origin = new URL(getRequest().url).origin;
  let config = await dailySettings(recipient);
  let notification: { sent: boolean; error: string | null } | null = null;
  if (data.action === 'settings') {
    const saved = await db.from('studio_daily_settings').update({ enabled: data.enabled, recipient_email: data.recipient, sender_domain: data.senderDomain, brand_ids: data.brands, updated_at: new Date().toISOString() }).eq('id', 1).select().single();
    if (saved.error) throw new Error('Could not save delivery settings.'); config = saved.data;
  }
  if (data.action === 'create' || data.action === 'today') {
    const row = await createDailyFlyer(origin, data.action === 'today' ? { automatic: true } : { automatic: false, templateId: data.templateId, headline: data.headline, subhead: data.subhead, approved: data.approved }, recipient);
    if (row) {
      const { notifyFlyer } = await import('./daily-email.server');
      notification = await notifyFlyer(row, config, process.env['LOVABLE_API_KEY'] || '', origin);
    }
  }
  if (data.action === 'email') {
    const found = await db.from('studio_daily_flyers').select('*').eq('id', data.id).single();
    if (found.error) throw new Error('Flyer not found.');
    const { notifyFlyer } = await import('./daily-email.server');
    notification = await notifyFlyer(found.data, config, process.env['LOVABLE_API_KEY'] || '', origin);
  }
  const rows = await db.from('studio_daily_flyers').select('*').order('created_at', { ascending: false }).limit(20);
  if (rows.error) throw new Error('Could not load saved flyers.');
  const flyers = await Promise.all(rows.data.map(async row => ({ ...row, downloadUrl: row.file_path ? await flyerLink(row.file_path) : null })));
  return { config, flyers, notification };
});