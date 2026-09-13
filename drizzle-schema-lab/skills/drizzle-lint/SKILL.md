---
name: drizzle-lint
description: "Lite-lint pasted Drizzle schema and/or drizzle.config for missing primary key heuristic, empty schema, config without dialect, and duplicate table names. Local only, no drizzle-kit for tool logic, no fetch."
version: 1.0.0
tags: [drizzle, schema, lint, primary-key, dialect, local]
---

# Drizzle schema / config lint

Use **`drizzle_lint_lite`** with `schema` and/or `config` on pasted sources (do not fetch URLs or run `drizzle-kit` for analysis):

- Missing primary key heuristic on a table (warning)
- Empty schema — no table helpers found (warning)
- Config without `dialect` / legacy `driver` (warning)
- Duplicate table names (error)

Heuristic only — not drizzle-kit / not SQL validation. Lite JS/TS scanner.

## Example prompts

- "Lint this Drizzle schema for missing primary keys."
- "Are there duplicate table names?"
- "Does this drizzle.config set dialect?"
