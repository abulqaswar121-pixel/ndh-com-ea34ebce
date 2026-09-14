import { createServerFn } from '@tanstack/react-start';
import { z } from 'zod';
import { requireSupabaseAuth } from '@/integrations/supabase/auth-middleware';
import { callAI, parseJson, requireEnrollment } from './academy.server';

const QUIZ_PASS_MARK = 70;

/** Full paid course content. Returns null unless the caller is enrolled or an admin. */
export const getCourseContent = createServerFn({ method: 'POST' })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => z.object({ slug: z.string().min(1) }).parse(d))
  .handler(async ({ data, context }) => {
    const { data: content, error } = await (context.supabase as any).rpc('course_content', { _slug: data.slug });
    if (error) throw new Error(error.message);
    return (content ?? null) as Record<string, any> | null;
  });

export const generateProjectBrief = createServerFn({ method: 'POST' })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => z.object({ courseId: z.string().uuid(), theme: z.string().min(1) }).parse(d))
  .handler(async ({ data, context }) => {
    await requireEnrollment(context, data.courseId);
    await requireQuizPassed(context, data.courseId);
    const brief = await callAI(
      `Create a unique practical student project brief from this theme. Return plain text with goal, deliverables, constraints, and submission guidance. Theme: ${data.theme}`,
    );
    const { data: project, error } = await (context.supabase as any)
      .from('student_projects')
      .insert({ student_id: context.userId, course_id: data.courseId, brief })
      .select('*')
      .single();
    if (error) throw new Error(error.message);
    return project;
  });

export const reviewStudentProject = createServerFn({ method: 'POST' })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) =>
    z.object({ projectId: z.string().uuid(), brief: z.string(), submission: z.string() }).parse(d),
  )
  .handler(async ({ data, context }) => {
    const { data: project } = await (context.supabase as any)
      .from('student_projects')
      .select('id')
      .eq('id', data.projectId)
      .eq('student_id', context.userId)
      .maybeSingle();
    if (!project) throw new Error('Project not found');
    const raw = await callAI(
      `Review this student submission against the project brief. Reply with JSON only: {"verdict":"pass"|"revise","feedback":"..."}. Brief: ${data.brief}. Submission: ${data.submission}`,
    );
    const parsed = parseJson<{ verdict: string; feedback: string }>(raw, { verdict: 'revise', feedback: raw });
    const { data: updated, error } = await (context.supabase as any)
      .from('student_projects')
      .update({ ai_verdict: parsed.verdict, ai_feedback: parsed.feedback, status: 'submitted' })
      .eq('id', data.projectId)
      .eq('student_id', context.userId)
      .select('*')
      .single();
    if (error) throw new Error(error.message);
    return updated;
  });

/* ------------------------------------------------------------------ */
/* Pre-project readiness quiz                                          */
/* ------------------------------------------------------------------ */

type QuizQuestion = {
  id: string;
  type: 'multiple_choice' | 'short_answer';
  question: string;
  options?: string[];
  lesson?: string | null;
};

async function requireQuizPassed(context: any, courseId: string) {
  const { data } = await context.supabase
    .from('quiz_attempts')
    .select('id')
    .eq('student_id', context.userId)
    .eq('course_id', courseId)
    .eq('passed', true)
    .limit(1)
    .maybeSingle();
  if (!data) throw new Error('Pass the readiness quiz before starting your project.');
}

/** Blocks the quiz until every required lesson of the course is complete. */
async function requireLessonsComplete(context: any, courseId: string) {
  const { data: lessons } = await context.supabase
    .from('lessons')
    .select('id,is_required')
    .eq('course_id', courseId);
  const required = (lessons ?? []).filter((l: any) => l.is_required !== false);
  if (required.length === 0) return;
  const { data: progress } = await context.supabase
    .from('lesson_progress')
    .select('lesson_id')
    .eq('student_id', context.userId);
  const done = new Set((progress ?? []).map((p: any) => p.lesson_id));
  if (required.some((l: any) => !done.has(l.id))) {
    throw new Error('Finish every required lesson before taking the readiness quiz.');
  }
}

