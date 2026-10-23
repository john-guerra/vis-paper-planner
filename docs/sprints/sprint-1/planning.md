# Sprint 1 planning

## Sprint goal

Users can search papers by keyword (issue #1, narrowed to keyword search), and every push is checked by CI.

## Dates

- Start: YYYY-MM-DD
- End: YYYY-MM-DD (1-2 weeks)

## Roles (rotate each sprint)

- Product Owner: Partner A
- Scrum Master: Partner B

## Selected issues

| Issue | Title                                     | Estimate | Owner     |
| ----- | ----------------------------------------- | -------- | --------- |
| #1    | Home / Search View (keyword search only)  | M        | Partner A |
| #8    | CI: lint, unit tests and E2E on each push | S        | Partner B |

## Not in this sprint

- #2 Semantic Engine (transformers.js): comes after keyword search works, see [ADR 0001](../../decisions/0001-postgres-full-text-first.md).
- #3 to #6 Results views A-E and #7 BibTeX export: later sprints.

## Definition of done

- Acceptance criteria in the issue are met.
- Tests pass in CI, and the PR is reviewed by the partner and merged.
