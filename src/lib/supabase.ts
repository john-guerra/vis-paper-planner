import { createClient, type SupabaseClient } from '@supabase/supabase-js';

/**
 * A Supabase client for server code (route handlers, server components).
 * Uses the anon key, so row-level security applies: papers are read-only.
 */
export function getServerClient(): SupabaseClient {
  const url = process.env.SUPABASE_URL;
  const anonKey = process.env.SUPABASE_ANON_KEY;
  if (!url || !anonKey) {
    throw new Error('SUPABASE_URL and SUPABASE_ANON_KEY must be set');
  }
  return createClient(url, anonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
