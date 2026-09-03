import { createServerFn } from '@tanstack/react-start';
import { z } from 'zod';
import { requireSupabaseAuth } from '@/integrations/supabase/auth-middleware';

function paystackKey(): string {
  const key = process.env['PAYSTACK_SECRET_KEY'];
  if (!key) throw new Error('Payments are not configured yet. Please contact support.');
  return key;
}

/** Only same-site origins may be used as a payment return address. */
function safeOrigin(origin: string): string {
  const allowed = /^https?:\/\/(localhost(:\d+)?|[a-z0-9-]+\.lovable\.app|(www\.)?ndh\.com\.ng)$/i;
  if (!allowed.test(origin)) throw new Error('Invalid return address.');
  return origin;
}

export const initializeCoursePayment = createServerFn({ method: 'POST' })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) =>
    z
      .object({
        courseId: z.string().uuid(),
        email: z.string().email(),
        amount: z.number().positive(),
        currency: z.string().default('NGN'),
      })
      .parse(d),
  )
  .handler(async ({ data, context }) => {
    const response = await fetch('https://api.paystack.co/transaction/initialize', {
      method: 'POST',
      headers: { Authorization: `Bearer ${paystackKey()}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: data.email,
        amount: Math.round(data.amount * 100),
        currency: data.currency,
        metadata: { student_id: context.userId, course_id: data.courseId },
      }),
    });
    if (!response.ok) throw new Error('Unable to initialize payment');
    const body = (await response.json()) as any;
    return body.data as { authorization_url: string; reference: string; access_code: string };
  });

/**
 * Start checkout for a course. The price is read on the server from
 * course_pricing — never trusted from the browser. Free courses enrol
 * immediately without going to the payment provider.
 */
export const startCourseCheckout = createServerFn({ method: 'POST' })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) =>
    z.object({ slug: z.string().min(1), region: z.enum(['NG', 'INTL']).default('NG'), origin: z.string().url() }).parse(d),
  )
  .handler(async ({ data, context }): Promise<{ status: 'enrolled' | 'redirect'; url?: string }> => {
    const { data: course, error: courseError } = await context.supabase
      .from('courses')
      .select('id, title')
      .eq('slug', data.slug)
      .eq('is_published', true)
      .maybeSingle();
    if (courseError) throw new Error(courseError.message);
    if (!course) throw new Error('This course is not available.');

    const { data: existing } = await context.supabase
      .from('enrollments')
      .select('id, status')
      .eq('student_id', context.userId)
      .eq('course_id', course.id)
      .maybeSingle();
    if (existing && existing.status === 'active') return { status: 'enrolled' };

    const { data: prices, error: priceError } = await context.supabase
      .from('course_pricing')
      .select('region, currency, amount')
      .eq('course_id', course.id);
    if (priceError) throw new Error(priceError.message);

    const chosen =
      (prices ?? []).find((p) => (data.region === 'NG' ? p.region === 'NG' : p.region !== 'NG')) ??
      (prices ?? [])[0];
    const amount = Number(chosen?.amount ?? 0);

    if (!chosen || amount <= 0) {
      const { error } = await context.supabase
        .from('enrollments')
        .upsert(
          { student_id: context.userId, course_id: course.id, status: 'active' },
          { onConflict: 'student_id,course_id' },
        );
      if (error) throw new Error(error.message);
      await grantStudentRole(context.userId);
      return { status: 'enrolled' };
    }


    const email = (context.claims as any)?.email as string | undefined;
    if (!email) throw new Error('Your account has no email address on file.');

    const origin = safeOrigin(data.origin);
    const response = await fetch('https://api.paystack.co/transaction/initialize', {
      method: 'POST',
      headers: { Authorization: `Bearer ${paystackKey()}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email,
        amount: Math.round(amount * 100),
        currency: chosen.currency,
        callback_url: `${origin}/enrol/callback`,
        metadata: { student_id: context.userId, course_id: course.id, slug: data.slug },
      }),
    });
    if (!response.ok) throw new Error('Unable to start checkout. Please try again.');
    const body = (await response.json()) as any;
    const init = body.data as { authorization_url: string; reference: string };

    const { supabaseAdmin } = await import('@/integrations/supabase/client.server');
    await (supabaseAdmin as any).from('payment_transactions').upsert(
      {
        reference: init.reference,
        student_id: context.userId,
        course_id: course.id,
        amount,
        currency: chosen.currency,
        status: 'pending',
      },
      { onConflict: 'reference' },
    );

    return { status: 'redirect', url: init.authorization_url };
  });

/**
 * Verify a returning payment directly with the provider and activate the
 * enrolment. This is the browser-side safety net; the webhook does the same
 * job server to server.
 */
export const verifyCoursePayment = createServerFn({ method: 'POST' })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => z.object({ reference: z.string().min(6) }).parse(d))
  .handler(async ({ data, context }): Promise<{ paid: boolean; slug: string | null; title: string | null }> => {
    const response = await fetch(
      `https://api.paystack.co/transaction/verify/${encodeURIComponent(data.reference)}`,
      { headers: { Authorization: `Bearer ${paystackKey()}` } },
    );
    if (!response.ok) throw new Error('We could not confirm this payment yet.');
    const body = (await response.json()) as any;
    const tx = body.data;
    const meta = tx?.metadata ?? {};

    if (meta.student_id !== context.userId) throw new Error('This payment belongs to another account.');
    if (tx?.status !== 'success') return { paid: false, slug: meta.slug ?? null, title: null };

    const { supabaseAdmin } = await import('@/integrations/supabase/client.server');
    const { error } = await (supabaseAdmin as any).from('payment_transactions').upsert(
      {
        reference: tx.reference,
        student_id: meta.student_id,
        course_id: meta.course_id,
        amount: Number(tx.amount) / 100,
        currency: tx.currency,
        status: 'success',
        verified_at: new Date().toISOString(),
      },
      { onConflict: 'reference' },
    );
    if (error) throw new Error(error.message);
    const { error: activationError } = await (supabaseAdmin as any).rpc('activate_course_after_payment', {
      _reference: tx.reference,
    });
    if (activationError) throw new Error(activationError.message);
    await grantStudentRole(context.userId);


    const { data: course } = await context.supabase
      .from('courses')
      .select('slug, title')
      .eq('id', meta.course_id)
      .maybeSingle();

    return { paid: true, slug: course?.slug ?? meta.slug ?? null, title: course?.title ?? null };
  });
