import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { fakeClient } from '@/test/fake-supabase';

vi.mock('@/lib/supabase', () => ({ getServerClient: vi.fn() }));
vi.mock('next/navigation', () => ({ useRouter: () => ({ push: vi.fn() }) }));

import { getServerClient } from '@/lib/supabase';
import Home from './page';

const renderHome = async (q?: string) =>
  render(await Home({ searchParams: Promise.resolve(q === undefined ? {} : { q }) }));

const treemapRow = {
  id: 1,
  title: 'TopoMap++: A Faster and More Space Efficient Technique',
  year: 2024,
  conference: 'Vis',
  doi: '10.1109/tvcg.2024.3456365',
  authors: 'Vitoria Guardieiro;Felipe Inagaki de Oliveira',
  abstract: 'A novel TreeMap-based representation.',
};

describe('Home page', () => {
  beforeEach(() => {
    vi.mocked(getServerClient).mockReset();
    vi.mocked(getServerClient).mockReturnValue(fakeClient().client);
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  it('shows the title, the search box and a prompt when there is no query', async () => {
    await renderHome();
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
    expect(screen.getByRole('searchbox', { name: /search papers/i })).toBeInTheDocument();
    expect(screen.getByText(/type a topic/i)).toBeInTheDocument();
    expect(getServerClient).not.toHaveBeenCalled();
  });

  it('lists matching papers with year, venue, authors and a doi link', async () => {
    vi.mocked(getServerClient).mockReturnValue(
      fakeClient({ data: [treemapRow], error: null }).client
    );
    await renderHome('treemap');
    const link = screen.getByRole('link', { name: treemapRow.title });
    expect(link).toHaveAttribute('href', `https://doi.org/${treemapRow.doi}`);
    expect(screen.getByText('2024 · Vis')).toBeInTheDocument();
    expect(screen.getByText(/Vitoria Guardieiro, Felipe Inagaki de Oliveira/)).toBeInTheDocument();
    expect(screen.getByRole('searchbox')).toHaveValue('treemap');
  });

  it('says so when no papers match', async () => {
    await renderHome('zzzz');
    expect(screen.getByText('No papers match “zzzz”.')).toBeInTheDocument();
  });

  it('shows the input error for an over-long query', async () => {
    await renderHome('a'.repeat(201));
    expect(screen.getByRole('alert')).toHaveTextContent(/200 characters/);
  });

  it('shows "Search is unavailable" when the database cannot be reached', async () => {
    vi.mocked(getServerClient).mockImplementation(() => {
      throw new Error('SUPABASE_URL and SUPABASE_ANON_KEY must be set');
    });
    await renderHome('treemap');
    expect(screen.getByRole('alert')).toHaveTextContent('Search is unavailable');
  });
});
