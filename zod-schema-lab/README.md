# Zod Schema Lab

Zero-auth **local** MCP tools for **Zod schema TS/JS text**: schema inventory, object field hints, refine/transform chains, and heuristic lite lint. No zod runtime. No network.

## Why novel

No zero-auth local MCP in the catalog focuses on practical **Zod schema** workflows — listing schemas/fields/refinements and educational smell heuristics without importing zod or executing schemas.

## Tools

| Tool | Purpose |
|------|---------|
| `zod_schemas_list` | schema text → `{ schemas, count }` |
| `zod_fields_hint` | schema text → `{ fields, count }` |
| `zod_refine_hint` | schema text → `{ refinements, count }` |
| `zod_lint_lite` | schema text → `{ findings, findingCount }` |

## Caps & caveats

- **String analysis only** — never imports zod, never opens files on disk or over the network, never evaluates schema code.
- Best-effort regex heuristics on `z.*` assignments and object literals (not a full JS/TS AST or zod compile).
- Lint rules are educational heuristics (empty, any/unknown overuse, email/url helper tips, passthrough vs strict, z.record tips, etc.) — **not** an exploit guide.

## Start

```bash
node /workspace/zod-schema-lab/dist/bundle.js
```

Local plugin install: `~/.cursor/plugins/local/zod-schema-lab`

## Skills

- **zod-schemas-fields** — schemas list + field hints
- **zod-refine-lint** — refine/transform hints + lite lint

## License

MIT © Lawrence Hutchins
