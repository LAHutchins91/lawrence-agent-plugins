# Yup Schema Lab

Zero-auth **local** MCP tools for scanning pasted Yup schema JavaScript/TypeScript: schema inventory (`yup.object` / `object({`), field hints, test-method counts (`.required` / `.email` / `.min` / `.max` / `.matches` / `.oneOf`), and lite lint. Lite JS/TS scanner (same family as knex-migration-lab / zod-schema-lab) — **no Yup runtime `validate()`**, no network.

This is **not** the Yup library. Documented heuristics only.

## Tools

| Tool | Purpose |
|------|---------|
| `yup_schemas_list` | `yup.object` / `object({` / `yup.string`… export/const names → `[{name?, kind}]` |
| `yup_fields_hint` | keys inside `yup.object({ ... })` / `.shape({ ... })` → `[{field, typeHint?}]` |
| `yup_tests_hint` | `.required` / `.email` / `.min` / `.max` / `.matches` / `.oneOf` → `[{method, count}]` |
| `yup_lint_lite` | object without required fields note, deprecated `.nullable().required()` order, empty schema, missing `.strict()` → `{findings[]}` |

## Limits

- Pasted schema source text you already have. No sockets, DNS, remote fetches, or Yup runtime for tool logic (`schema.validate()` / `isValid()` never run).
- Input capped at ~1MB (`1048576` characters).
- **Lite JS/TS only** — not a full AST. Supported loosely: `//` and `/* */` comments stripped; simple `'/"/\`` string literals; common `yup.*` / destructured `object({` assignments and chains. Not supported / incomplete: spreads, imported helper schemas expanded, computed keys, dynamic `require`/`import`.
- Does not validate data, execute schemas, or talk to a network.
- FREE MIT.

## Start

```bash
node /workspace/yup-schema-lab/dist/bundle.js
```

Local plugin install: `~/.cursor/plugins/local/yup-schema-lab`

## Skills

- **yup-fields** — list schemas and field hints from pasted Yup source
- **yup-lint** — test-method counts + lite heuristic findings

## License

MIT © Lawrence Hutchins — FREE
