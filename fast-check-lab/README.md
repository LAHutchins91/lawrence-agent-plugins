# Fast-Check Lab

Zero-auth **local** MCP tools for **fast-check JS/TS text**: arbitrary inventory, `fc.assert` / `fc.property` hints, constraint-option hints, and heuristic lite lint. No `fast-check` runtime. No network.

## Why novel

No zero-auth local MCP in the catalog focuses on practical **fast-check** workflows — listing arbitraries/properties/constraints and educational smell heuristics without importing `fast-check` or running generators.

## Tools

| Tool | Purpose |
|------|---------|
| `fc_arbs_list` | source text → `{ arbs, count }` |
| `fc_props_hint` | source text → `{ properties, count }` |
| `fc_constraints_hint` | source text → `{ constraints, count }` |
| `fc_lint_lite` | source text → `{ findings, findingCount }` |

## Caps & caveats

- **String analysis only** — never imports fast-check, never opens files on disk or over the network, never evaluates generator code.
- Best-effort regex heuristics on `fc.*` / named-import assignments and option objects (not a full JS/TS AST or fast-check runtime).
- Lint rules are educational heuristics (empty, assert without property, missing seed tip, unbounded integer tip, etc.) — **not** an exploit guide.

## Start

```bash
node /workspace/fast-check-lab/dist/bundle.js
```

Local plugin install: `~/.cursor/plugins/local/fast-check-lab`

## Skills

- **fc-arbs-props** — arbitraries list + property / assert hints
- **fc-constraints-lint** — constraint-option hints + lite lint

## License

MIT © Lawrence Hutchins
