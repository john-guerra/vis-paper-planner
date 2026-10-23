// @vitest-environment node
import type { SupabaseClient } from '@supabase/supabase-js';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
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
  // A sentinel row with a DOI no real paper has. Its citation count beats every real
  // paper, so it ranks first under "most-cited first" whatever else is in the database.
  // The test touches only this row: it never deletes seeded data.
  const sentinel = {
    conference: 'Vis',
    year: 2024,
    title: 'Sentinel Treemap Paper for Search Tests',
    doi: '10.0000/vpp-search-test-treemap',
    abstract: 'A treemap layout used only by the integration tests.',
    authors: 'Test Author',
    keywords: 'treemaps',
    citation_count: 2_147_483_647, // Postgres int max
    award: null,
  };
  const removeSentinel = () => adminClient().from('papers').delete().eq('doi', sentinel.doi);

  beforeAll(async () => {
    const { error } = await adminClient().from('papers').upsert(sentinel, { onConflict: 'doi' });
    expect(error).toBeNull();
  });

  afterAll(async () => {
    const { error } = await removeSentinel();
    expect(error).toBeNull();
  });

  it('returns the treemap paper first, with year, conference and title', async () => {
    const results = await searchPapers(getServerClient(), 'treemap');
    expect(results[0]).toMatchObject({
      doi: sentinel.doi,
      year: sentinel.year,
      conference: sentinel.conference,
      title: sentinel.title,
    });
  });

  it('does not throw on unbalanced quotes and operators', async () => {
    await expect(searchPapers(getServerClient(), '"graph -tree')).resolves.toBeInstanceOf(Array);
  });
});
