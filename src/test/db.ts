import { createClient, type SupabaseClient } from '@supabase/supabase-js';

/**
 * Integration tests run only when a local Supabase is configured
 * (`npx supabase start`, then copy its URL and keys into `.env.local`).
 * The CI unit job has no database, so these tests are skipped there;
 * the CI e2e job starts Supabase and runs them.
 */
export const hasDb = Boolean(
  process.env.SUPABASE_URL && process.env.SUPABASE_ANON_KEY && process.env.SUPABASE_SERVICE_ROLE_KEY
);

/** Service-role client for test setup only (RLS lets the anon key read, never write). */
export function adminClient(): SupabaseClient {
  return createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
