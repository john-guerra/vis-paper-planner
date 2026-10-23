import { SearchInputError, searchPapers, type PaperSummary } from '@/lib/papers';
import { getServerClient } from '@/lib/supabase';
import SearchForm from './search-form';

type Outcome =
  | { kind: 'idle' }
  | { kind: 'results'; papers: PaperSummary[] }
  | { kind: 'invalid'; message: string }
  | { kind: 'unavailable' };

async function runSearch(q: string): Promise<Outcome> {
  if (!q.trim()) return { kind: 'idle' };
  try {
    return { kind: 'results', papers: await searchPapers(getServerClient(), q) };
  } catch (error) {
    if (error instanceof SearchInputError) return { kind: 'invalid', message: error.message };
    console.error('Search failed:', error instanceof Error ? error.message : error);
    return { kind: 'unavailable' };
  }
}

function PaperCard({ paper }: { paper: PaperSummary }) {
  const meta = [paper.year, paper.conference].filter(Boolean).join(' · ');
  return (
    <li className="bg-neutral p-sm text-label-md text-on-surface">
      <h3 className="text-body-md leading-snug font-semibold">
        {paper.doi ? (
          <a href={`https://doi.org/${paper.doi}`} className="text-primary underline">
            {paper.title}
          </a>
        ) : (
          paper.title
        )}
      </h3>
      <p className="mt-xs text-secondary">{meta}</p>
      {paper.authors && (
        <p className="mt-xs text-secondary italic">{paper.authors.split(';').join(', ')}</p>
      )}
      {paper.abstractSnippet && <p className="mt-sm leading-normal">{paper.abstractSnippet}</p>}
    </li>
  );
}

function Results({ q, outcome }: { q: string; outcome: Outcome }) {
  switch (outcome.kind) {
    case 'idle':
      return (
        <p className="text-secondary">
          Type a topic, such as <em>treemap</em>, to find related visualization papers.
        </p>
      );
    case 'invalid':
      return (
        <p role="alert" className="text-error">
          {outcome.message}
        </p>
      );
    case 'unavailable':
      return (
        <p role="alert" className="text-error">
          Search is unavailable
        </p>
      );
    case 'results':
      if (outcome.papers.length === 0) {
        return <p className="text-secondary">No papers match “{q}”.</p>;
      }
      return (
        <>
          <h2 className="text-headline-md font-semibold">
            {outcome.papers.length} {outcome.papers.length === 1 ? 'paper' : 'papers'} for “{q}”
          </h2>
          <ul
            aria-label="Search results"
            className="mt-md gap-md grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
          >
            {outcome.papers.map((paper) => (
              <PaperCard key={paper.id} paper={paper} />
            ))}
          </ul>
        </>
      );
  }
}

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ q?: string | string[] }>;
}) {
  const { q: raw } = await searchParams;
  const q = (Array.isArray(raw) ? raw[0] : raw) ?? '';
  const outcome = await runSearch(q);

  return (
    <>
      <nav className="bg-surface p-md text-on-surface">
        <span className="text-headline-md">VisPaperPlanner</span>
      </nav>
      <main className="px-md py-lg">
        <h1 className="text-headline-lg leading-tight font-bold">Find related work</h1>
        <p className="mt-sm mb-md max-w-3xl">
          Search IEEE VIS papers (VisPubData) by keyword in the title, abstract and author keywords.
          Most-cited papers come first.
        </p>
        <SearchForm initialQuery={q} />
        <section aria-live="polite" className="mt-lg">
          <Results q={q} outcome={outcome} />
        </section>
      </main>
    </>
  );
}
