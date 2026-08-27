const GATEWAY = 'https://ai.gateway.lovable.dev/v1/chat/completions';

export async function callAI(prompt: string): Promise<string> {
  const key = process.env['LOVABLE_API_KEY'];
  if (!key) throw new Error('AI provider is not configured');
  const r = await fetch(GATEWAY, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${key}` },
    body: JSON.stringify({
      model: 'google/gemini-3.7-flash',
      messages: [{ role: 'user', content: prompt }],
    }),
  });
  if (!r.ok) {
    const body = await r.text();
    console.error(`AI gateway failed [${r.status}]: ${body}`);
    throw new Error(`AI request failed [${r.status}]`);
  }
  const j = (await r.json()) as any;
  return j.choices?.[0]?.message?.content ?? '';
}

export function parseJson<T>(text: string, fallback: T): T {
  const cleaned = text.trim().replace(/^```(?:json)?/i, '').replace(/```$/, '').trim();
  try {
    return JSON.parse(cleaned) as T;
  } catch {
    return fallback;
  }
}

export async function requireEnrollment(context: any, courseId: string) {
  const { data } = await context.supabase
    .from('enrollments')
    .select('id')
    .eq('student_id', context.userId)
    .eq('course_id', courseId)
    .eq('status', 'active')
    .maybeSingle();
  if (!data) throw new Error('Enrollment required');
}
