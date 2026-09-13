# Runtypes Lab

Zero-auth **local** MCP tools for scanning pasted Runtypes TypeScript: type inventory (`Record({ ... })` / `Object({ ... })` / `Array(` / `Union(` / `Literal(` / `String` / `Number`), field hints, constraint counts, and lite lint. Lite TypeScript scanner (same family as yup-schema-lab / zod-schema-lab / arktype-lab / io-ts-lab) — **never `.check()` / `.guard()`**, no network.

This is **not** the Runtypes library. Documented heuristics only.

## Tools

| Tool | Purpose |
|------|---------|
| `rt_types_list` | `Record({` / `Object({` / `Array(` / `Union(` / `Literal(` / `String` / `Number` → `[{name?, kind}]` |
| `rt_fields_hint` | keys inside `Record({ ... })` → `[{field, typeHint?}]` |
| `rt_constraint_hint` | `.withConstraint(` / `Constraint(` / `.withGuard` counts → `[{method, count}]` |
| `rt_lint_lite` | empty Record, missing Static export, Optional vs required clarity, deprecated Intersect → `{findings[]}` |

## Limits

- Pasted schema source text you already have. No sockets, DNS, remote fetches, or Runtypes runtime for tool logic (`.check()` / `.guard()` never run).
- Input capped at ~1MB (`1048576` characters).
- **Lite TypeScript only** — not a full AST. Supported loosely: `//` and `/* */` comments stripped; simple `'/"/\`` string literals; common `Record({` / `Object({` assignments. Not supported / incomplete: spreads, imported helper types expanded, computed keys, dynamic `require`/`import`.
- Does not validate data, execute types, or talk to a network.
- FREE MIT.

## Start

```bash
node /workspace/runtypes-lab/dist/bundle.js
```

Local plugin install: `~/.cursor/plugins/local/runtypes-lab`

## Skills

- **rt-fields** — list types and field hints from pasted Runtypes source
- **rt-lint** — constraint counts + lite heuristic findings

## License

MIT © Lawrence Hutchins — FREE
