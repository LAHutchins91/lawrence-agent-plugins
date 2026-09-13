# Superstruct Lab

Zero-auth **local** MCP tools for scanning pasted Superstruct JavaScript/TypeScript: struct inventory (`object({` / `type({` / `struct(`), field hints, coercion/create/mask counts, and lite lint. Lite JS/TS scanner (same family as yup-schema-lab / zod-schema-lab) — **no Superstruct runtime `assert()` / `validate()` / `create()` / `mask()`**, no network.

This is **not** the Superstruct library. Documented heuristics only.

## Tools

| Tool | Purpose |
|------|---------|
| `ss_structs_list` | `object({` / `struct(` / `type(` export/const names → `[{name?, kind}]` |
| `ss_fields_hint` | keys inside `object({ ... })` / `type({ ... })` → `[{field, typeHint?}]` |
| `ss_coercion_hint` | `coerce(` / `mask(` / `create(` usage counts → `[{method, count}]` |
| `ss_lint_lite` | empty object, missing optional vs required clarity, deprecated patterns note, no Infer type export hint → `{findings[]}` |

## Limits

- Pasted schema source text you already have. No sockets, DNS, remote fetches, or Superstruct runtime for tool logic (`assert()` / `validate()` / `create()` / `mask()` never run).
- Input capped at ~1MB (`1048576` characters).
- **Lite JS/TS only** — not a full AST. Supported loosely: `//` and `/* */` comments stripped; simple `'/"/\`` string literals; common `object({` / `type({` / `struct(` assignments. Not supported / incomplete: spreads, imported helper structs expanded, computed keys, dynamic `require`/`import`.
- Does not validate data, execute structs, or talk to a network.
- FREE MIT.

## Start

```bash
node /workspace/superstruct-lab/dist/bundle.js
```

Local plugin install: `~/.cursor/plugins/local/superstruct-lab`

## Skills

- **ss-fields** — list structs and field hints from pasted Superstruct source
- **ss-lint** — coercion counts + lite heuristic findings

## License

MIT © Lawrence Hutchins — FREE
