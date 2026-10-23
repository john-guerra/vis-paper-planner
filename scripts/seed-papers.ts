/**
 * Loads papers from a VisPubData CSV into the local Supabase `papers` table.
 *
 *   npm run db:seed                                   # data/fixture-papers.csv (200 rows)
 *   npm run db:seed -- data/vispubdata-1990-2024.csv  # the full dataset
 *
 * Needs SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY (read from .env.local when present).
 * The service-role key bypasses RLS, so it is only ever used here, never in app code.
 */
import { readFile } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { parse } from 'csv-parse/sync';

export type PaperInsert = {
  conference: string;
  year: number | null;
  title: string;
  doi: string;
  abstract: string | null;
  authors: string | null;
  keywords: string | null;
  citation_count: number | null;
  award: string | null;
};

const BATCH_SIZE = 500;

const text = (value: string | undefined): string | null => {
  const trimmed = (value ?? '').trim();
  return trimmed === '' ? null : trimmed;
};

const integer = (value: string | undefined): number | null => {
  const t = text(value);
  if (t === null || !/^-?\d+$/.test(t)) return null;
  return Number(t);
};

/**
 * Maps one CSV row to a table row. Returns null when the row cannot be stored:
 * no title, no conference, or no DOI (the DOI is the upsert key, so a row
 * without one would be duplicated on every re-seed).
 */
export function parsePaperRow(row: Record<string, string>): PaperInsert | null {
  const title = text(row.Title);
  const conference = text(row.Conference);
  const doi = text(row.DOI);
  if (!title || !conference || !doi) return null;
  return {
    conference,
    year: integer(row.Year),
    title,
    doi,
    abstract: text(row.Abstract),
    authors: text(row['AuthorNames-Deduped']),
    keywords: text(row.AuthorKeywords),
    citation_count: integer(row.CitationCount_CrossRef),
    award: text(row.Award),
  };
}

/** Upserts every valid row on `doi`, in batches, so seeding twice is safe. */
export async function seedPapers(
  client: SupabaseClient,
  csvPath: string
): Promise<{ inserted: number; skipped: number }> {
  const rows = parse(await readFile(csvPath), {
    columns: true,
    skip_empty_lines: true,
    bom: true,
  }) as Record<string, string>[];

  // One row per DOI: Postgres rejects an upsert batch that touches the same key twice.
  const byDoi = new Map<string, PaperInsert>();
  let skipped = 0;
  for (const row of rows) {
    const paper = parsePaperRow(row);
    if (paper && !byDoi.has(paper.doi)) byDoi.set(paper.doi, paper);
    else skipped += 1;
  }

  const papers = [...byDoi.values()];
  for (let start = 0; start < papers.length; start += BATCH_SIZE) {
    const batch = papers.slice(start, start + BATCH_SIZE);
    const { error } = await client.from('papers').upsert(batch, { onConflict: 'doi' });
    if (error) throw new Error(`Seeding failed at row ${start}: ${error.message}`);
  }
  return { inserted: papers.length, skipped };
}

async function main() {
  const url = process.env.SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) {
    throw new Error('Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY (see .env.example)');
  }
  const client = createClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const result = await seedPapers(client, process.argv[2] ?? 'data/fixture-papers.csv');
  console.log(result);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((error: unknown) => {
    console.error(error instanceof Error ? error.message : error);
    process.exit(1);
  });
}
