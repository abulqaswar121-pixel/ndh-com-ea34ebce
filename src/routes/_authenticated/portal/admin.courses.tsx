import { createFileRoute } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { BookOpen } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { PortalPage } from '@/components/PortalShell';

export const Route = createFileRoute('/_authenticated/portal/admin/courses')({
  component: CoursesAdmin,
});

function CoursesAdmin() {
  const [courses, setCourses] = useState<any[]>([]);
  const [selected, setSelected] = useState<any>();
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    void (supabase as any)
      .from('courses')
      .select('*')
      .order('title')
      .then(({ data }: any) => setCourses(data ?? []));
  }, []);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (!selected) return;
    const { data } = await (supabase as any)
      .from('courses')
      .update({
        title: selected.title,
        summary: selected.summary,
        learning_objectives: selected.learning_objectives,
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

  return (
    <PortalPage
      eyebrow="ADMIN PORTAL"
      title="Courses"
      intro="Edit course titles, summaries, objectives and publishing."
      icon={BookOpen}
    >
      <section className="portal-section">
        <div className="editor">
          <select
            value={selected?.id || ''}
            onChange={(e) => setSelected(courses.find((c) => c.id === e.target.value))}
          >
            <option value="">Select a course</option>
            {courses.map((c) => (
              <option key={c.id} value={c.id}>
                {c.title}
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
                Learning objectives
                <textarea
                  value={selected.learning_objectives || ''}
                  onChange={(e) => setSelected({ ...selected, learning_objectives: e.target.value })}
                />
              </label>
              <label>
                Project theme
                <textarea
                  value={selected.project_theme || ''}
                  onChange={(e) => setSelected({ ...selected, project_theme: e.target.value })}
                />
              </label>
              <button className="button">Save course</button>
              {saved && <p className="form-success">Course changes saved.</p>}
            </form>
          )}
        </div>
      </section>
    </PortalPage>
  );
}
