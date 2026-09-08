import { createServerFn } from '@tanstack/react-start'; import { z } from 'zod'; import { requireSupabaseAuth } from '@/integrations/supabase/auth-middleware';
async function admin(context:any){const {data}=await context.supabase.rpc('is_admin');if(!data)throw new Error('Forbidden')}
export const reviewSubmission=createServerFn({method:'POST'}).middleware([requireSupabaseAuth]).inputValidator((d:unknown)=>z.object({submissionId:z.string().uuid(),decision:z.enum(['approved','rejected']),note:z.string().optional()}).parse(d)).handler(async({data,context})=>{await admin(context);const {supabaseAdmin}=await import('@/integrations/supabase/client.server');const {data:submission,error}=await (supabaseAdmin as any).from('academy_submissions').update({status:data.decision,reviewer_note:data.note||null,reviewed_by:context.userId,reviewed_at:new Date().toISOString()}).eq('id',data.submissionId).select('student_id,course_id').single();if(error)throw new Error(error.message);if(data.decision==='approved'){const certificate_number=`NDH-${Date.now()}-${submission.student_id.slice(0,6).toUpperCase()}`;const {data:certificate,error:certError}=await (supabaseAdmin as any).from('certificates').insert({student_id:submission.student_id,course_id:submission.course_id,certificate_number}).select('id').single();if(certError)throw new Error(certError.message);const [{data:profile},{data:course}]=await Promise.all([(supabaseAdmin as any).from('profiles').select('email,full_name').eq('id',submission.student_id).maybeSingle(),(supabaseAdmin as any).from('courses').select('title').eq('id',submission.course_id).maybeSingle()]);if(profile?.email){const {sendTransactionalEmail,SITE_URL}=await import('@/lib/email/transactional.server');await sendTransactionalEmail({to:profile.email,subject:`Your certificate is ready${course?.title?` — ${course.title}`:''}`,label:'certificate_issued',preview:'Your certificate has been issued.',heading:'Certificate issued',intro:`Congratulations${profile.full_name?`, ${String(profile.full_name).split(' ')[0]}`:''} — your project was approved and your certificate has been issued.`,details:[...(course?.title?[{label:'Course',value:course.title as string}]:[]),{label:'Certificate number',value:certificate_number}],ctaLabel:'View your certificate',ctaUrl:certificate?.id?`${SITE_URL}/certificate/${certificate.id}`:`${SITE_URL}/portal/student`})}}return {ok:true,decision:data.decision};});
export const setPMReviewAccess=createServerFn({method:'POST'}).middleware([requireSupabaseAuth]).inputValidator((d:unknown)=>z.object({pmId:z.string().uuid(),enabled:z.boolean()}).parse(d)).handler(async({data,context})=>{await admin(context);const {supabaseAdmin}=await import('@/integrations/supabase/client.server');const {error}=await (supabaseAdmin as any).from('pm_review_access').upsert({pm_id:data.pmId,enabled:data.enabled});if(error)throw new Error(error.message);return {ok:true}});
export const createInvite=createServerFn({method:'POST'}).middleware([requireSupabaseAuth]).inputValidator((d:unknown)=>z.object({role:z.enum(['talent','pm']),email:z.string().email(),fullName:z.string().min(1)}).parse(d)).handler(async({data,context})=>{await admin(context);const {supabaseAdmin}=await import('@/integrations/supabase/client.server');const token=crypto.randomUUID().replaceAll('-','')+crypto.randomUUID().replaceAll('-','');const table=data.role==='pm'?'pm_invitations':'talent_invitations';const {error}=await (supabaseAdmin as any).from(table).insert({token,email:data.email,full_name:data.fullName,invited_by:context.userId,expires_at:new Date(Date.now()+7*86400000).toISOString(),status:'pending'});if(error)throw new Error(error.message);const {sendTransactionalEmail,SITE_URL}=await import('@/lib/email/transactional.server');const roleLabel=data.role==='pm'?'Project Manager':'Talent';const {queued}=await sendTransactionalEmail({to:data.email,subject:`You are invited to join Najeeb Digital Hub as ${roleLabel}`,label:'invitation',preview:`Your ${roleLabel} invitation is ready.`,heading:`You're invited as ${roleLabel}`,intro:`Hello ${data.fullName.split(' ')[0]}, you have been invited to join the Najeeb Digital Hub ${roleLabel} team.`,body:['Accept the invitation below to create your account and get access to your portal. This link expires in 7 days.'],ctaLabel:'Accept invitation',ctaUrl:`${SITE_URL}/invite/${token}`});return {url:`/invite/${token}`,role:data.role,emailed:queued}});

