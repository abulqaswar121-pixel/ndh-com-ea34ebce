import { createServerFn } from '@tanstack/react-start';
import { z } from 'zod';
import { requireSupabaseAuth } from '@/integrations/supabase/auth-middleware';
import { callAI, parseJson, requireEnrollment } from './academy.server';

export const generateProjectBrief = createServerFn({ method: 'POST' })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => z.object({ courseId: z.string().uuid(), theme: z.string().min(1) }).parse(d))
  .handler(async ({ data, context }) => {
    await requireEnrollment(context, data.courseId);
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

export const generateExam = createServerFn({ method: 'POST' })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => z.object({ courseId: z.string().uuid(), objectives: z.string() }).parse(d))
  .handler(async ({ data, context }) => {
    await requireEnrollment(context, data.courseId);
    const raw = await callAI(
      `Reply with JSON only, keys multiple_choice, short_answer, essay. Create exactly 5 multiple choice (each with question, options array and answer), 3 short answer and 1 essay question from: ${data.objectives}`,
    );
    const questions = parseJson<any>(raw, { multiple_choice: [], short_answer: [], essay: [] });
    const { data: attempt, error } = await (context.supabase as any)
      .from('exam_attempts')
      .insert({ student_id: context.userId, course_id: data.courseId, questions, answers: {} })
      .select('id,questions,started_at')
      .single();
    if (error) throw new Error(error.message);
    return attempt;
  });

export const submitExam = createServerFn({ method: 'POST' })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => z.object({ attemptId: z.string().uuid(), answers: z.record(z.any()) }).parse(d))
  .handler(async ({ data, context }) => {
    const { data: attempt } = await (context.supabase as any)
      .from('exam_attempts')
      .select('*')
      .eq('id', data.attemptId)
      .eq('student_id', context.userId)
      .maybeSingle();
    if (!attempt) throw new Error('Exam attempt not found');

    const raw = await callAI(
      `You are grading an exam. Reply with JSON only: {"score":<0-100 number>,"passed":<true|false>,"feedback":"short summary"}. Pass mark is 60. Questions: ${JSON.stringify(attempt.questions)}. Student answers: ${JSON.stringify(data.answers)}`,
    );
    const graded = parseJson<{ score: number; passed: boolean; feedback?: string }>(raw, {
      score: 0,
      passed: false,
      feedback: 'Automatic grading was unavailable. A reviewer will grade this attempt.',
    });
    const score = Math.max(0, Math.min(100, Number(graded.score) || 0));

    const { data: updated, error } = await (context.supabase as any)
      .from('exam_attempts')
      .update({
        answers: data.answers,
        submitted_at: new Date().toISOString(),
        score,
        passed: score >= 60,
      })
      .eq('id', data.attemptId)
      .eq('student_id', context.userId)
      .select('score,passed,submitted_at')
      .single();
    if (error) throw new Error(error.message);
    return { ...updated, feedback: graded.feedback ?? null };
  });
