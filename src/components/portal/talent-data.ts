import { useCallback, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/lib/auth';

export function useTalentTasks() {
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

export function useTalentEarnings() {
  const { user } = useAuth();
  const [amounts, setAmounts] = useState({ pending: 0, available: 0, paid: 0 });
  const load = useCallback(async () => {
    if (!user) return;
    const { data } = await (supabase as any)
      .from('talent_earnings')
      .select('pending_amount,available_amount,paid_amount')
      .eq('talent_id', user.id)
      .maybeSingle();
    if (data)
      setAmounts({
        pending: Number(data.pending_amount),
        available: Number(data.available_amount),
        paid: Number(data.paid_amount),
      });
  }, [user]);
  useEffect(() => {
    void load();
  }, [load]);
  return { amounts, reload: load };
}
