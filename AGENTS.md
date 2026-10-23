# Agent Rules - VisPaperPlanner

## Core Principles

1. **High Quality Development:** All code must be production-ready, readable, and strictly adhere to high quality standards.
2. **Professional Aesthetics:** The UI must adhere to a premium, non-generic look using Tailwind CSS. Avoid standard default looks and prioritize visually striking, highly polished components.
3. **Test-Driven:** No feature is considered complete without automated tests.
4. **Collaboration First:** We strictly use Scrum on GitHub Issues and standard feature branch/Pull Request workflows.
5. **Frequent Commits:** Commit code often to establish valid development checkpoints. Specifically, a commit must be made every time a major feature (or sub-component) is completed.

## Technology Stack

- **Frontend Framework:** Next.js (React)
- **Styling:** Tailwind CSS (Premium, Professional Design)
- **Search:** Semantic search (transformers.js) is planned, see issue #2; the current search is Postgres full-text.
- **Database Backend:** PostgreSQL + Supabase
- **Deployment:** Vercel
- **CI/CD:** GitHub Actions

## Commands

- `npm run dev`: start the Next.js dev server
- `npm run build`: production build
- `npm test`: unit tests (Vitest)
- `npm run test:e2e`: end-to-end tests (Playwright)
- `npm run lint`: ESLint
- `npm run format`: Prettier
- `npm run design:lint`: validate `DESIGN.md`
- CI: `.github/workflows/ci.yml` (quality, unit, build, e2e; security in parallel)

## Context files

- UI: follow `DESIGN.md`.
- Requirements: `docs/prd.md`.
- Decisions: `docs/decisions/`.

## Code Quality & Testing Rules

- **Formatting & Linting:** You must adhere to ESLint and Prettier formatting standard rules. Code that does not pass linting cannot be merged.
- **Code Coverage:** CI runs `vitest run --coverage` and fails below `70%` (lines, functions, branches, statements) over `src/` (excluding `src/test`, tests and `layout.tsx`).
- **Failing test first:** a failing test is committed before the implementation that makes it pass.
- **Unit Testing:** Write robust unit tests (using Vitest) for logic and individual components.
- **End-to-End Testing:** Use **Playwright** to map and verify the user journey across the core usage scenarios (Related Work, Conference Fit, etc.).

## Security

- No secrets in code or commits.
- The Supabase service-role key is never used in client code.

## Workflow (course Scrum)

- Product Owner and Scrum Master roles rotate each sprint.
- Sprints last 1-2 weeks.
- One branch and one PR per issue; the PR description contains `Closes #N`.
- Your partner reviews the PR before it is merged.
- Write standups (Yesterday / Today / Blockers) in `docs/sprints/sprint-N/standups.md`.
- At each retro, update this file through a PR.
- When implementing a feature, ensure a corresponding GitHub Issue exists.
- Always verify your work via automated tests before notifying the user of completion.
- Prefer non-API dependent tools (such as local `transformers.js`, once added) for ML tasks to keep cost low and privacy high.

## Stick to the truth

- **Do not feel like you have to please me, I prefer that you say no or contradict me if I'm wrong.**
- **Feel free to tell me that you don't know something or that you are not confident instead of making up stuff.**
- **Always base your answers on evidence, unless I tell you otherwise**

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
