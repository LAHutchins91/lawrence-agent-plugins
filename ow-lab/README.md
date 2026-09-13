# Ow Lab

Zero-auth **local** MCP tools for scanning pasted sindresorhus **ow** JS/TS: predicate inventory (`ow.string` / `ow.number` / `ow.boolean` / `ow.array` / `ow.object` / `ow.any` / `ow.optional`), shape hints, modifier counts, and lite lint. Lite JS/TS scanner (same family as yup-schema-lab / zod-schema-lab / runtypes-lab) — **never `ow()` assert**, no network.

This is **not** the ow library. Documented heuristics only.

## Tools

| Tool | Purpose |
|------|---------|
| `ow_predicates_list` | `ow.string` / `ow.number` / `ow.boolean` / `ow.array` / `ow.object` / `ow.any` / `ow.optional` → `[{predicate, count}]` |
| `ow_shapes_hint` | `ow.object.partialShape` / `exactShape` / `ow.array.ofType` → `[{kind, count}]` |
| `ow_modifiers_hint` | `.minLength` / `.maxLength` / `.is` / `.validate` counts → `[{method, count}]` |
| `ow_lint_lite` | ow() without label, empty file, deprecated patterns note, missing isNode check hint → `{findings[]}` |

## Limits

- Pasted source text you already have. No sockets, DNS, remote fetches, or ow runtime for tool logic (`ow()` never runs).
- Input capped at ~1MB (`1048576` characters).
- **Lite JS/TS only** — not a full AST. Supported loosely: `//` and `/* */` comments stripped; simple `'/"/\`` string literals; common `ow.*` predicate / shape / modifier usage. Not supported / incomplete: spreads, imported helper predicates expanded, computed keys, dynamic `require`/`import`.
- Does not validate data, execute asserts, or talk to a network.
- FREE MIT.

## Start

```bash
node /workspace/ow-lab/dist/bundle.js
```

Local plugin install: `~/.cursor/plugins/local/ow-lab`

## Skills

- **ow-predicates** — list predicate and shape counts from pasted ow source
- **ow-lint** — modifier counts + lite heuristic findings

## License

MIT © Lawrence Hutchins — FREE