export const generateReadinessQuiz = createServerFn({ method: 'POST' })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => z.object({ courseId: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }) => {
    await requireEnrollment(context, data.courseId);
    await requireLessonsComplete(context, data.courseId);

    const { supabaseAdmin } = await import('@/integrations/supabase/client.server');
    const { data: course } = await (supabaseAdmin as any)
      .from('courses')
      .select('title,learning_objectives,overview')
      .eq('id', data.courseId)
      .maybeSingle();
    const { data: lessons } = await (supabaseAdmin as any)
      .from('lessons')
      .select('title,practice_task,knowledge_check,position')
      .eq('course_id', data.courseId)
      .order('position');

    const material = (lessons ?? [])
      .map(
        (l: any) =>
          `Lesson ${l.position}: ${l.title}${l.knowledge_check ? ` | check: ${l.knowledge_check}` : ''}${
            l.practice_task ? ` | task: ${l.practice_task}` : ''
          }`,
      )
      .join('\n');

    const prompt = `You are setting a readiness quiz for students who just finished the course "${course?.title ?? ''}".
Course objectives:
${course?.learning_objectives ?? ''}

Lesson material:
${material}

Reply with JSON only, no prose, in exactly this shape:
{"questions":[{"id":"q1","type":"multiple_choice","question":"...","options":["a","b","c","d"],"answer":"exact text of the correct option","lesson":"lesson title this comes from"},{"id":"q7","type":"short_answer","question":"...","answer":"model answer in one or two sentences","lesson":"lesson title"}]}
Produce exactly 6 multiple_choice questions (4 options each) and 2 short_answer questions, drawn only from the material above.`;

    let parsed = parseJson<{ questions: any[] }>(await callAI(prompt), { questions: [] });
    if (!Array.isArray(parsed.questions) || parsed.questions.length === 0) {
      parsed = parseJson<{ questions: any[] }>(await callAI(prompt), { questions: [] });
    }
    if (!Array.isArray(parsed.questions) || parsed.questions.length === 0) {
      throw new Error('The quiz service is unavailable right now. Please try again in a moment.');
    }

    const questions: QuizQuestion[] = parsed.questions.map((q: any, i: number) => ({
      id: q.id || `q${i + 1}`,
      type: q.type === 'short_answer' ? 'short_answer' : 'multiple_choice',
      question: String(q.question ?? ''),
      ...(Array.isArray(q.options) ? { options: q.options.map(String) } : {}),
      lesson: q.lesson ?? null,
    }));
    const answerKey = parsed.questions.map((q: any, i: number) => ({
      id: q.id || `q${i + 1}`,
      answer: String(q.answer ?? ''),
    }));

    const { data: attempt, error } = await (supabaseAdmin as any)
      .from('quiz_attempts')
      .insert({
        student_id: context.userId,
        course_id: data.courseId,
        questions,
        answer_key: answerKey,
      })
      .select('id,questions,created_at')
      .single();
    if (error) throw new Error(error.message);
    return attempt as { id: string; questions: QuizQuestion[]; created_at: string };
  });

