---
name: knex-lint
description: "Lite-lint pasted Knex migrations/seeds for up without down, dropTable without cascade note, raw SQL presence, and missing schemaName / withSchema. Local only, no knex CLI for tool logic, no fetch."
version: 1.0.0
tags: [knex, migrations, lint, cascade, schema, local]
---

# Knex migration lint

Use **`knex_lint_lite`** with `source` on pasted migration/seed JS (do not fetch URLs or run knex CLI for analysis):

- Up without down (warning)
- `dropTable` without cascade note (warning)
- `knex.raw` / raw SQL present (info)
- Missing `schemaName` / `withSchema` when table ops exist (info)
- Empty migrations — no up/down/ops/seed found (warning)

Heuristic only — not knex CLI / not SQL validation. Lite JS scanner.

## Example prompts

- "Lint this Knex migration for missing down."
- "Any dropTable without CASCADE notes?"
- "Is there raw SQL or missing schemaName?"
