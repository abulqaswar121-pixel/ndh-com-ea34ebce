import { createServerFn } from '@tanstack/react-start';
import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/integrations/supabase/types';

type RuntimeEnvironment = Record<string, unknown>;

function readServerEnvironment(name: string): string | undefined {
  const processValue = typeof process !== 'undefined' ? process.env[name] : undefined;
  if (processValue) return processValue;
  const runtimeEnvironment = (globalThis as typeof globalThis & { __env__?: RuntimeEnvironment }).__env__;
  const runtimeValue = runtimeEnvironment?.[name];
  return typeof runtimeValue === 'string' && runtimeValue ? runtimeValue : undefined;
}

function publicDataClient(service: 'catalog' | 'enquiry' = 'catalog') {
  const url = readServerEnvironment('SUPABASE_URL');
  const key = readServerEnvironment('SUPABASE_PUBLISHABLE_KEY');
  if (!url || !key) throw new Error(`Public ${service} configuration is unavailable.`);
  return createPublicDataClient(url, key);
}

function assertQuery(error: { message: string } | null, operation: string): void {
  if (error) {
    console.error(`Public data query failed (${operation}):`, error.message);
    throw new Error('Public content is temporarily unavailable.');
  }
}

function createPublicDataClient(url: string, key: string) {
  return createClient<Database>(url, key, {
    global: {
      fetch: (input, init) => {
        const headers = new Headers(
          typeof Request !== 'undefined' && input instanceof Request ? input.headers : undefined,
        );
        if (init?.headers) {
          new Headers(init.headers).forEach((value, name) => headers.set(name, value));
        }
        if (key.startsWith('sb_') && headers.get('Authorization') === `Bearer ${key}`) {
          headers.delete('Authorization');
        }
        headers.set('apikey', key);
        return fetch(input, { ...init, headers });
      },
    },
    auth: {
      storage: undefined,
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

export type CoursePrice = { region: string; currency: string; amount: number };
export type CourseSummary = {
  id: string;
  slug: string;
  title: string;
  summary: string | null;
  school: string | null;
  prices: CoursePrice[];
};

export const listCourses = createServerFn({ method: 'GET' }).handler(async (): Promise<CourseSummary[]> => {
  const db = publicDataClient();
  const [{ data: courses, error: coursesError }, { data: pricing, error: pricingError }] = await Promise.all([
    db.from('courses').select('id, slug, title, summary, school').eq('is_published', true).order('title'),
    db.from('course_pricing').select('course_id, region, currency, amount'),
  ]);
  assertQuery(coursesError, 'courses');
  assertQuery(pricingError, 'course pricing');
  return (courses ?? []).map((c) => ({
    ...c,
    prices: (pricing ?? [])
      .filter((p) => p.course_id === c.id)
      .map((p) => ({ region: p.region, currency: p.currency, amount: Number(p.amount) })),
  }));
});

export type CourseRating = { count: number; average: number; distribution: Record<string, number> };
export type StudentVoice = {
  id: string;
  display_name: string;
  role_label: string | null;
  quote: string;
  course_title: string | null;
  is_featured?: boolean;
};

/** Only the "hook": everything paid lives behind course_content() for enrolled students. */
export type CourseTeaser = CourseSummary & {
  cover_image_url: string | null;
  intro: string | null;
  outcomes: string[];
  lesson_count: number;
  total_seconds: number;
  rubric_count: number;
  outline: { position: number; title: string | null; free_preview: boolean }[];
  rating: CourseRating;
  testimonials: StudentVoice[];
};

const emptyRating: CourseRating = { count: 0, average: 0, distribution: {} };

export const getCourse = createServerFn({ method: 'GET' })
  .inputValidator((data: { slug: string }) => data)
  .handler(async ({ data }): Promise<CourseTeaser | null> => {
    const db = publicDataClient() as any;
    const { data: teaser, error: teaserError } = await db.rpc('course_teaser', { _slug: data.slug });
    assertQuery(teaserError, 'course teaser');
    if (!teaser) return null;
    const [{ data: pricing, error: pricingError }, { data: rating }, { data: voices }] = await Promise.all([
      db.from('course_pricing').select('region, currency, amount').eq('course_id', teaser.id),
      db.rpc('course_rating_stats', { _course_id: teaser.id }),
      db.rpc('public_student_testimonials', { _limit: 4, _course_id: teaser.id }),
    ]);
    assertQuery(pricingError, 'course pricing');
    return {
      id: teaser.id,
      slug: teaser.slug,
      title: teaser.title,
      summary: teaser.summary,
      school: teaser.school,
      cover_image_url: teaser.cover_image_url ?? null,
      intro: teaser.intro ?? null,
      outcomes: Array.isArray(teaser.outcomes) ? teaser.outcomes : [],
      lesson_count: Number(teaser.lesson_count ?? 0),
      total_seconds: Number(teaser.total_seconds ?? 0),
      rubric_count: Number(teaser.rubric_count ?? 0),
      outline: Array.isArray(teaser.outline) ? teaser.outline : [],
      prices: ((pricing ?? []) as any[]).map((p) => ({
        region: p.region,
        currency: p.currency,
        amount: Number(p.amount),
      })),
      rating: (rating as CourseRating) ?? emptyRating,
      testimonials: (Array.isArray(voices) ? voices : []) as StudentVoice[],
    };
  });

export const listStudentVoices = createServerFn({ method: 'GET' }).handler(async (): Promise<StudentVoice[]> => {
  const db = publicDataClient() as any;
  const { data, error } = await db.rpc('public_student_testimonials', { _limit: 9, _course_id: null });
  assertQuery(error, 'student testimonials');
  return (Array.isArray(data) ? data : []) as StudentVoice[];
});

export const listPosts = createServerFn({ method: 'GET' }).handler(async () => {
  const db = publicDataClient();
  const { data, error } = await db
    .from('posts')
    .select('slug, title, excerpt, cover_image_url, author_name, published_at')
    .eq('is_published', true)
    .order('published_at', { ascending: false, nullsFirst: false });
  assertQuery(error, 'posts');
  return data ?? [];
});

export const getPost = createServerFn({ method: 'GET' })
  .inputValidator((data: { slug: string }) => data)
  .handler(async ({ data }) => {
    const db = publicDataClient();
    const { data: post, error } = await db
      .from('posts')
      .select('slug, title, excerpt, body, cover_image_url, author_name, published_at')
      .eq('slug', data.slug)
      .eq('is_published', true)
      .maybeSingle();
    assertQuery(error, 'post detail');
    return post ?? null;
  });

export const listCaseStudies = createServerFn({ method: 'GET' }).handler(async () => {
  const db = publicDataClient();
  const { data, error } = await db
    .from('case_studies')
    .select('slug, title, client_name, summary, challenge, approach, result, cover_image_url, category, live_url')
    .eq('is_published', true)
    .order('sort_order');
  assertQuery(error, 'case studies');
  return data ?? [];
});

export const getCaseStudy = createServerFn({ method: 'GET' })
  .inputValidator((data: { slug: string }) => data)
  .handler(async ({ data }) => {
    const db = publicDataClient();
    const { data: study, error } = await db
      .from('case_studies')
      .select('slug, title, client_name, summary, challenge, approach, result, cover_image_url, category, live_url')
      .eq('slug', data.slug)
      .eq('is_published', true)
      .maybeSingle();
    assertQuery(error, 'case study detail');
    return study ?? null;
  });

export const listTestimonials = createServerFn({ method: 'GET' }).handler(async () => {
  const db = publicDataClient();
  const { data, error } = await db
    .from('testimonials')
    .select('id, author_name, author_role, company, quote, badge, avatar_url, service_area')
    .eq('is_published', true)
    .order('sort_order');
  assertQuery(error, 'testimonials');
  return data ?? [];
});

export const submitEnquiry = createServerFn({ method: 'POST' })
  .inputValidator((data: {
    full_name: string;
    email: string;
    phone?: string;
    subject?: string;
    message: string;
    source?: string;
  }) => {
    if (!data.full_name?.trim() || !data.email?.includes('@') || !data.message?.trim()) {
      throw new Error('Please provide your name, a valid email and a message.');
    }
    return data;
  })
  .handler(async ({ data }) => {
    const db = publicDataClient('enquiry');
    const fullName = data.full_name.trim().slice(0, 200);
    const email = data.email.trim().slice(0, 200);
    const phone = data.phone?.trim().slice(0, 60) || null;
    const subject = data.subject?.trim().slice(0, 200) || null;
    const message = data.message.trim().slice(0, 5000);
    const source = data.source || 'contact';
    const { error } = await db.from('enquiries').insert({
      full_name: fullName,
      email,
      phone,
      subject,
      message,
      source,
    });
    if (error) throw new Error('We could not send your enquiry. Please try again or use WhatsApp.');

    const { sendTransactionalEmail, adminNotificationEmail, SITE_URL } = await import(
      '@/lib/email/transactional.server'
    );
    await Promise.all([
      sendTransactionalEmail({
        to: email,
        subject: 'We received your enquiry — Najeeb Digital Hub',
        label: 'enquiry_received',
        preview: 'Thanks for getting in touch. We reply within one business day.',
        heading: `Thanks, ${fullName.split(' ')[0]}`,
        intro: 'We have received your enquiry and will reply within one business day.',
        details: [
          ...(subject ? [{ label: 'Subject', value: subject }] : []),
          { label: 'Your message', value: message.slice(0, 800) },
        ],
        ctaLabel: 'Visit the website',
        ctaUrl: SITE_URL,
        footnote: 'If it is urgent, message us on WhatsApp at +234 902 993 2794.',
      }),
      sendTransactionalEmail({
        to: adminNotificationEmail(),
        replyTo: email,
        subject: `New enquiry from ${fullName}`,
        label: 'enquiry_alert',
        preview: `New ${source} enquiry from ${fullName}`,
        heading: 'New enquiry',
        intro: `A new enquiry arrived through the ${source} form.`,
        details: [
          { label: 'Name', value: fullName },
          { label: 'Email', value: email },
          ...(phone ? [{ label: 'Phone', value: phone }] : []),
          ...(subject ? [{ label: 'Subject', value: subject }] : []),
          { label: 'Message', value: message.slice(0, 2000) },
        ],
      }),
    ]);
    return { ok: true };
  });

