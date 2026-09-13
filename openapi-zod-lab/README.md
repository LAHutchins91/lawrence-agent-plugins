# OpenAPI Zod Lab

Zero-auth **local** MCP tools for **OpenAPI YAML/JSON text → Zod mapping heuristics**: path inventory, `components.schemas` Zod hints, operation summaries, and lite lint. No Zod runtime. No codegen. No network.

## Why novel

No zero-auth local MCP in the catalog focuses on practical **OpenAPI → Zod hint** workflows — listing paths/schemas/ops and educational mapping smells without generating files or executing Zod.

## Tools

| Tool | Purpose |
|------|---------|
| `oz_paths_list` | OpenAPI text → `{ paths, count }` |
| `oz_schemas_hint` | OpenAPI text → `{ schemas, count }` with Zod type hints |
| `oz_ops_hint` | OpenAPI text → `{ operations, count }` |
| `oz_lint_lite` | OpenAPI text → `{ findings, findingCount }` |

## Caps & caveats

- **String analysis only** — never imports Zod, never generates files, never opens files on disk or over the network, never evaluates schemas.
- Parses JSON / JSONC and YAML (`yaml` package). Best-effort Zod mapping hints (not full codegen).
- Lint rules are educational heuristics (empty, missing openapi/swagger version, no paths, unused schemas tip, nullable vs optional mapping tip, etc.) — **not** an exploit guide.

## Start

```bash
node /workspace/openapi-zod-lab/dist/bundle.js
```

Local plugin install: `~/.cursor/plugins/local/openapi-zod-lab`

## Skills

- **oz-paths-schemas** — paths list + schema Zod hints
- **oz-ops-lint** — operation summaries + lite lint

## License

MIT © Lawrence Hutchins
