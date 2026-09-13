# Changelog

All notable changes to **knex-migration-lab** are documented here.

## 1.0.0 — 2026-09-13

- Add `knex_migrations_list` for `exports.up`/`down` / `export async function up`/`down` with multi-file filename markers → `[{name?, hasUp, hasDown}]`.
- Add `knex_table_ops_hint` for `createTable` / `dropTable` / `alterTable` / `renameTable` → `[{op, table?}]`.
- Add `knex_seed_hint` for `knex.seed` / `exports.seed` and insert table names → `[{hasSeed, tableInserts?}]`.
- Add `knex_lint_lite` for up without down, dropTable without cascade note, raw SQL present, and missing schemaName.
- Add skills, smoke tests, and Cursor plugin packaging. Local only; no network, no knex CLI. Lite JS scanner; ~1MB input cap. Document scanner limits. FREE MIT.