export const submitReadinessQuiz = createServerFn({ method: 'POST' })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) =>
    z.object({ attemptId: z.string().uuid(), answers: z.record(z.string()) }).parse(d),
  )
  .handler(async ({ data, context }) => {
    const { supabaseAdmin } = await import('@/integrations/supabase/client.server');
    const { data: attempt } = await (supabaseAdmin as any)
      .from('quiz_attempts')
      .select('id,student_id,course_id,questions,answer_key,submitted_at')
      .eq('id', data.attemptId)
      .maybeSingle();
    if (!attempt || attempt.student_id !== context.userId) throw new Error('Quiz attempt not found');
    if (attempt.submitted_at) throw new Error('This attempt has already been submitted.');

    const key: Record<string, string> = {};
    (attempt.answer_key ?? []).forEach((k: any) => {
      key[k.id] = String(k.answer ?? '');
    });
    const questions: QuizQuestion[] = attempt.questions ?? [];
    const feedback: { id: string; question: string; correct: boolean; note: string; lesson: string | null }[] = [];
    let earned = 0;

    const shortAnswers = questions.filter((q) => q.type === 'short_answer');
    let graded: Record<string, { correct: boolean; note: string }> = {};
    if (shortAnswers.length > 0) {
      const raw = await callAI(
        `Grade these short answers. Reply with JSON only: {"results":[{"id":"q7","correct":true,"note":"one short coaching line"}]}.
${shortAnswers
  .map((q) => `id ${q.id} | question: ${q.question} | model answer: ${key[q.id] ?? ''} | student answer: ${data.answers[q.id] ?? ''}`)
  .join('\n')}`,
      );
      const parsed = parseJson<{ results: any[] }>(raw, { results: [] });
      (parsed.results ?? []).forEach((r: any) => {
        graded[String(r.id)] = { correct: Boolean(r.correct), note: String(r.note ?? '') };
      });
    }

    for (const q of questions) {
      const given = (data.answers[q.id] ?? '').trim();
      if (q.type === 'multiple_choice') {
        const correct = given.toLowerCase() === (key[q.id] ?? '').trim().toLowerCase();
        if (correct) earned += 1;
        feedback.push({
          id: q.id,
          question: q.question,
          correct,
          note: correct ? 'Correct.' : `Correct answer: ${key[q.id] ?? ''}`,
          lesson: q.lesson ?? null,
        });
      } else {
        const result = graded[q.id] ?? { correct: false, note: 'We could not grade this answer automatically.' };
        if (result.correct) earned += 1;
        feedback.push({
          id: q.id,
          question: q.question,
          correct: result.correct,
          note: result.note,
          lesson: q.lesson ?? null,
        });
      }
    }

    const score = questions.length ? Math.round((earned / questions.length) * 100) : 0;
    const passed = score >= QUIZ_PASS_MARK;

    const { error } = await (supabaseAdmin as any)
      .from('quiz_attempts')
      .update({ answers: data.answers, feedback, score, passed, submitted_at: new Date().toISOString() })
      .eq('id', attempt.id);
    if (error) throw new Error(error.message);
    return { score, passed, feedback, pass_mark: QUIZ_PASS_MARK };
  });

/* ------------------------------------------------------------------ */
/* Ratings and testimonials                                            */
/* ------------------------------------------------------------------ */

export const rateCourse = createServerFn({ method: 'POST' })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) =>
    z
      .object({
        courseId: z.string().uuid(),
        stars: z.number().int().min(1).max(5),
        review: z.string().max(2000).optional(),
      })
      .parse(d),
  )
  .handler(async ({ data, context }) => {
    const { data: saved, error } = await (context.supabase as any)
      .from('course_ratings')
      .upsert(
        {
          student_id: context.userId,
          course_id: data.courseId,
          stars: data.stars,
          review: data.review ?? null,
        },
        { onConflict: 'student_id,course_id' },
      )
      .select('id,stars,review')
      .single();
    if (error) throw new Error('You can rate a course once you have completed it.');
    return saved;
  });

export const submitStudentTestimonial = createServerFn({ method: 'POST' })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) =>
    z
      .object({
        courseId: z.string().uuid(),
        displayName: z.string().min(2).max(120),
        roleLabel: z.string().max(120).optional(),
        quote: z.string().min(20).max(1200),
        consent: z.literal(true),
      })
      .parse(d),
  )
  .handler(async ({ data, context }) => {
    const { error } = await (context.supabase as any).from('student_testimonials').insert({
      student_id: context.userId,
      course_id: data.courseId,
      display_name: data.displayName,
      role_label: data.roleLabel ?? null,
      quote: data.quote,
      consent: true,
      status: 'pending',
    });
    if (error) throw new Error('You can share a testimonial once you have completed the course.');
    return { ok: true };
  });
