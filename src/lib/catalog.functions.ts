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

export type CourseDetail = CourseSummary & {
  learning_objectives: string | null;
  project_theme: string | null;
  cover_image_url: string | null;
  outline: { lesson_position: number; lesson_title: string; free_preview: boolean }[];
};

export const getCourse = createServerFn({ method: 'GET' })
  .inputValidator((data: { slug: string }) => data)
  .handler(async ({ data }): Promise<CourseDetail | null> => {
    const db = publicDataClient();
    const { data: course, error: courseError } = await db
      .from('courses')
      .select('id, slug, title, summary, school, learning_objectives, project_theme, cover_image_url')
      .eq('slug', data.slug)
      .eq('is_published', true)
      .maybeSingle();
    assertQuery(courseError, 'course detail');
    if (!course) return null;
    const [{ data: pricing, error: pricingError }, { data: outline, error: outlineError }] = await Promise.all([
      db.from('course_pricing').select('region, currency, amount').eq('course_id', course.id),
      db.rpc('course_outline', { _slug: data.slug }),
    ]);
    assertQuery(pricingError, 'course pricing');
    assertQuery(outlineError, 'course outline');
    return {
      ...course,
      prices: (pricing ?? []).map((p) => ({ region: p.region, currency: p.currency, amount: Number(p.amount) })),
      outline: (outline ?? []) as CourseDetail['outline'],
    };
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
    .select('slug, title, client_name, summary, challenge, approach, result, cover_image_url')
    .eq('is_published', true)
    .order('sort_order');
  assertQuery(error, 'case studies');
  return data ?? [];
});

export const listTestimonials = createServerFn({ method: 'GET' }).handler(async () => {
  const db = publicDataClient();
  const { data, error } = await db
    .from('testimonials')
    .select('id, author_name, author_role, company, quote')
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
    const { error } = await db.from('enquiries').insert({
      full_name: data.full_name.trim().slice(0, 200),
      email: data.email.trim().slice(0, 200),
      phone: data.phone?.trim().slice(0, 60) || null,
      subject: data.subject?.trim().slice(0, 200) || null,
      message: data.message.trim().slice(0, 5000),
      source: data.source || 'contact',
    });
    if (error) throw new Error('We could not send your enquiry. Please try again or use WhatsApp.');
    return { ok: true };
  });
