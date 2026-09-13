# TypeBox Lab

Zero-auth **local** MCP tools for **TypeBox TS/JS text**: schema inventory, `Type.Object` property hints, compose combinators (`Union` / `Intersect` / `Partial` / `Pick` / `Ref` / …), and heuristic lite lint. No `@sinclair/typebox` runtime. No network.

## Why novel

No zero-auth local MCP in the catalog focuses on practical **TypeBox** workflows — listing schemas/object props/compose combinators and educational smell heuristics without importing `@sinclair/typebox` or compiling schemas.

## Tools

| Tool | Purpose |
|------|---------|
| `tb_schemas_list` | schema text → `{ schemas, count }` |
| `tb_props_hint` | schema text → `{ props, count }` |
| `tb_compose_hint` | schema text → `{ compose, count }` |
| `tb_lint_lite` | schema text → `{ findings, findingCount }` |

## Caps & caveats

- **String analysis only** — never imports TypeBox, never opens files on disk or over the network, never evaluates schema code.
- Best-effort regex heuristics on `Type.*` / `T.*` assignments and Object literals (not a full JS/TS AST or TypeBox compile).
- Lint rules are educational heuristics (empty, missing Object, Any/Unsafe overuse, additionalProperties, Format tips, etc.) — **not** an exploit guide.

## Start

```bash
node /workspace/typebox-lab/dist/bundle.js
```

Local plugin install: `~/.cursor/plugins/local/typebox-lab`

## Skills

- **tb-schemas-props** — schemas list + Object property hints
- **tb-compose-lint** — compose combinator hints + lite lint

## License

MIT © Lawrence Hutchins
