-- The local stack grants table privileges to anon/authenticated by default; hosted projects may not.
-- Grant read access explicitly so the RLS select policy works the same everywhere. No write grants.
grant select on public.papers to anon, authenticated;
