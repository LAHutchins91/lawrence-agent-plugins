# Knex Migration Lab

Zero-auth **local** MCP tools for scanning pasted Knex migration and seed JavaScript: migration up/down list (with multi-file markers), table-op hints (`createTable` / `dropTable` / `alterTable` / `renameTable`), seed hints, and lite lint. Lite JS scanner (same family as sequelize-model-lab) — no knex CLI for tool logic, no network.

This is **not** the Knex CLI. Documented heuristics only.

## Tools

| Tool | Purpose |
|------|---------|
| `knex_migrations_list` | `exports.up`/`down` or `export async function up`/`down` + filename markers → `[{name?, hasUp, hasDown}]` |
| `knex_table_ops_hint` | `createTable` / `dropTable` / `alterTable` / `renameTable` → `[{op, table?}]` |
| `knex_seed_hint` | `knex.seed` / `exports.seed` + insert tables → `[{hasSeed, tableInserts?}]` |
| `knex_lint_lite` | up without down, dropTable without cascade note, raw SQL info, missing schemaName → `{findings[]}` |

## Limits

- Pasted migration/seed source text you already have. No sockets, DNS, remote fetches, or knex CLI for tool logic (`knex` CLI never run by tools).
- Input capped at ~1MB (`1048576` characters).
- Single file **or** multi-file concatenated with markers: `=== path/file.js ===`, `--- file: path/file.js ---`.
- **Lite JS only** — not a full AST. Supported loosely: `//` and `/* */` comments stripped; simple `'/"/\`` string literals; common Knex schema/seed calls. Not supported / incomplete: spreads, imported helpers, computed table names, dynamic `require`/`import`.
- Does not migrate, seed, talk to a database, or execute migration modules.
- FREE MIT.

## Start

```bash
node /workspace/knex-migration-lab/dist/bundle.js
```

Local plugin install: `~/.cursor/plugins/local/knex-migration-lab`

## Skills

- **knex-migrations** — list migrations, table ops, and seed hints from pasted source
- **knex-lint** — lite heuristic findings on Knex migrations/seeds

## License

MIT © Lawrence Hutchins — FREE
