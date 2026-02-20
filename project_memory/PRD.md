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
- As a developer, I want a CI/CD pipeline configured with GitHub Actions and Vercel so that my code is automatically tested and deployed.

### Epic 2: Core Analysis Dashboard & Visualization
- As a researcher, I want to paste my working abstract into the app so that I can find semantically similar VIS papers.
- As a researcher, I want to see a 2D interactive scatterplot of the paper corpus, colored by similarity to my query, so I can visually explore clusters of related work.
- As a researcher, I want to see a visual breakdown of which tracks (VIS, VAST, InfoVis, etc.) my similar papers belong to so I can gauge conference fit.
- As a researcher, I want to see a word cloud or keyword list aggregated from similar papers to identify my specific application area.
- As a researcher, I want to see aggregated stats on successful papers in my niche (e.g., methodologies used) to understand how to position my work.

### Epic 3: Workflow Features
- As a researcher, I want to select specific papers from my related work list and export them as a BibTeX file for my LaTeX document.
- As a user, I want the app to be fast and responsive, running the semantic search locally in my browser to protect my unpublished ideas.
