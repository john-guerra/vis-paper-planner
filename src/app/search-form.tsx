'use client';

import { useRouter } from 'next/navigation';
import { useTransition, type FormEvent } from 'react';

/** Search box that navigates to /?q=…; the page (a server component) runs the search. */
export default function SearchForm({ initialQuery }: { initialQuery: string }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const q = String(new FormData(event.currentTarget).get('q') ?? '').trim();
    startTransition(() => router.push(q ? `/?q=${encodeURIComponent(q)}` : '/'));
  }

  return (
    // action/method keep the form working before JavaScript loads.
    <form role="search" action="/" method="get" onSubmit={onSubmit} className="gap-sm flex">
      <label htmlFor="q" className="sr-only">
        Search papers
      </label>
      <input
        id="q"
        name="q"
        type="search"
        defaultValue={initialQuery}
        maxLength={200}
        placeholder="e.g. treemap, uncertainty, graph layout"
        className="border-secondary px-sm py-xs text-on-surface focus:outline-primary w-full max-w-2xl rounded-sm border focus:outline-2"
      />
      <button
        type="submit"
        disabled={pending}
        className="border-primary bg-neutral px-md py-xs text-primary hover:bg-primary hover:text-neutral rounded-sm border disabled:opacity-60"
      >
        {pending ? 'Searching…' : 'Search'}
      </button>
    </form>
  );
}
