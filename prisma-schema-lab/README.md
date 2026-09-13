# Prisma Schema Lab

Zero-auth **local** MCP tools for **schema.prisma text**: models/enums inventory, datasource/generator hints (URL redacted), relation hints, and heuristic lite lint. No Prisma CLI. No network. No database.

## Why novel

No zero-auth local MCP in the catalog focuses on practical **schema.prisma** workflows — listing models/enums/relations/datasources and educational smell heuristics without invoking Prisma or connecting to a DB.

## Tools

| Tool | Purpose |
|------|---------|
| `prisma_models_list` | schema text → `{ models, enums?, count }` |
| `prisma_datasources` | schema text → `{ datasources, generators? }` (URL redacted) |
| `prisma_relations_hint` | schema text → `{ relations, count }` |
| `prisma_lint_lite` | schema text → `{ findings, findingCount }` |

## Caps & caveats

- **String analysis only** — never runs Prisma CLI, never opens files on disk or over the network, never connects to a database.
- Best-effort Prisma DSL heuristics (not a full Prisma schema parser / validator).
- Datasource tool **never echoes full connection secrets** — `urlHint` is env-ref or redacted provider/host.
- Lint rules are educational heuristics (empty, missing datasource/generator, String ids without @id, @@map tips, plaintext URL, previewFeatures) — **not** an exploit guide.

## Start

```bash
node /workspace/prisma-schema-lab/dist/bundle.js
```

Local plugin install: `~/.cursor/plugins/local/prisma-schema-lab`

## Skills

- **prisma-models-relations** — models/enums list + relation hints
- **prisma-datasource-lint** — datasources/generators + lite lint

## License

MIT © Lawrence Hutchins
