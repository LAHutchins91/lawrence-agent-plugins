# GraphQL SDL Lab

Zero-auth **local** MCP tools for parsing pasted GraphQL Schema Definition Language (SDL): list types, list fields, find a type, and lite lint. String / regex scanner only — no GraphQL network, no remote schema fetch.

This is **not a full GraphQL spec parser**: `#` comments and `"""`/`"` strings are stripped loosely; common `type` / `interface` / `enum` / `input` / `union` / `scalar` definitions with `implements` and fields/args are supported. No directive fidelity, no schema-extension merge, no full AST.

## Tools

| Tool | Purpose |
|------|---------|
| `sdl_parse_types` | SDL text → `{types: [{kind, name, implements?}]}` |
| `sdl_list_fields` | SDL + typeName → `{fields: [{name, type, args?}]}` for object/interface/input |
| `sdl_find_type` | SDL + name → type block summary or not found |
| `sdl_lint_lite` | missing Query/Mutation roots, duplicate names, empty bodies, reserved clashes → `{findings[]}` |

## Limits

- Pasted SDL you already have. No sockets, DNS, or remote fetches.
- Input capped at ~1MB (`1048576` characters).
- **Not** a full GraphQL parser: no executable documents, no full directive/@args fidelity, no `extend type` merge, no schema `{ query: ... }` root mapping beyond named `Query`/`Mutation` types.
- Field type refs are token-scanned (`[Type!]!` style); exotic default-value expressions may be incomplete.
- Reserved-name checks cover built-in scalars and `__*` introspection types.

## Start

```bash
node /workspace/graphql-sdl-lab/dist/bundle.js
```

Local plugin install: `~/.cursor/plugins/local/graphql-sdl-lab`

## Skills

- **sdl-parse** — parse types / fields / find a type from pasted SDL
- **sdl-lint** — lite heuristic findings on pasted SDL

## License

MIT © Lawrence Hutchins — FREE
