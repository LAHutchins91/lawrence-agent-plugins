# Drizzle Schema Lab

Zero-auth **local** MCP tools for scanning pasted Drizzle ORM schema TypeScript/JavaScript and `drizzle.config.*` text: table list (`pgTable` / `mysqlTable` / `sqliteTable`), relations / `.references` hints, migrations paths (`dialect` / `schema` / `out`), and lite lint. Lite JS/TS scanner (same family as vite-config-lab / esbuild-config-lab) — no drizzle-kit CLI for tool logic, no network.

This is **not** drizzle-kit. Documented heuristics only.

## Tools

| Tool | Purpose |
|------|---------|
| `drizzle_tables_list` | `pgTable` / `mysqlTable` / `sqliteTable("name", …)` → `[{name, dialect?}]` |
| `drizzle_relations_hint` | `relations(` / `.references(` heuristics → `[{from?, to?, raw?}]` |
| `drizzle_migrations_hint` | drizzle.config `schema` / `out` / `dialect` → `{dialect?, schema?, out?}` |
| `drizzle_lint_lite` | missing primary key heuristic, empty schema, config without dialect, duplicate table names → `{findings[]}` |

## Limits

- Pasted schema / drizzle.config text you already have. No sockets, DNS, remote fetches, or drizzle-kit CLI for tool logic (`drizzle-kit` never run by tools).
- Input capped at ~1MB (`1048576` characters).
- **Lite JS/TS only** — not a full AST (no Babel/TypeScript/Oxc). Supported loosely: `//` and `/* */` comments stripped; simple `'/"/\`` string literals; balanced `{}/()/[]` extraction; common `defineConfig({…})` / table helper calls. Not supported / incomplete: spreads, imported constants, `path.resolve` evaluation, computed keys, `satisfies`/`as` casts, dynamic `require`/`import`, cross-file re-exports, composite PK callbacks in all forms.
- Does not generate/migrate SQL, talk to a database, or execute schema modules.
- FREE MIT.

## Start

```bash
node /workspace/drizzle-schema-lab/dist/bundle.js
```

Local plugin install: `~/.cursor/plugins/local/drizzle-schema-lab`

## Skills

- **drizzle-tables** — list tables and relation hints from pasted schema
- **drizzle-lint** — lite heuristic findings on schema / drizzle.config

## License

MIT © Lawrence Hutchins — FREE
