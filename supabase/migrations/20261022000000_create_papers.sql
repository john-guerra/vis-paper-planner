-- Papers from the VisPubData CSV, searchable with Postgres full-text search (ADR 0001).
create table public.papers (
  id bigint generated always as identity primary key,
  conference text not null,
  year int,
  title text not null,
  doi text unique,
  abstract text,
  authors text,
  keywords text,
  citation_count int,
  award text,
  search tsvector generated always as (
    to_tsvector(
      'english',
      coalesce(title, '') || ' ' || coalesce(abstract, '') || ' ' || coalesce(keywords, '')
    )
  ) stored
);

create index papers_search_idx on public.papers using gin (search);

-- Read-only to the public: anyone can select, nobody can write with the anon key.
-- The seed script writes with the local service-role key.
alter table public.papers enable row level security;

create policy "Papers are readable by everyone"
  on public.papers
  for select
  to anon, authenticated
  using (true);
