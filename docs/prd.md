# Product Requirements Document (PRD) - VisPaperPlanner

## 1. Project Overview

VisPaperPlanner is a web application designed to help VIS researchers navigate the VisPubData dataset. By leveraging in-browser semantic search (`transformers.js`), researchers can input a paper idea or abstract and instantly discover related work, evaluate conference fit, identify application areas, and uncover elements that make a paper successful in their specific niche.

## 2. Target Audience & User Personas

### Persona 1: The Novice (Alex, 1st-year PhD Student)

- **Goal:** Understand the landscape of a specific subfield and build a comprehensive reading list.
- **Pain Point:** Generic search tools (Google Scholar) are too noisy, returning non-VIS papers. Manual citation chaining is tedious.
- **Need:** Venue-specific filtering and semantic matching that goes beyond exact keyword overlap.

### Persona 2: The Expert (Dr. Taylor, Associate Professor)

- **Goal:** Write grant proposals and ensure proposed techniques haven't been published in obscure older VIS papers. They also need to find reviewers.
- **Pain Point:** Missing prior work due to inconsistent terminology over the years (e.g., "node-link diagram" vs. "graph drawing").
- **Need:** Concept-level similarity search that bridges vocabulary gaps over time.

### Persona 3: The Surveyor (Sam, Postdoc)

- **Goal:** Write a State-of-the-Art (STAR) report requiring exhaustive coverage of a topic.
- **Pain Point:** High friction when context-switching between the raw VisPubData spreadsheet and digital libraries to read abstracts.
- **Need:** An integrated, visual workflow that clusters similar papers and provides immediate access to metadata and abstracts.

## 3. High-Level Requirements

- **Frontend Framework:** Next.js (App Router) for robust routing, SEO capabilities, and Vercel compatibility.
- **Semantic Search:** In-browser semantic matching using `transformers.js` to avoid API costs.
- **Data Backend:** A robust backend using **PostgreSQL + Supabase** to store the VisPubData dataset, pre-computed embeddings, and user-saved reading lists.
- **Styling:** Tailwind CSS with a highly customized, non-generic, professional design system (premium feel, subtle animations).
- **Core Scenarios:**
  - Related Work Discovery (with BibTeX export)
  - Interactive 2D Similarity Scatterplot (UMAP/t-SNE projection)
  - Conference Fit Analysis
  - Application Area Identification
  - Success Elements Aggregation

## 4. Engineering Standards & Methodologies

### 4.1 Development Process

- **Agile Methodology:** We will follow a Scrum-based approach anchored entirely in **GitHub Issues**. Every task, bug, and feature must be tracked as an issue.
- **Collaboration:** Standard Git Flow. All features must be developed on feature branches and merged via Pull Requests (PRs).
- **Frequent Commits:** Developers must commit frequently to have valid checkpoints. A commit should occur every time a major feature or sub-component is completed.

### 4.2 Quality Assurance

- **Linting & Formatting:**
  - `eslint` for code quality checks.
  - `prettier` for consistent code formatting.
  - Pre-commit hooks (e.g., Husky) to enforce these standards before commits are allowed.
- **Testing Requirements:**
  - **Overall Code Coverage:** Minimum **70%**. No feature is considered "done" without tests.
  - **Unit Testing:** Vitest (or Jest) for component and logic testing.
  - **End-to-End (E2E) Testing:** Playwright to simulate user journeys across the core scenarios.

### 4.3 CI/CD & Deployment

- **Continuous Integration (CI):** GitHub Actions will automatically run linting, Prettier checks, unit tests, and E2E tests on every Pull Request.
- **Deployment:** Vercel (Free Tier) will be used for continuous deployment of the frontend. Every PR to the `main` branch will trigger a production deployment upon successful CI checks.

---

## 5. User Stories

### Epic 1: Data & Infrastructure

- As an administrator, I want the VisPubData dataset and pre-computed embeddings stored securely in a Supabase PostgreSQL database so the app can query it efficiently.
  - [ ] Given the VisPubData CSV, when the import script runs, then every paper is stored with its title, year, conference and abstract.
  - [ ] Given the stored papers, when embeddings are computed, then each paper has one pre-computed embedding vector.
  - [ ] Given the database, when an unauthenticated visitor attempts a write, then the write is rejected.
- As a developer, I want a CI/CD pipeline configured with GitHub Actions and Vercel so that my code is automatically tested and deployed.
  - [ ] Given a pull request, when it is opened or updated, then linting, Prettier checks, unit tests and E2E tests run automatically.
  - [ ] Given any failing check, when I view the pull request, then merging is blocked.
  - [ ] Given a merge to `main` with passing checks, when the pipeline finishes, then the app is deployed to Vercel.

### Epic 2: Core Analysis Dashboard & Visualization

- As a researcher, I want to search papers by keyword so I can find related work without knowing exact titles.
  - [ ] Given a keyword query, when I search, then each result shows the paper's title, year and conference.
  - [ ] Given an empty query, when I view the search page, then I see a prompt asking me to enter a keyword.
  - [ ] Given a query that matches no papers, when I search, then I see a message saying no papers were found.
- As a researcher, I want to paste my working abstract into the app so that I can find semantically similar VIS papers.
  - [ ] Given a pasted abstract, when I submit it, then I see a ranked list of the most similar papers.
  - [ ] Given an empty abstract, when I submit it, then I see a message asking me to paste an abstract.
  - [ ] Given a submitted abstract, when the search runs, then it runs locally in my browser without sending the abstract to a server.
- As a researcher, I want to see a 2D interactive scatterplot of the paper corpus, colored by similarity to my query, so I can visually explore clusters of related work.
  - [ ] Given a completed query, when the scatterplot renders, then every paper appears as a point colored by its similarity to my query.
  - [ ] Given the scatterplot, when I hover over a point, then I see that paper's title, year and conference.
  - [ ] Given the scatterplot, when I click a point, then that paper is highlighted in the results list.
- As a researcher, I want to see a visual breakdown of which tracks (VIS, VAST, InfoVis, etc.) my similar papers belong to so I can gauge conference fit.
  - [ ] Given a completed query, when results load, then I see a chart showing the number of similar papers per track.
  - [ ] Given the chart, when I hover over a track, then I see its exact paper count.
- As a researcher, I want to see a word cloud or keyword list aggregated from similar papers to identify my specific application area.
  - [ ] Given a completed query, when results load, then I see the most frequent keywords among the similar papers.
  - [ ] Given the keyword list, when I click a keyword, then the results are filtered to papers containing it.
- As a researcher, I want to see aggregated stats on successful papers in my niche (e.g., methodologies used) to understand how to position my work.
  - [ ] Given a completed query, when results load, then I see aggregated stats for the similar papers, such as the methodologies they use.
  - [ ] Given fewer than five similar papers, when stats are shown, then I see a note that the sample is too small to be reliable.

### Epic 3: Workflow Features

- As a researcher, I want to select specific papers from my related work list and export them as a BibTeX file for my LaTeX document.
  - [ ] Given the results list, when I select one or more papers, then the export button shows how many are selected.
  - [ ] Given selected papers, when I click export, then a `.bib` file with one entry per selected paper downloads.
  - [ ] Given no selected papers, when I view the export button, then it is disabled.
- As a user, I want the app to be fast and responsive, running the semantic search locally in my browser to protect my unpublished ideas.
  - [ ] Given a loaded app, when I run a search, then no request containing my query text is sent to any server.
  - [ ] Given a search in progress, when the model is still loading, then I see a loading indicator.
