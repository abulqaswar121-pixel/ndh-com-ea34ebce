import { createServerFn } from '@tanstack/react-start';
import { z } from 'zod';
import { createClient } from '@supabase/supabase-js';

export const verifyCertificate = createServerFn({ method: 'GET' })
  .inputValidator((d: unknown) => z.object({ code: z.string().trim().min(4).max(64) }).parse(d))
  .handler(async ({ data }) => {
    const supabase = createClient(
      process.env['SUPABASE_URL']!,
      process.env['SUPABASE_PUBLISHABLE_KEY']!,
      { auth: { storage: undefined, persistSession: false, autoRefreshToken: false } },
    );
    const { data: result, error } = await supabase.rpc('verify_certificate', {
      _code: data.code,
    });
    if (error) throw new Error(error.message);
    return { certificate: result ?? null };
  });
