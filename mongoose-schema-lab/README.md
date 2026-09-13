# Mongoose Schema Lab

Zero-auth **local** MCP tools for **Mongoose schema JS/TS text**: model inventory, path hints, index hints, and heuristic lite lint. No mongoose runtime. No MongoDB. No network.

## Why novel

No zero-auth local MCP in the catalog focuses on practical **Mongoose schema** workflows — listing models/paths/indexes and educational smell heuristics without importing mongoose or connecting to MongoDB.

## Tools

| Tool | Purpose |
|------|---------|
| `mongoose_models_list` | schema text → `{ models, schemas?, count }` |
| `mongoose_paths_hint` | schema text → `{ paths, count }` |
| `mongoose_indexes_hint` | schema text → `{ indexes, count }` |
| `mongoose_lint_lite` | schema text → `{ findings, findingCount }` |

## Caps & caveats

- **String analysis only** — never imports mongoose, never opens files on disk or over the network, never connects to MongoDB.
- Best-effort regex heuristics on object-literal Schema definitions (not a full JS/TS AST or mongoose compile).
- Lint rules are educational heuristics (empty, missing model name, plaintext mongo URI, syncIndexes tips, Mixed overuse, no timestamps tip, etc.) — **not** an exploit guide.

## Start

```bash
node /workspace/mongoose-schema-lab/dist/bundle.js
```

Local plugin install: `~/.cursor/plugins/local/mongoose-schema-lab`

## Skills

- **mongoose-models-paths** — models list + path hints
- **mongoose-indexes-lint** — index hints + lite lint

## License

MIT © Lawrence Hutchins
