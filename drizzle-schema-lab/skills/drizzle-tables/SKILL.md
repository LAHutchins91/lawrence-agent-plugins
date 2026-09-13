---
name: drizzle-tables
description: >
  List pgTable/mysqlTable/sqliteTable names (with dialect hints) and
  relations/.references heuristics from pasted Drizzle schema TS/JS.
  Also drizzle.config dialect/schema/out. Local only — no drizzle-kit,
  no fetch.
version: 1.0.0
tags: [drizzle, schema, tables, relations, migrations, local]
---

# Drizzle tables / relations / migrations hint

Use these tools when the user pastes Drizzle schema or `drizzle.config.*` text (never fetch a remote file, never run `drizzle-kit` for analysis):

1. **`drizzle_tables_list`** with `source` — → `{tables: [{name, dialect?, binding?}], count}`.
2. **`drizzle_relations_hint`** with `source` — → `{relations: [{from?, to?, raw?, kind?}], count}`.
3. **`drizzle_migrations_hint`** with `source` (config text) — → `{dialect?, schema?, out?}`.

Lite JS/TS scanner. Input cap ~1MB. Documented limitations apply (not drizzle-kit; no network).

## Example prompts

- "List tables in this Drizzle schema."
- "What relations / references are declared?"
- "What is dialect / schema / out in this drizzle.config?"
