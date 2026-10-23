// @vitest-environment node
import { readFileSync } from 'node:fs';
import { parse } from 'csv-parse/sync';
import type { SupabaseClient } from '@supabase/supabase-js';
import { beforeAll, describe, expect, it } from 'vitest';
import { parsePaperRow, type PaperInsert } from '../../scripts/seed-papers';
import { adminClient, hasDb } from '@/test/db';
import { fakeClient } from '@/test/fake-supabase';
import { getServerClient } from './supabase';
import { SearchInputError, searchPapers } from './papers';

const noClient = {} as SupabaseClient;

describe('searchPapers input validation', () => {
  it.each(['', '   '])('rejects the empty query %j', async (q) => {
    await expect(searchPapers(noClient, q)).rejects.toBeInstanceOf(SearchInputError);
  });

  it('rejects a query longer than 200 characters', async () => {
    await expect(searchPapers(noClient, 'a'.repeat(201))).rejects.toBeInstanceOf(SearchInputError);
  });
});

describe('searchPapers query and mapping', () => {
  it('runs an english websearch over the search column', async () => {
    const { client, calls } = fakeClient();
    await searchPapers(client, '  treemap  ', 5);
    expect(calls).toContainEqual([
      'textSearch',
      ['search', 'treemap', { type: 'websearch', config: 'english' }],
    ]);
    expect(calls).toContainEqual(['limit', [5]]);
  });

  it('maps rows to summaries and shortens long abstracts', async () => {
    const { client } = fakeClient({
      data: [
        {
          id: 7,
          title: 'Squarified Treemaps',
          year: 2000,
          conference: 'Vis',
          doi: '10.1/x',
          authors: 'Mark Bruls;Kees Huizing',
          abstract: 'word '.repeat(100).trim(),
        },
      ],
      error: null,
    });
    const [paper] = await searchPapers(client, 'treemap');
    expect(paper).toMatchObject({
      id: 7,
      title: 'Squarified Treemaps',
      year: 2000,
      conference: 'Vis',
    });
    expect(paper.abstractSnippet.length).toBeLessThanOrEqual(241);
    expect(paper.abstractSnippet.endsWith('…')).toBe(true);
  });

  it('throws when the database returns an error', async () => {
    const { client } = fakeClient({ data: null, error: { message: 'boom' } });
    await expect(searchPapers(client, 'treemap')).rejects.toThrow();
  });
});

describe.skipIf(!hasDb)('searchPapers against local Supabase', () => {
  let treemapPaper: PaperInsert;

  beforeAll(async () => {
    const rows = parse(readFileSync('data/fixture-papers.csv'), { columns: true }) as Record<
      string,
      string
    >[];
    const papers = rows.map(parsePaperRow).filter((p): p is PaperInsert => p !== null);
    const mentionsTreemap = (p: PaperInsert) => /treemap/i.test(`${p.title} ${p.abstract}`);
    treemapPaper = papers.find(mentionsTreemap)!;
    const others = papers.filter((p) => !mentionsTreemap(p)).slice(0, 2);

    // Keep exactly one treemap paper so "first" is well defined, then seed 3 fixture rows.
    const admin = adminClient();
    const removed = await admin
      .from('papers')
      .delete()
      .textSearch('search', 'treemap', { type: 'websearch', config: 'english' });
    expect(removed.error).toBeNull();
    const seeded = await admin
      .from('papers')
      .upsert([treemapPaper, ...others], { onConflict: 'doi' });
    expect(seeded.error).toBeNull();
  });

  it('returns the treemap paper first, with year, conference and title', async () => {
    const results = await searchPapers(getServerClient(), 'treemap');
    expect(results[0].doi).toBe(treemapPaper.doi);
    expect(results[0].year).toBe(treemapPaper.year);
    expect(results[0].conference).toBeTruthy();
    expect(results[0].title).toBeTruthy();
  });

  it('does not throw on unbalanced quotes and operators', async () => {
    await expect(searchPapers(getServerClient(), '"graph -tree')).resolves.toBeInstanceOf(Array);
  });
});
