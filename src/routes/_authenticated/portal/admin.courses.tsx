import { createFileRoute } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { BookOpen } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { PortalPage } from '@/components/PortalShell';

export const Route = createFileRoute('/_authenticated/portal/admin/courses')({
  component: CoursesAdmin,
});

type Rubric = { criterion: string; weight: number; standard: string };

function CoursesAdmin() {
  const [courses, setCourses] = useState<any[]>([]);
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [selected, setSelected] = useState<any>();
  const [lessons, setLessons] = useState<any[]>([]);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    void (supabase as any)
      .from('courses')
      .select('*')
      .order('title')
      .then(({ data }: any) => setCourses(data ?? []));
    void (supabase as any)
      .from('lessons')
      .select('course_id')
      .then(({ data }: any) => {
        const map: Record<string, number> = {};
        (data ?? []).forEach((l: any) => {
          map[l.course_id] = (map[l.course_id] ?? 0) + 1;
        });
        setCounts(map);
      });
  }, []);

  useEffect(() => {
    if (!selected) return setLessons([]);
    void (supabase as any)
      .from('lessons')
      .select('id,position,title,start_seconds,end_seconds,video_id,practice_task,is_free_preview')
      .eq('course_id', selected.id)
      .order('position')
      .then(({ data }: any) => setLessons(data ?? []));
  }, [selected?.id]);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (!selected) return;
    setSaved(false);
    const { data } = await (supabase as any)
      .from('courses')
      .update({
        title: selected.title,
        summary: selected.summary,
        overview: selected.overview,
        learning_objectives: selected.learning_objectives,
        preparation: selected.preparation,
        checklist: selected.checklist,
        common_mistakes: selected.common_mistakes,
        project_brief: selected.project_brief,
        project_theme: selected.project_theme,
        is_published: selected.is_published,
      })
      .eq('id', selected.id)
      .select('*')
      .single();
    if (data) {
      setCourses((x) => x.map((c) => (c.id === data.id ? data : c)));
      setSelected(data);
      setSaved(true);
    }
  }

  const rubric: Rubric[] = Array.isArray(selected?.rubric) ? selected.rubric : [];
  const weightTotal = rubric.reduce((sum, r) => sum + Number(r.weight || 0), 0);
  const incomplete = courses.filter((c) => !counts[c.id] || !c.project_brief);

  return (
    <PortalPage
      eyebrow="ADMIN PORTAL"
      title="Courses"
      intro="Review and edit the curriculum: lessons, preparation, project brief and grading."
      icon={BookOpen}
    >
      <section className="portal-section">
        <div className="portal-section-title">
          <h2>Curriculum health</h2>
          <span>
            {courses.length} courses · {Object.values(counts).reduce((a, b) => a + b, 0)} lessons
          </span>
        </div>
        {incomplete.length === 0 ? (
          <p className="form-success">Every course has lessons and a project brief.</p>
        ) : (
          <ul className="plain-list">
            {incomplete.map((c) => (
              <li key={c.id}>
                {c.title} — {!counts[c.id] ? 'no lessons' : 'no project brief'}
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="portal-section">
        <div className="editor">
          <select
            value={selected?.id || ''}
            onChange={(e) => setSelected(courses.find((c) => c.id === e.target.value))}
          >
            <option value="">Select a course</option>
            {courses.map((c) => (
              <option key={c.id} value={c.id}>
                {c.title} ({counts[c.id] ?? 0} lessons)
              </option>
            ))}
          </select>
          {selected && (
            <form className="auth-form" onSubmit={save}>
              <label>
                Title
                <input value={selected.title} onChange={(e) => setSelected({ ...selected, title: e.target.value })} />
              </label>
              <label>
                Summary
                <textarea
                  value={selected.summary || ''}
                  onChange={(e) => setSelected({ ...selected, summary: e.target.value })}
                />
              </label>
              <label>
                Course introduction
                <textarea
                  rows={5}
                  value={selected.overview || ''}
                  onChange={(e) => setSelected({ ...selected, overview: e.target.value })}
                />
              </label>
              <label>
                Learning objectives
                <textarea
                  rows={6}
                  value={selected.learning_objectives || ''}
                  onChange={(e) => setSelected({ ...selected, learning_objectives: e.target.value })}
                />
              </label>
              <label>
                Preparation
                <textarea
                  rows={4}
                  value={selected.preparation || ''}
                  onChange={(e) => setSelected({ ...selected, preparation: e.target.value })}
                />
              </label>
              <label>
                Reference checklist
                <textarea
                  rows={5}
                  value={selected.checklist || ''}
                  onChange={(e) => setSelected({ ...selected, checklist: e.target.value })}
                />
              </label>
              <label>
                Common mistakes
                <textarea
                  rows={5}
                  value={selected.common_mistakes || ''}
                  onChange={(e) => setSelected({ ...selected, common_mistakes: e.target.value })}
                />
              </label>
              <label>
                Final project brief
                <textarea
                  rows={8}
                  value={selected.project_brief || ''}
                  onChange={(e) => setSelected({ ...selected, project_brief: e.target.value })}
                />
              </label>
              <label className="checkbox-row">
                <input
                  type="checkbox"
                  checked={Boolean(selected.is_published)}
                  onChange={(e) => setSelected({ ...selected, is_published: e.target.checked })}
                />
                Published
              </label>
              <button className="button">Save course</button>
              {saved && <p className="form-success">Course changes saved.</p>}
            </form>
          )}
        </div>
      </section>

      {selected && (
        <section className="portal-section">
          <div className="portal-section-title">
            <h2>Grading rubric</h2>
            <span className={weightTotal === 100 ? '' : 'form-error'}>Total weight {weightTotal}%</span>
          </div>
          {rubric.length === 0 ? (
            <p>No rubric recorded for this course.</p>
          ) : (
            <ul className="rubric-list">
              {rubric.map((r) => (
                <li key={r.criterion}>
                  <strong>{r.criterion}</strong>
                  <em>{r.weight}%</em>
                  <span>{r.standard}</span>
                </li>
              ))}
            </ul>
          )}
        </section>
      )}

      {selected && (
        <section className="portal-section">
          <div className="portal-section-title">
            <h2>Lessons</h2>
            <span>{lessons.length} lessons</span>
          </div>
          <ol className="outline-list">
            {lessons.map((l) => (
              <li key={l.id}>
                <span>{String(l.position).padStart(2, '0')}</span>
                <strong>{l.title}</strong>
                <em>
                  {l.start_seconds ?? 0}s–{l.end_seconds ?? 'end'}
                  {l.is_free_preview ? ' · free preview' : ''}
                </em>
              </li>
            ))}
          </ol>
        </section>
      )}
    </PortalPage>
  );
}
