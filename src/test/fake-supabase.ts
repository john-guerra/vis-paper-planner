import type { SupabaseClient } from '@supabase/supabase-js';

type Result = { data: unknown[] | null; error: { message: string } | null };

/**
 * A stand-in for the supabase-js query builder, for unit tests that must not
 * need a database. Every builder call is recorded in `calls`.
 */
export function fakeClient(result: Result = { data: [], error: null }) {
  const calls: Array<[string, unknown[]]> = [];
  const builder: Record<string, unknown> = {};
  for (const method of ['from', 'select', 'textSearch', 'order', 'limit']) {
    builder[method] = (...args: unknown[]) => {
      calls.push([method, args]);
      return builder;
    };
  }
  builder.then = (resolve: (r: Result) => unknown, reject: (e: unknown) => unknown) =>
    Promise.resolve(result).then(resolve, reject);
  return { client: builder as unknown as SupabaseClient, calls };
}
