import { createServerFn } from '@tanstack/react-start';
import { z } from 'zod';
import { requireSupabaseAuth } from '@/integrations/supabase/auth-middleware';

async function myRoles(supabase: any, userId: string): Promise<string[]> {
  const { data } = await supabase.from('user_roles').select('role').eq('user_id', userId);
  return (data ?? []).map((r: any) => r.role as string);
}

async function requireStaff(supabase: any, userId: string) {
  const roles = await myRoles(supabase, userId);
  if (!roles.includes('admin') && !roles.includes('pm')) throw new Error('Staff only.');
  return roles;
}

/** Talents a PM can assign work to (id + name for the picker). */
export const listAssignableTalents = createServerFn({ method: 'GET' })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await requireStaff(context.supabase, context.userId);
    const { supabaseAdmin } = await import('@/integrations/supabase/client.server');
    const { data: roleRows } = await (supabaseAdmin as any)
      .from('user_roles')
      .select('user_id')
      .eq('role', 'talent');
    const ids = [...new Set((roleRows ?? []).map((r: any) => r.user_id as string))];
    if (ids.length === 0) return [];
    const { data: profiles } = await (supabaseAdmin as any)
      .from('profiles')
      .select('id, full_name, email')
      .in('id', ids);
    return (profiles ?? []).map((p: any) => ({
      id: p.id as string,
      name: (p.full_name as string) || (p.email as string) || 'Talent',
    }));
  });

/**
 * Create a task and assign it to a talent with an agreed fee. The fee is
 * credited to the talent's pending balance when the task is marked done and
 * becomes payable when the client accepts the project (all automatic).
 */
export const assignTask = createServerFn({ method: 'POST' })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) =>
    z
      .object({
        projectId: z.string().uuid(),
        title: z.string().min(2),
        dueDate: z.string().optional(),
        assigneeId: z.string().uuid().optional(),
        fee: z.number().nonnegative().optional(),
      })
      .parse(d),
  )
  .handler(async ({ data, context }) => {
    await requireStaff(context.supabase, context.userId);
    const { supabaseAdmin } = await import('@/integrations/supabase/client.server');
    if (data.assigneeId && (data.fee ?? 0) > 0) {
      const { data: project } = await (supabaseAdmin as any)
        .from('projects')
        .select('budget_amount')
        .eq('id', data.projectId)
        .maybeSingle();
      const { data: existing } = await (supabaseAdmin as any)
        .from('tasks')
        .select('talent_fee')
        .eq('project_id', data.projectId)
        .not('talent_fee', 'is', null);
      const committed =
        (existing ?? []).reduce((sum: number, t: any) => sum + Number(t.talent_fee ?? 0), 0) + (data.fee ?? 0);
      const budget = Number(project?.budget_amount ?? 0);
      if (budget > 0 && committed > budget) {
        throw new Error(
          `Agreed fees (₦${committed.toLocaleString()}) would exceed this project's budget (₦${budget.toLocaleString()}). Lower the fee or raise the budget.`,
        );
      }
    }
    const { error } = await (supabaseAdmin as any).from('tasks').insert({
      project_id: data.projectId,
      title: data.title.trim(),
      due_date: data.dueDate || null,
      assignee_id: data.assigneeId ?? null,
      talent_fee: data.assigneeId && (data.fee ?? 0) > 0 ? data.fee : null,
      status: 'todo',
    });
    if (error) throw new Error(error.message);

    if (data.assigneeId) {
      const { data: talent } = await (supabaseAdmin as any)
        .from('profiles')
        .select('email, full_name')
        .eq('id', data.assigneeId)
        .maybeSingle();
      const { data: project } = await (supabaseAdmin as any)
        .from('projects')
        .select('title')
        .eq('id', data.projectId)
        .maybeSingle();
      if (talent?.email) {
        const { sendTransactionalEmail, SITE_URL } = await import('@/lib/email/transactional.server');
        await sendTransactionalEmail({
          to: talent.email,
          subject: `New task for you — ${data.title.trim()}`,
          label: 'task_assigned',
          preview: 'A project manager has assigned you a task.',
          heading: `Hi ${(talent.full_name as string)?.split(' ')[0] || 'there'}, you have a new task`,
          intro: `A project manager assigned you a task${project?.title ? ` on ${project.title}` : ''}.`,
          details: [
            { label: 'Task', value: data.title.trim() },
            ...(data.dueDate ? [{ label: 'Deadline', value: data.dueDate }] : []),
            ...(data.fee ? [{ label: 'Agreed fee', value: `₦${data.fee.toLocaleString()}` }] : []),
          ],
          ctaLabel: 'Open your tasks',
          ctaUrl: `${SITE_URL}/portal/talent/tasks`,
          footnote: 'The fee moves to your pending balance when the task is marked done, and becomes payable when the client accepts the project.',
        });
      }
    }
    return { ok: true };
  });

