# io-ts Lab

Zero-auth **local** MCP tools for scanning pasted io-ts TypeScript: codec inventory (`t.type` / `t.interface` / `t.partial` / `t.array` / `t.union` / `t.intersection` / `t.strict`), props hints, brand counts, and lite lint. Lite TypeScript scanner (same family as yup-schema-lab / zod-schema-lab / superstruct-lab) — **no io-ts runtime `decode()` / `encode()`**, no network.

This is **not** the io-ts library. Documented heuristics only.

## Tools

| Tool | Purpose |
|------|---------|
| `iots_codecs_list` | `t.type` / `t.interface` / `t.partial` / `t.array` / `t.union` / `t.intersection` / `t.strict` → `[{name?, kind}]` |
| `iots_props_hint` | keys inside `t.type({ ... })` / `t.interface` → `[{field, typeHint?}]` |
| `iots_brand_hint` | `t.brand` / `Brand` counts → `[{method, count}]` |
| `iots_lint_lite` | type vs strict confusion note, missing `t.exact`, empty codec, no Decoder export hint → `{findings[]}` |

## Limits

- Pasted schema source text you already have. No sockets, DNS, remote fetches, or io-ts runtime for tool logic (`decode()` / `encode()` never run).
- Input capped at ~1MB (`1048576` characters).
- **Lite TypeScript only** — not a full AST. Supported loosely: `//` and `/* */` comments stripped; simple `'/"/\`` string literals; common `t.type({` / `t.interface({` / `t.partial({` / `t.strict({` assignments. Not supported / incomplete: spreads, imported helper codecs expanded, computed keys, dynamic `require`/`import`.
- Does not validate data, execute codecs, or talk to a network.
- FREE MIT.

## Start

```bash
node /workspace/io-ts-lab/dist/bundle.js
```

Local plugin install: `~/.cursor/plugins/local/io-ts-lab`

## Skills

- **iots-props** — list codecs and prop hints from pasted io-ts source
- **iots-lint** — brand counts + lite heuristic findings

## License

MIT © Lawrence Hutchins — FREE
