# Valibot Lab

Zero-auth **local** MCP tools for **Valibot schema TS/JS text**: schema inventory, `v.pipe` chains, action hints, and heuristic lite lint. No valibot runtime. No network.

## Why novel

No zero-auth local MCP in the catalog focuses on practical **Valibot schema** workflows — listing schemas/pipes/actions and educational smell heuristics without importing valibot or executing schemas.

## Tools

| Tool | Purpose |
|------|---------|
| `vb_schemas_list` | schema text → `{ schemas, count }` |
| `vb_pipes_hint` | schema text → `{ pipes, count }` |
| `vb_actions_hint` | schema text → `{ actions, total }` |
| `vb_lint_lite` | schema text → `{ findings, findingCount }` |

## Caps & caveats

- **String analysis only** — never imports valibot, never opens files on disk or over the network, never evaluates schema code.
- Best-effort regex heuristics on `v.*` / named-import assignments and `v.pipe(...)` chains (not a full JS/TS AST or valibot compile).
- Lint rules are educational heuristics (empty, missing pipe tip, any()/unknown() overuse, deprecated API tips, etc.) — **not** an exploit guide.

## Start

```bash
node /workspace/valibot-lab/dist/bundle.js
```

Local plugin install: `~/.cursor/plugins/local/valibot-lab`

## Skills

- **vb-schemas-pipes** — schemas list + pipe hints
- **vb-actions-lint** — action hints + lite lint

## License

MIT © Lawrence Hutchins
