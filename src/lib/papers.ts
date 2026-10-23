import type { SupabaseClient } from '@supabase/supabase-js';

export type PaperSummary = {
  id: number;
  title: string;
  year: number | null;
  conference: string;
  doi: string | null;
  authors: string;
  abstractSnippet: string;
};

export const MAX_QUERY_LENGTH = 200;
export const MAX_LIMIT = 50;
const SNIPPET_LENGTH = 240;

/** The user's input is unusable; safe to show its message. */
export class SearchInputError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'SearchInputError';
  }
}

/** Trims the query and rejects empty or over-long input. */
export function validateQuery(q: string): string {
  const query = q.trim();
  if (!query) throw new SearchInputError('Enter a search term');
  if (query.length > MAX_QUERY_LENGTH) {
    throw new SearchInputError(`Search terms must be ${MAX_QUERY_LENGTH} characters or fewer`);
  }
  return query;
}

type PaperRow = {
  id: number;
  title: string;
  year: number | null;
  conference: string;
  doi: string | null;
  authors: string | null;
  abstract: string | null;
};

function snippet(text: string | null): string {
  const clean = (text ?? '').replace(/\s+/g, ' ').trim();
  if (clean.length <= SNIPPET_LENGTH) return clean;
  const cut = clean.slice(0, SNIPPET_LENGTH);
  const lastSpace = cut.lastIndexOf(' ');
  return `${(lastSpace > 0 ? cut.slice(0, lastSpace) : cut).trimEnd()}…`;
}

/**
 * Keyword search over title, abstract and keywords (Postgres full-text search,
 * websearch syntax, english stemming). Most-cited matches come first.
 */
export async function searchPapers(
  client: SupabaseClient,
  q: string,
  limit = 20
): Promise<PaperSummary[]> {
  const query = validateQuery(q);
  const { data, error } = await client
    .from('papers')
    .select('id, title, year, conference, doi, authors, abstract')
    .textSearch('search', query, { type: 'websearch', config: 'english' })
    .order('citation_count', { ascending: false, nullsFirst: false })
    .order('id')
    .limit(Math.min(Math.max(1, Math.trunc(limit)), MAX_LIMIT));
  if (error) throw new Error(`Paper search failed: ${error.message}`);

  return (data as PaperRow[]).map((row) => ({
    id: row.id,
    title: row.title,
    year: row.year,
    conference: row.conference,
    doi: row.doi,
    authors: row.authors ?? '',
    abstractSnippet: snippet(row.abstract),
  }));
}
