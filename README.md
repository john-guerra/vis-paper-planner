# VisPaperPlanner

VisPaperPlanner is an interactive web application designed to help visualization researchers navigate the VisPubData dataset. By leveraging in-browser semantic search using `transformers.js`, researchers can input a paper idea or abstract and instantly discover related work, evaluate conference fit, identify application areas, and uncover elements that make a paper successful in their specific niche.

## 🚀 Key Features
- **Semantic Search Engine**: Fast, local, in-browser embedding generation to find similar papers without API costs.
- **Interactive Visualizations**: A dynamic 2D scatterplot (UMAP projection) to explore the corpus similarity map.
- **Analytics Dashboards**: Visual breakdown of conference fit (VIS, VAST, InfoVis), word clouds for application areas, and success element aggregations.
- **BibTeX Export**: Seamlessly export selected related work for LaTeX integration.

## 🛠️ Technology Stack
- **Frontend Framework:** Next.js (App Router)
- **Styling:** Tailwind CSS (Premium, professional, non-generic design)
- **Machine Learning:** `transformers.js`
- **Database Backend:** PostgreSQL + Supabase
- **Deployment:** Vercel

## 📂 Project Structure & Vital Documents
* **Rules & Guidelines:** [`.agents/rules.md`](.agents/rules.md) (Symlinked from `AGENTS.md`) - Contains the core development principles, testing requirements, and formatting rules.
* **Product Requirements Document:** [`project_memory/PRD.md`](project_memory/PRD.md) - The master document outlining User Personas, Epics, and core requirements.
* **User Discovery Notes:** [`project_memory/mom_test_notes.md`](project_memory/mom_test_notes.md) - Contains the synthesized user personas and their pain points that dictated this product's direction.

## 💻 Development
This project mandates a strict **Test-Driven Development (TDD)** approach with a minimum of **70% Code Coverage**.
- **Unit Testing:** Vitest
- **E2E Testing:** Playwright
- **Code Quality:** ESLint & Prettier

### Getting Started
*(Instructions for environment setup, Supabase initialization, and Next.js dev server will be added as the project is scaffolded).*
