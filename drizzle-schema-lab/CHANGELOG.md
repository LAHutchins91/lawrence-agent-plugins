# Changelog

All notable changes to **drizzle-schema-lab** are documented here.

## 1.0.0 — 2026-09-13

- Add `drizzle_tables_list` for `pgTable` / `mysqlTable` / `sqliteTable("name", …)` → `[{name, dialect?}]`.
- Add `drizzle_relations_hint` for `relations(` / `.references(` heuristics → `[{from?, to?, raw?}]`.
- Add `drizzle_migrations_hint` for drizzle.config `dialect` / `schema` / `out` → `{dialect?, schema?, out?}`.
- Add `drizzle_lint_lite` for missing primary key heuristic, empty schema, config without dialect, and duplicate table names.
- Add skills, smoke tests, and Cursor plugin packaging. Local only; no network, no drizzle-kit CLI. Lite JS/TS scanner; ~1MB input cap. Document scanner limits. FREE MIT.
