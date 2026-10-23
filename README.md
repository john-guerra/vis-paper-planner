This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Run locally

Needs a current Node LTS and Docker (for the local Supabase).

```bash
npm ci
npx supabase start            # prints the local URL and keys
cp .env.example .env.local    # fill SUPABASE_URL, SUPABASE_ANON_KEY and SUPABASE_SERVICE_ROLE_KEY from `npx supabase status`
npm run db:seed
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Try `/?q=treemap`.

## Deploy

Vercel + a hosted Supabase project: see [docs/deploy.md](docs/deploy.md).

## Board & issues

Work is tracked in [GitHub issues](https://github.com/john-guerra/vis-paper-planner/issues),
grouped by the [Sprint 1 milestone](https://github.com/john-guerra/vis-paper-planner/milestone/1).

## Project docs

- [Product requirements (PRD)](docs/prd.md)
- [Research: mom test notes and summary](docs/research/)
- [Design: mockup](docs/design/)
