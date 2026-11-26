import { createFileRoute } from '@tanstack/react-router';
export const Route = createFileRoute('/api/public/studio/daily')({ server: { handlers: { POST: async ({ request }) => {
  const { authenticateCronRequest } = await import('@/integrations/supabase/cron-auth');
  const denied = await authenticateCronRequest(request); if (denied) return denied;
  const { dailySettings, createDailyFlyer } = await import('@/lib/studio/daily.server');
  const recipient = process.env['ADMIN_NOTIFICATION_EMAIL'] || 'abunnajeeh7@gmail.com';
  try {
    const config = await dailySettings(recipient);
    if (!config.enabled) return Response.json({ skipped: true });
    const origin = new URL(request.url).origin;
    const row = await createDailyFlyer(origin, { automatic: true }, recipient);
    if (!row) return Response.json({ skipped: true });
    const { notifyFlyer } = await import('@/lib/studio/daily-email.server');
    const result = await notifyFlyer(row, config, process.env['LOVABLE_API_KEY'] || '', origin);
    return Response.json({ created: true, emailSent: result.sent, emailPending: !result.sent });
  } catch (error) { console.error('Daily flyer task failed', error); return Response.json({ error: 'Daily flyer task could not finish.' }, { status: 500 }); }
} } } });