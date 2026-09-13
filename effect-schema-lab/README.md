# Effect Schema Lab

Zero-auth **local** MCP tools for **Effect Schema TS/JS text**: schema inventory, Struct field hints, transform/filter/pipe chains, and heuristic lite lint. No Effect runtime. No network.

## Why novel

No zero-auth local MCP in the catalog focuses on practical **Effect Schema** workflows — listing schemas/fields/transforms and educational smell heuristics without importing `effect` or executing schemas.

## Tools

| Tool | Purpose |
|------|---------|
| `eff_schemas_list` | schema text → `{ schemas, count }` |
| `eff_fields_hint` | schema text → `{ fields, count }` |
| `eff_transform_hint` | schema text → `{ transforms, count }` |
| `eff_lint_lite` | schema text → `{ findings, findingCount }` |

## Caps & caveats

- **String analysis only** — never imports Effect, never opens files on disk or over the network, never evaluates schema code.
- Best-effort regex heuristics on `Schema.*` / `S.*` assignments and Struct literals (not a full JS/TS AST or Effect compile).
- Lint rules are educational heuristics (empty, missing Struct, Any/Unknown overuse, branded tips, etc.) — **not** an exploit guide.

## Start

```bash
node /workspace/effect-schema-lab/dist/bundle.js
```

Local plugin install: `~/.cursor/plugins/local/effect-schema-lab`

## Skills

- **eff-schemas-fields** — schemas list + Struct field hints
- **eff-transform-lint** — transform/filter/pipe hints + lite lint

## License

MIT © Lawrence Hutchins
