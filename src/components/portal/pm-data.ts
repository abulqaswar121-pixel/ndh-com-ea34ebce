import { useCallback, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/lib/auth';

export function usePmProjects() {
  const { user } = useAuth();
  const [projects, setProjects] = useState<any[]>([]);
  const load = useCallback(async () => {
    if (!user) return;
    const { data } = await supabase
      .from('projects')
      .select('*')
      .eq('pm_id', user.id)
      .order('created_at', { ascending: false });
    setProjects(data ?? []);
  }, [user]);
  useEffect(() => {
    void load();
  }, [load]);
  return { projects, reload: load };
}

export function useOpenBriefs() {
  const { user } = useAuth();
  const [briefs, setBriefs] = useState<any[]>([]);
  const load = useCallback(async () => {
    const { data } = await (supabase as any)
      .from('projects')
      .select('*')
      .is('pm_id', null)
      .order('created_at', { ascending: false });
    setBriefs(data ?? []);
  }, []);
  useEffect(() => {
    void load();
  }, [load]);
  const claim = useCallback(
    async (projectId: string) => {
      if (!user) return;
      await (supabase as any).from('projects').update({ pm_id: user.id, status: 'active' }).eq('id', projectId);
      await load();
    },
    [user, load],
  );
  return { briefs, claim, reload: load };
}

export function useMyTasks() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<any[]>([]);
  useEffect(() => {
    if (!user) return;
    void supabase
      .from('tasks')
      .select('*')
      .eq('assignee_id', user.id)
      .order('due_date')
      .then(({ data }) => setTasks(data ?? []));
  }, [user]);
  return tasks;
}
