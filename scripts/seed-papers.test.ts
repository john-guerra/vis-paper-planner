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
  // Sentinel DOIs no real paper has; the tests delete only these rows.
  const twoDois = ['10.0000/vpp-seed-test-1', '10.0000/vpp-seed-test-2'];
  const batchDoi = '10.0000/vpp-seed-test-3';
  const untitledDoi = '10.0000/vpp-seed-test-untitled';
  const header =
    'Conference,Year,Title,DOI,Abstract,AuthorNames-Deduped,AuthorKeywords,CitationCount_CrossRef,Award';
  let twoPapersCsv: string;
  let messyCsv: string;

  const cleanUp = () =>
    adminClient()
      .from('papers')
      .delete()
      .in('doi', [...twoDois, batchDoi, untitledDoi]);

  beforeAll(async () => {
    await cleanUp();
    const dir = mkdtempSync(join(tmpdir(), 'vpp-seed-'));
    twoPapersCsv = join(dir, 'two-papers.csv');
    writeFileSync(
      twoPapersCsv,
      [
        header,
        `Vis,2023,Seed Test One,${twoDois[0]},"First, with a comma.",Ada Lovelace,,3,`,
        `EuroVis,2022,Seed Test Two,${twoDois[1]},Second.,Alan Turing,,,BP`,
      ].join('\n')
    );
    // One batch with a repeated DOI and a row without a title.
    messyCsv = join(dir, 'messy-papers.csv');
    writeFileSync(
      messyCsv,
      [
        header,
        `Vis,2021,Seed Test Three,${batchDoi},Kept.,Ada Lovelace,,1,`,
        `Vis,2021,Seed Test Three Again,${batchDoi},Same DOI.,Ada Lovelace,,1,`,
        `Vis,2021,,${untitledDoi},No title.,Ada Lovelace,,1,`,
      ].join('\n')
    );
  });

  afterAll(async () => {
    const { error } = await cleanUp();
    expect(error).toBeNull();
  });

  it('upserts on doi, so seeding the same 2 rows twice leaves 2 rows', async () => {
    const client = adminClient();
    expect(await seedPapers(client, twoPapersCsv)).toStrictEqual({ inserted: 2, skipped: 0 });
    expect(await seedPapers(client, twoPapersCsv)).toStrictEqual({ inserted: 2, skipped: 0 });

    const { count, error } = await client
      .from('papers')
      .select('id', { count: 'exact', head: true })
      .in('doi', twoDois);
    expect(error).toBeNull();
    expect(count).toBe(2);
  });

  it('skips a duplicate DOI and an untitled row in one batch without throwing', async () => {
    const client = adminClient();
    await expect(seedPapers(client, messyCsv)).resolves.toStrictEqual({ inserted: 1, skipped: 2 });

    const { data, error } = await client
      .from('papers')
      .select('doi, title')
      .in('doi', [batchDoi, untitledDoi]);
    expect(error).toBeNull();
    // The first row for a DOI wins; the untitled row is not stored.
    expect(data).toStrictEqual([{ doi: batchDoi, title: 'Seed Test Three' }]);
  });
});
