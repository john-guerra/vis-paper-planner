// @vitest-environment node
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { fakeClient } from '@/test/fake-supabase';

vi.mock('@/lib/supabase', () => ({ getServerClient: vi.fn() }));

import { getServerClient } from '@/lib/supabase';
import { GET } from './route';

const get = (query: string) => GET(new Request(`http://localhost/api/papers${query}`));

describe('GET /api/papers', () => {
  beforeEach(() => {
    vi.mocked(getServerClient).mockReset();
    vi.mocked(getServerClient).mockReturnValue(fakeClient().client);
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  it('returns 400 when q is missing', async () => {
    const response = await get('');
    expect(response.status).toBe(400);
    expect(typeof (await response.json()).error).toBe('string');
  });

  it('returns 400 when q is longer than 200 characters', async () => {
    const response = await get(`?q=${'a'.repeat(201)}`);
    expect(response.status).toBe(400);
    expect(typeof (await response.json()).error).toBe('string');
  });

  it('returns 400 when limit is not a whole number from 1 to 50', async () => {
    const response = await get('?q=treemap&limit=abc');
    expect(response.status).toBe(400);
  });

  it('returns 200 with a results array for a valid q', async () => {
    const response = await get('?q=treemap&limit=5');
    expect(response.status).toBe(200);
    expect(Array.isArray((await response.json()).results)).toBe(true);
  });

  it('returns exactly the generic 500 body when the client cannot be created', async () => {
    vi.mocked(getServerClient).mockImplementation(() => {
      throw new Error('SUPABASE_ANON_KEY=fake-key-123 is invalid');
    });
    const response = await get('?q=treemap');
    expect(response.status).toBe(500);
    const text = await response.text();
    expect(JSON.parse(text)).toStrictEqual({ error: 'Search is unavailable' });
    expect(text).not.toContain('stack');
    expect(text).not.toContain('fake-key-123');
  });

  it('returns the generic 500 body when the query fails', async () => {
    vi.mocked(getServerClient).mockReturnValue(
      fakeClient({ data: null, error: { message: 'relation does not exist' } }).client
    );
    const response = await get('?q=treemap');
    expect(response.status).toBe(500);
    expect(await response.json()).toStrictEqual({ error: 'Search is unavailable' });
  });
});
