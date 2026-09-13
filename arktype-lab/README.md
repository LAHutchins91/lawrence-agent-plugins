# ArkType Lab

Zero-auth **local** MCP tools for scanning pasted ArkType TypeScript: type inventory (`type({ ... })` / `type("...")`), props hints, narrow counts, and lite lint. Lite TypeScript scanner (same family as yup-schema-lab / zod-schema-lab / io-ts-lab) — **never `type().assert()`**, no network.

This is **not** the ArkType library. Documented heuristics only.

## Tools

| Tool | Purpose |
|------|---------|
| `ark_types_list` | `type({ ... })` / `type("...")` → `[{name?, kind: object\|stringDef}]` |
| `ark_props_hint` | keys inside `type({ ... })` → `[{field, defHint?}]` |
| `ark_narrow_hint` | `.narrow(` / `narrow(` counts → `[{method, count}]` |
| `ark_lint_lite` | empty type, string definition heavy note, missing `.configure`, no infer export hint → `{findings[]}` |

## Limits

- Pasted schema source text you already have. No sockets, DNS, remote fetches, or ArkType runtime for tool logic (`type().assert()` never runs).
- Input capped at ~1MB (`1048576` characters).
- **Lite TypeScript only** — not a full AST. Supported loosely: `//` and `/* */` comments stripped; simple `'/"/\`` string literals; common `type({` / `type("` assignments. Not supported / incomplete: spreads, imported helper types expanded, computed keys, dynamic `require`/`import`.
- Does not validate data, execute types, or talk to a network.
- FREE MIT.

## Start

```bash
node /workspace/arktype-lab/dist/bundle.js
```

Local plugin install: `~/.cursor/plugins/local/arktype-lab`

## Skills

- **ark-props** — list types and prop hints from pasted ArkType source
- **ark-lint** — narrow counts + lite heuristic findings

## License

MIT © Lawrence Hutchins — FREE
