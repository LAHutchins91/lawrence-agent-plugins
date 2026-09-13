# Joi Schema Lab

Zero-auth **local** MCP tools for **Joi schema JS/TS text**: schema inventory, object field hints, chained rule inventory, and heuristic lite lint. No joi runtime. No network.

## Why novel

No zero-auth local MCP in the catalog focuses on practical **Joi schema** workflows — listing schemas/fields/rules and educational smell heuristics without importing joi or executing schemas.

## Tools

| Tool | Purpose |
|------|---------|
| `joi_schemas_list` | schema text → `{ schemas, count }` |
| `joi_fields_hint` | schema text → `{ fields, count }` |
| `joi_rules_hint` | schema text → `{ rules, count }` |
| `joi_lint_lite` | schema text → `{ findings, findingCount }` |

## Caps & caveats

- **String analysis only** — never imports joi, never opens files on disk or over the network, never evaluates schema code.
- Best-effort regex heuristics on `Joi.*` / `joi.*` assignments and object literals (not a full JS/TS AST or joi compile).
- Lint rules are educational heuristics (empty, deprecated `Joi.reach` / `assert` tips, `allow(null)` vs `optional`, `.unknown(true)` tip, etc.) — **not** an exploit guide.

## Start

```bash
node /workspace/joi-schema-lab/dist/bundle.js
```

Local plugin install: `~/.cursor/plugins/local/joi-schema-lab`

## Skills

- **joi-schemas-fields** — schemas list + field hints
- **joi-rules-lint** — chained rules + lite lint

## License

MIT © Lawrence Hutchins
