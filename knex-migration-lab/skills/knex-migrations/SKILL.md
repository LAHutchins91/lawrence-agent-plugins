---
name: knex-migrations
description: "List Knex migration up/down exports (with multi-file markers), table-op hints (createTable/dropTable/alterTable/renameTable), and seed hints from pasted Knex migration/seed JS. Local only — no knex CLI, no fetch."
version: 1.0.0
tags: [knex, migrations, seeds, schema, local]
---

# Knex migrations / table ops / seed hint

Use these tools when the user pastes Knex migration or seed JS text (never fetch a remote file, never run knex CLI for analysis):

1. **`knex_migrations_list`** with `source` — → `{migrations: [{name?, hasUp, hasDown}], count}`.
2. **`knex_table_ops_hint`** with `source` — → `{ops: [{op, table?}], count}`.
3. **`knex_seed_hint`** with `source` — → `{seeds: [{hasSeed, tableInserts?}], count}`.

Multi-file: concatenate with `=== file.js ===` or `--- file: path ---` markers.

Lite JS scanner. Input cap ~1MB. Documented limitations apply (not knex CLI; no network).

## Example prompts

- "List up/down in these Knex migrations."
- "What createTable/dropTable ops are declared?"
- "Which tables does this seed insert into?"
