# TypeORM Entity Lab

Zero-auth **local** MCP tools for **TypeORM entity TS/JS text**: entity inventory, relation hints, column hints, and heuristic lite lint. No TypeORM CLI. No network. No database.

## Why novel

No zero-auth local MCP in the catalog focuses on practical **TypeORM decorator entity** workflows — listing entities/relations/columns and educational smell heuristics without invoking TypeORM or connecting to a DB.

## Tools

| Tool | Purpose |
|------|---------|
| `typeorm_entities_list` | entity text → `{ entities, count }` |
| `typeorm_relations_hint` | entity text → `{ relations, count }` |
| `typeorm_columns_hint` | entity text → `{ columns, count }` |
| `typeorm_lint_lite` | entity/DataSource text → `{ findings, findingCount }` |

## Caps & caveats

- **String analysis only** — never runs TypeORM CLI, never opens files on disk or over the network, never connects to a database.
- Best-effort decorator-style TS/JS regex heuristics (not a TypeScript compiler / full TypeORM metadata reflection).
- Lint rules are educational heuristics (empty, Entity without Primary, `synchronize: true` smell, plaintext password in DataSource options, missing `@JoinColumn` on `@OneToOne`, etc.) — **not** an exploit guide.

## Start

```bash
node /workspace/typeorm-entity-lab/dist/bundle.js
```

Local plugin install: `~/.cursor/plugins/local/typeorm-entity-lab`

## Skills

- **typeorm-entities-relations** — entities list + relation hints
- **typeorm-columns-lint** — columns hints + lite lint

## License

MIT © Lawrence Hutchins
