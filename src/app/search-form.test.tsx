import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

const push = vi.fn();
vi.mock('next/navigation', () => ({ useRouter: () => ({ push }) }));

import SearchForm from './search-form';

describe('SearchForm', () => {
  beforeEach(() => push.mockReset());

  it('navigates to /?q= with the trimmed query', async () => {
    render(<SearchForm initialQuery="" />);
    await userEvent.type(screen.getByRole('searchbox', { name: /search papers/i }), '  tree map ');
    await userEvent.click(screen.getByRole('button', { name: /search/i }));
    expect(push).toHaveBeenCalledWith('/?q=tree%20map');
  });

  it('goes back to / on an empty submit', async () => {
    render(<SearchForm initialQuery="treemap" />);
    await userEvent.clear(screen.getByRole('searchbox'));
    await userEvent.click(screen.getByRole('button', { name: /search/i }));
    expect(push).toHaveBeenCalledWith('/');
  });
});
