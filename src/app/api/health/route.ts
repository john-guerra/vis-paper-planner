import { getServerClient } from '@/lib/supabase';

/** GET /api/health — 200 when a trivial database query works, else 503. No details leak. */
export async function GET(): Promise<Response> {
  try {
    const { error } = await getServerClient().from('papers').select('id').limit(1);
    if (error) throw new Error(error.message);
    return Response.json({ status: 'ok' });
  } catch (error) {
    console.error('GET /api/health failed:', error instanceof Error ? error.message : error);
    return Response.json({ status: 'unavailable' }, { status: 503 });
  }
}
