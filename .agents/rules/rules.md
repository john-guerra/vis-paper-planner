---
trigger: always_on
---

# Antigravity Rules - VisPaperPlanner

## Core Principles
1. **High Quality Development:** All code must be production-ready, readable, and strictly adhere to high quality standards.
2. **Professional Aesthetics:** The UI must adhere to a premium, non-generic look using Tailwind CSS. Avoid standard default looks and prioritize visually striking, highly polished components.
3. **Security First:** The application must follow standard Web security practices (e.g., sanitizing inputs, secure headers, strict CORS policies, Row-Level Security in Supabase).
4. **Test-Driven:** No feature is considered complete without automated tests. 
5. **Collaboration First:** We strictly use Scrum on GitHub Issues and standard feature branch/Pull Request workflows.
6. **Frequent Commits:** Commit code often to establish valid development checkpoints. Specifically, a commit must be made every time a major feature (or sub-component) is completed.

## Technology Stack
- **Frontend Framework:** Next.js (React)
- **Styling:** Tailwind CSS (Premium, Professional Design)
- **Machine Learning:** `transformers.js` (In-browser/Serverless Semantic Search)
- **Database Backend:** PostgreSQL + Supabase
- **Deployment:** Vercel
- **CI/CD:** GitHub Actions

## Code Quality & Testing Rules
- **Formatting & Linting:** You must adhere to ESLint and Prettier formatting standard rules. Code that does not pass linting cannot be merged.
- **Code Coverage Minimum:** `70%` code coverage is strictly enforced.
- **Unit Testing:** Write robust unit tests (using Vitest or Jest) for logic and individual components.
- **End-to-End Testing:** Use **Playwright** to map and verify the user journey across the core usage scenarios (Related Work, Conference Fit, etc.).

## Workflow Execution Rules for Agents
- When implementing a feature, ensure a corresponding GitHub Issue exists (or is conceptually tracked).
- Always verify your work via automated tests before notifying the user of completion.
- Prioritize non-API dependent tools like local `transformers.js` for ML tasks to ensure low cost and high privacy for the user.
