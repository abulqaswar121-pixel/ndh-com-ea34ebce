import * as React from 'react';
import { render } from '@react-email/render';
import { sendLovableEmail } from '@lovable.dev/email-js';
import { supabaseAdmin as db } from '@/integrations/supabase/client.server';
import { template } from '@/lib/email-templates/flyer-ready';
import { flyerLink, type DailyRow } from './daily.server';

export async function notifyFlyer(row: DailyRow, config: { recipient_email: string; sender_domain: string }, apiKey: string, origin: string) {
  if (row.email_state === 'sent') return { sent: true, error: null };
  if (!row.file_path || row.state !== 'ready') return { sent: false, error: 'Create and save the flyer first.' };
  if (!config.sender_domain) return { sent: false, error: 'Email delivery is waiting for your verified sender domain.' };
  const claim = await db.from('studio_daily_flyers').update({ email_state: 'sending', updated_at: new Date().toISOString() }).eq('id', row.id).in('email_state', ['waiting', 'failed']).select('id').maybeSingle();
  if (claim.error) throw new Error('Could not start email notification.');
  if (!claim.data) return { sent: false, error: 'An email notification is already being sent.' };
  try {
    const suppression = await db.from('suppressed_emails').select('id').eq('email', config.recipient_email).limit(1);
    if (suppression.error) throw new Error('Could not check email delivery preferences.');
    if (suppression.data.length) throw new Error('Email notifications are blocked for this address by its delivery preferences.');
    const tokenResult = await db.from('email_unsubscribe_tokens').insert({ email: config.recipient_email }).select('token').single();
    if (tokenResult.error) throw new Error('Could not prepare email notification.');
    const element = React.createElement(template.component, { headline: row.headline, downloadUrl: await flyerLink(row.file_path), studioUrl: `${origin}/admin/studio` });
    const html = await render(element); const text = await render(element, { plainText: true });
    const result = await sendLovableEmail({ to: config.recipient_email, from: `Najeeb Digital Hub <noreply@${config.sender_domain}>`, sender_domain: config.sender_domain, subject: template.subject, html, text, purpose: 'transactional', label: 'flyer-ready', idempotency_key: `flyer-ready:${row.id}`, unsubscribe_token: tokenResult.data.token }, { apiKey });
    if (!result.success) throw new Error('Email service did not accept the notification.');
    await db.from('studio_daily_flyers').update({ email_state: 'sent', email_error: null, updated_at: new Date().toISOString() }).eq('id', row.id);
    return { sent: true, error: null };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Email could not be delivered.';
    console.error('Flyer notification failed', message);
    await db.from('studio_daily_flyers').update({ email_state: 'failed', email_error: message, updated_at: new Date().toISOString() }).eq('id', row.id);
    return { sent: false, error: message };
  }
}