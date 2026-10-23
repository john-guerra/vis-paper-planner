# 0001. Postgres full-text search before semantic search

## Context

Users need to find papers. Semantic search (transformers.js embeddings, issue #2) is the long-term goal, but it needs an embedding pipeline, model loading and relevance tuning. The data already lives in PostgreSQL (Supabase), which has built-in full-text search.

## Decision

Build keyword search on Postgres full-text search first. Add semantic search later, as a separate step.

## Status

Accepted

## Consequences

- We ship a working search sooner, with no extra dependencies.
- Keyword search misses synonyms and paraphrases; semantic search will address that.
- The search code should sit behind one interface, so the engine can be swapped or combined later.