/** PM updates which service areas they cover (drives brief notifications). */
export const setMyServiceAreas = createServerFn({ method: 'POST' })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => z.object({ areas: z.array(z.string()).max(12) }).parse(d))
  .handler(async ({ data, context }) => {
    const roles = await myRoles(context.supabase, context.userId);
    if (!roles.includes('pm') && !roles.includes('admin')) throw new Error('Project managers only.');
    const { error } = await context.supabase
      .from('profiles')
      .update({ service_areas: data.areas })
      .eq('id', context.userId);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const getMyServiceAreas = createServerFn({ method: 'GET' })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data } = await context.supabase
      .from('profiles')
      .select('service_areas')
      .eq('id', context.userId)
      .maybeSingle();
    return (data?.service_areas as string[] | null) ?? [];
  });

/** Client submits a brief; matching PMs and the admin get an email. */
export const submitBrief = createServerFn({ method: 'POST' })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) =>
    z
      .object({
        title: z.string().min(3),
        brief: z.string().min(10),
        budget: z.number().positive().optional(),
        serviceArea: z.string().optional(),
      })
      .parse(d),
  )
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase.from('projects').insert({
      client_id: context.userId,
      title: data.title.trim(),
      brief: data.brief.trim(),
      budget_amount: data.budget ?? null,
      service_area: data.serviceArea || null,
      status: 'draft',
    });
    if (error) throw new Error('Your brief could not be saved. Please try again or send it on WhatsApp.');

    const { supabaseAdmin } = await import('@/integrations/supabase/client.server');
    const { sendTransactionalEmail, adminNotificationEmail, SITE_URL } = await import(
      '@/lib/email/transactional.server'
    );
    const sends: Promise<unknown>[] = [];

    if (data.serviceArea) {
      const { data: pms } = await (supabaseAdmin as any)
        .from('profiles')
        .select('id, email, full_name')
        .contains('service_areas', [data.serviceArea]);
      for (const pm of pms ?? []) {
        const { data: isPm } = await (supabaseAdmin as any).rpc('has_role', { _user_id: pm.id, _role: 'pm' });
        if (!isPm || !pm.email) continue;
        sends.push(
          sendTransactionalEmail({
            to: pm.email,
            subject: `New ${data.serviceArea} brief — ${data.title.trim()}`,
            label: 'brief_match',
            preview: 'A new client brief matches your service area.',
            heading: 'A brief matches your area',
            intro: `A client submitted a ${data.serviceArea} brief. First to claim it owns the project.`,
            details: [
              { label: 'Project', value: data.title.trim() },
              ...(data.budget ? [{ label: 'Budget', value: `₦${data.budget.toLocaleString()}` }] : []),
            ],
            ctaLabel: 'Review open briefs',
            ctaUrl: `${SITE_URL}/portal/pm/briefs`,
          }),
        );
      }
    }

    sends.push(
      sendTransactionalEmail({
        to: adminNotificationEmail(),
        subject: `New client brief — ${data.title.trim()}`,
        label: 'brief_alert',
        preview: 'A client submitted a new brief.',
        heading: 'New client brief',
        intro: 'A client submitted a new brief.',
        details: [
          { label: 'Project', value: data.title.trim() },
          ...(data.serviceArea ? [{ label: 'Service area', value: data.serviceArea }] : []),
          ...(data.budget ? [{ label: 'Budget', value: `₦${data.budget.toLocaleString()}` }] : []),
        ],
        ctaLabel: 'Open admin portal',
        ctaUrl: `${SITE_URL}/portal/admin`,
      }),
    );

    await Promise.allSettled(sends);
    return { ok: true };
  });
