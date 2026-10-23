import { MAX_LIMIT, SearchInputError, searchPapers, validateQuery } from '@/lib/papers';
import { getServerClient } from '@/lib/supabase';

const UNAVAILABLE = { error: 'Search is unavailable' } as const;

function parseLimit(value: string | null): number {
  if (value === null || value === '') return 20;
  const limit = Number(value);
  if (!Number.isInteger(limit) || limit < 1 || limit > MAX_LIMIT) {
    throw new SearchInputError(`limit must be a whole number from 1 to ${MAX_LIMIT}`);
  }
  return limit;
}

/** GET /api/papers?q=&limit= — keyword search. Contract: docs/api/openapi.yaml. */
export async function GET(request: Request): Promise<Response> {
  const params = new URL(request.url).searchParams;
  try {
    // Validate before touching the database so bad input is always a 400.
    const q = validateQuery(params.get('q') ?? '');
    const limit = parseLimit(params.get('limit'));
    const results = await searchPapers(getServerClient(), q, limit);
    return Response.json({ results });
  } catch (error) {
    if (error instanceof SearchInputError) {
      return Response.json({ error: error.message }, { status: 400 });
    }
    // Log the cause on the server only; the client gets a fixed message, no stack or config.
    console.error('GET /api/papers failed:', error instanceof Error ? error.message : error);
    return Response.json(UNAVAILABLE, { status: 500 });
  }
}
