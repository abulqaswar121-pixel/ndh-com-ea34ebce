import { createFileRoute, Link } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { ArrowLeft, FolderKanban } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { PageShell } from '@/components/PageShell';
import { Reveal } from '@/components/Reveal';
import { useAuth } from '@/lib/auth';
import { ProjectMessages, ProjectFiles, ProjectTasks } from '@/components/ProjectWorkspace';

export const Route = createFileRoute('/_authenticated/workspace/$id')({ component: Workspace });

function Workspace() {
  const { id } = Route.useParams();
  const { user, roles } = useAuth();
  const [project, setProject] = useState<any>();
  const [state, setState] = useState<'loading' | 'ready' | 'missing'>('loading');
  const canManage = roles.includes('pm') || roles.includes('admin');

  useEffect(() => {
    if (!user) return;
    (supabase as any)
      .from('projects')
      .select('*')
      .eq('id', id)
      .maybeSingle()
      .then(({ data }: any) => {
        setProject(data);
        setState(data ? 'ready' : 'missing');
      });
  }, [id, user]);

  return (
    <PageShell>
      <main className="portal">
        <div className="portal-head">
          <div>
            <p className="eyebrow">PROJECT WORKSPACE</p>
            <h1>{project?.title || (state === 'missing' ? 'Project not found' : 'Loading…')}</h1>
            <p>{project?.brief || 'Messages, files and tasks for this project.'}</p>
            <Link to={canManage ? '/portal/pm' : '/portal/client'} className="back-link">
              <ArrowLeft size={16} /> Back to your portal
            </Link>
          </div>
          <FolderKanban size={42} />
        </div>
        {state === 'missing' && (
          <div className="empty-card">This project is not available to your account.</div>
        )}
        {state === 'ready' && (
          <>
            <Reveal>
              <section className="portal-section">
                <ProjectMessages projectId={id} />
              </section>
            </Reveal>
            <Reveal>
              <section className="portal-section">
                <ProjectFiles projectId={id} />
              </section>
            </Reveal>
            <Reveal>
              <section className="portal-section">
                <ProjectTasks projectId={id} canManage={canManage} />
              </section>
            </Reveal>
          </>
        )}
      </main>
    </PageShell>
  );
}