export const listUsers = createServerFn({ method: 'POST' })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => z.object({ q: z.string().max(120).optional() }).parse(d))
  .handler(async ({ data, context }) => {
    await admin(context);
    const { supabaseAdmin } = await import('@/integrations/supabase/client.server');
    let query = (supabaseAdmin as any).from('profiles').select('id,full_name,email,created_at').order('created_at', { ascending: false }).limit(25);
    const q = (data.q ?? '').trim();
    if (q) query = query.or(`full_name.ilike.%${q}%,email.ilike.%${q}%`);
    const { data: profiles, error } = await query;
    if (error) throw new Error(error.message);
    const ids = (profiles ?? []).map((p: any) => p.id);
    const { data: roles } = ids.length
      ? await (supabaseAdmin as any).from('user_roles').select('user_id,role').in('user_id', ids)
      : { data: [] };
    return (profiles ?? []).map((p: any) => ({
      ...p,
      roles: (roles ?? []).filter((r: any) => r.user_id === p.id).map((r: any) => r.role as string),
    }));
  });

export const setUserRole = createServerFn({ method: 'POST' })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) =>
    z.object({
      userId: z.string().uuid(),
      role: z.enum(['client', 'student', 'talent', 'pm', 'admin']),
      grant: z.boolean(),
    }).parse(d),
  )
  .handler(async ({ data, context }) => {
    await admin(context);
    if (!data.grant && data.userId === context.userId && data.role === 'admin') {
      throw new Error('You cannot remove your own admin access.');
    }
    const { supabaseAdmin } = await import('@/integrations/supabase/client.server');
    if (data.grant) {
      const { error } = await (supabaseAdmin as any)
        .from('user_roles')
        .upsert({ user_id: data.userId, role: data.role }, { onConflict: 'user_id,role' });
      if (error) throw new Error(error.message);
    } else {
      const { error } = await (supabaseAdmin as any)
        .from('user_roles')
        .delete()
        .eq('user_id', data.userId)
        .eq('role', data.role);
      if (error) throw new Error(error.message);
    }
    await (supabaseAdmin as any).from('audit_logs').insert({
      actor_id: context.userId,
      action: data.grant ? 'role_granted' : 'role_revoked',
      target_user_id: data.userId,
      details: { role: data.role },
    });
    return { ok: true };
  });

export const listTalentApplications = createServerFn({ method: 'POST' })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => z.object({ status: z.string().default('pending') }).parse(d ?? {}))
  .handler(async ({ data, context }) => {
    await admin(context);
    const { supabaseAdmin } = await import('@/integrations/supabase/client.server');
    const { data: rows, error } = await (supabaseAdmin as any)
      .from('career_applications')
      .select('*')
      .eq('status', data.status)
      .order('created_at', { ascending: false })
      .limit(50);
    if (error) throw new Error(error.message);
    return rows ?? [];
  });

export const reviewTalentApplication = createServerFn({ method: 'POST' })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) =>
    z.object({
      applicationId: z.string().uuid(),
      decision: z.enum(['accepted', 'rejected']),
      note: z.string().max(1000).optional(),
    }).parse(d),
  )
  .handler(async ({ data, context }) => {
    await admin(context);
    const { supabaseAdmin } = await import('@/integrations/supabase/client.server');
    const { data: application, error } = await (supabaseAdmin as any)
      .from('career_applications')
      .update({ status: data.decision })
      .eq('id', data.applicationId)
      .select('full_name,email,role_applied')
      .single();
    if (error) throw new Error(error.message);

    const { sendTransactionalEmail, SITE_URL } = await import('@/lib/email/transactional.server');
    const firstName = String(application.full_name ?? '').split(' ')[0] || 'there';

    if (data.decision === 'rejected') {
      await sendTransactionalEmail({
        to: application.email,
        subject: 'Update on your Najeeb Digital Hub application',
        label: 'talent_application_rejected',
        preview: 'An update on your application.',
        heading: 'Application update',
        intro: `Hello ${firstName}, thank you for applying for ${application.role_applied}.`,
        body: [
          data.note || 'We are not moving forward with your application at this time, but we would be glad to hear from you again as our needs change.',
        ],
      });
      return { ok: true, invited: false, url: null as string | null };
    }

    const token = crypto.randomUUID().replaceAll('-', '') + crypto.randomUUID().replaceAll('-', '');
    const { error: inviteError } = await (supabaseAdmin as any).from('talent_invitations').insert({
      token,
      email: application.email,
      full_name: application.full_name,
      invited_by: context.userId,
      expires_at: new Date(Date.now() + 7 * 86400000).toISOString(),
      status: 'pending',
    });
    if (inviteError) throw new Error(inviteError.message);

    const { queued } = await sendTransactionalEmail({
      to: application.email,
      subject: 'Your Najeeb Digital Hub talent application was accepted',
      label: 'talent_application_accepted',
      preview: 'Accept your invitation to join the talent network.',
      heading: 'Welcome aboard',
      intro: `Hello ${firstName}, your application for ${application.role_applied} was accepted.`,
      body: [data.note || 'Accept the invitation below to set up your talent account. This link expires in 7 days.'],
      ctaLabel: 'Accept invitation',
      ctaUrl: `${SITE_URL}/invite/${token}`,
    });
    return { ok: true, invited: true, emailed: queued, url: `/invite/${token}` };
  });
