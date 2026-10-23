// @vitest-environment node
import { mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { adminClient, hasDb } from '@/test/db';
import { parsePaperRow, seedPapers } from './seed-papers';

const row = (overrides: Record<string, string> = {}): Record<string, string> => ({
  Conference: 'Vis',
  Year: '2024',
  Title: 'A Paper',
  DOI: '10.1109/example',
  Abstract: 'An abstract.',
  'AuthorNames-Deduped': 'Ada Lovelace;Alan Turing',
  AuthorKeywords: 'treemaps,hierarchies',
  CitationCount_CrossRef: '12',
  Award: '',
  ...overrides,
});

describe('parsePaperRow', () => {
  it('returns null for a row without a title', () => {
    expect(parsePaperRow(row({ Title: '' }))).toBeNull();
    expect(parsePaperRow(row({ Title: '   ' }))).toBeNull();
  });

  it('turns a non-numeric year into null', () => {
    expect(parsePaperRow(row({ Year: 'n/a' }))?.year).toBeNull();
  });

  it('maps the CSV columns to table columns', () => {
    expect(parsePaperRow(row())).toStrictEqual({
      conference: 'Vis',
      year: 2024,
      title: 'A Paper',
      doi: '10.1109/example',
      abstract: 'An abstract.',
      authors: 'Ada Lovelace;Alan Turing',
      keywords: 'treemaps,hierarchies',
      citation_count: 12,
      award: null,
    });
  });
});

describe.skipIf(!hasDb)('seedPapers against local Supabase', () => {
  const dois = ['10.0000/vpp-seed-test-1', '10.0000/vpp-seed-test-2'];
  let csvPath: string;

  const cleanUp = () => adminClient().from('papers').delete().in('doi', dois);

  beforeAll(async () => {
    await cleanUp();
    csvPath = join(mkdtempSync(join(tmpdir(), 'vpp-seed-')), 'two-papers.csv');
    writeFileSync(
      csvPath,
      [
        'Conference,Year,Title,DOI,Abstract,AuthorNames-Deduped,AuthorKeywords,CitationCount_CrossRef,Award',
        `Vis,2023,Seed Test One,${dois[0]},"First, with a comma.",Ada Lovelace,,3,`,
        `EuroVis,2022,Seed Test Two,${dois[1]},Second.,Alan Turing,,,BP`,
      ].join('\n')
    );
  });

  afterAll(async () => {
    await cleanUp();
  });

  it('upserts on doi, so seeding the same 2 rows twice leaves 2 rows', async () => {
    const client = adminClient();
    expect(await seedPapers(client, csvPath)).toStrictEqual({ inserted: 2, skipped: 0 });
    expect(await seedPapers(client, csvPath)).toStrictEqual({ inserted: 2, skipped: 0 });

    const { count, error } = await client
      .from('papers')
      .select('id', { count: 'exact', head: true })
      .in('doi', dois);
    expect(error).toBeNull();
    expect(count).toBe(2);
  });
});
