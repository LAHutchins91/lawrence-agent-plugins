# AJV Schema Lab

Zero-auth **local** MCP tools for scanning pasted JSON Schema / AJV schema JSON: top-level `$id` / `title` / `type`, keyword counts, `$ref` inventory, and lite lint. **JSON.parse preferred** — **no AJV `compile`/`validate`**, no network, no remote `$ref` resolution.

This is **not** the AJV library. Documented heuristics only.

## Tools

| Tool | Purpose |
|------|---------|
| `ajv_schemas_list` | top-level `$id` / `title` / `type` (plus `$defs`/`definitions`) → `[{id?, title?, type?}]` |
| `ajv_keywords_hint` | `type` / `properties` / `required` / `additionalProperties` / `oneOf` / `anyOf` / `allOf` / `if` / `then` / `else` / `pattern` / `format` → `[{keyword, count}]` |
| `ajv_refs_hint` | `$ref` values → `[{ref}]` |
| `ajv_lint_lite` | missing `$schema`, `additionalProperties` missing on objects, empty `required`, draft mismatch heuristics → `{findings[]}` |

## Limits

- Pasted schema JSON text you already have. No sockets, DNS, remote fetches, or AJV runtime for tool logic (`Ajv.compile()` / `validate()` never run).
- Input capped at ~1MB (`1048576` characters).
- **JSON.parse preferred** — not a full meta-schema validator. Does not resolve `$ref`, does not load remote schemas, does not execute formats.
- FREE MIT.

## Start

```bash
node /workspace/ajv-schema-lab/dist/bundle.js
```

Local plugin install: `~/.cursor/plugins/local/ajv-schema-lab`

## Skills

- **ajv-keywords** — list schemas, keyword counts, and `$ref` values from pasted schema JSON
- **ajv-lint** — lite heuristic findings (not AJV validate)

## License

MIT © Lawrence Hutchins — FREE
