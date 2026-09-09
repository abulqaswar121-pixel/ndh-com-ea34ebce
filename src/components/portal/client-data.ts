import { useCallback, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/lib/auth';

export function useClientProjects() {
  const { user } = useAuth();
  const [projects, setProjects] = useState<any[]>([]);
  const load = useCallback(async () => {
    if (!user) return;
    const { data } = await supabase
      .from('projects')
      .select('*')
      .eq('client_id', user.id)
      .order('created_at', { ascending: false });
    setProjects(data ?? []);
  }, [user]);
  useEffect(() => {
    void load();
  }, [load]);
  return { projects, reload: load };
}

export function useClientInvoices() {
  const { user } = useAuth();
  const [invoices, setInvoices] = useState<any[]>([]);
  const [escrow, setEscrow] = useState<any[]>([]);
  useEffect(() => {
    if (!user) return;
    void (async () => {
      const { data: invoiceRows } = await supabase.from('invoices').select('*').eq('client_id', user.id);
      setInvoices(invoiceRows ?? []);
      const ids = (invoiceRows ?? []).map((i: any) => i.id);
      if (ids.length) {
        const { data: escrowRows } = await (supabase as any)
          .from('escrow_status')
          .select('*')
          .in('invoice_id', ids);
        setEscrow(escrowRows ?? []);
      } else {
        setEscrow([]);
      }
    })();
  }, [user]);
  return { invoices, escrow };
}
