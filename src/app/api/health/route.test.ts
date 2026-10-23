// @vitest-environment node
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { fakeClient } from '@/test/fake-supabase';

vi.mock('@/lib/supabase', () => ({ getServerClient: vi.fn() }));

import { getServerClient } from '@/lib/supabase';
import { GET } from './route';

describe('GET /api/health', () => {
  beforeEach(() => {
    vi.mocked(getServerClient).mockReset();
    vi.mocked(getServerClient).mockReturnValue(fakeClient().client);
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  it('returns 200 { status: "ok" } when a trivial query succeeds', async () => {
    const response = await GET();
    expect(response.status).toBe(200);
    expect(await response.json()).toStrictEqual({ status: 'ok' });
  });

  it('returns 503 { status: "unavailable" } when the query fails', async () => {
    vi.mocked(getServerClient).mockReturnValue(
      fakeClient({ data: null, error: { message: 'connection refused' } }).client
    );
    const response = await GET();
    expect(response.status).toBe(503);
    expect(await response.json()).toStrictEqual({ status: 'unavailable' });
  });

  it('returns 503 with no key or stack when the client cannot be created', async () => {
    vi.mocked(getServerClient).mockImplementation(() => {
      throw new Error('SUPABASE_ANON_KEY=fake-key-123 is invalid');
    });
    const response = await GET();
    expect(response.status).toBe(503);
    const text = await response.text();
    expect(JSON.parse(text)).toStrictEqual({ status: 'unavailable' });
    expect(text).not.toContain('fake-key-123');
    expect(text).not.toContain('stack');
  });
});
