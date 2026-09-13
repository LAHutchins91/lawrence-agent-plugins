# Kiwi Lab

Zero-auth **local** MCP tools for scanning pasted **kiwi.config** / OpenAPI client-generator style configs (`kiwi` / `@kiwibird` / `kiwi-openapi` patterns): schema path/URL listings (`input` / `schema` / `openapi` / `spec`), client counts (`axios` / `fetch` / `ky` / `got` / `react-query` / `swr` / `graphql`), hooks hints (`hooks` / `mutator` / `transformer` / `afterGenerate` / `prettier` / `eslint`), and lite lint. Lite scanner (same family as orval-lab / openapi-generator-lab) — **never runs kiwi or codegen, never fetches OpenAPI specs**, no network.

This is **not** a kiwi CLI or a codegen runtime. Documented heuristics only. Users may paste source that references kiwi-style configs — this plugin does not depend on or execute that binary.

## Tools

| Tool | Purpose |
|------|---------|
| `kw_schemas_list` | `input` / `schema` / `openapi` / `spec` fields → `[{path?, url?}]` |
| `kw_clients_hint` | client kinds axios / fetch / ky / got / react-query / swr / graphql → `[{method, count}]` |
| `kw_hooks_hint` | hooks / mutator / transformer / afterGenerate / prettier / eslint → `[{method, count}]` |
| `kw_lint_lite` | without input/schema/spec, without output/target, `http://` schema URL, empty file, client without baseUrl → `{findings[]}` |

## Limits

- Pasted source text you already have. No sockets, DNS, remote fetches, kiwi execution, or codegen for tool logic.
- Input capped at ~1MB (`1048576` characters).
- **Lite only** — not a full JS/TS AST. Supported loosely: `//`, `/* */`, and `#` comments stripped; simple `'/"/\`` string literals; common kiwi.config / OpenAPI client keys. Not supported / incomplete: spreads, imported helpers, computed keys, remote spec fetch.
- Does not run kiwi or talk to a network.
- FREE MIT.

## Start

```bash
node /workspace/kiwi-lab/dist/bundle.js
```

Local plugin install: `~/.cursor/plugins/local/kiwi-lab`

## Skills

- **kw-schemas** — list OpenAPI schema paths/URLs and client hints from pasted kiwi.config
- **kw-lint** — hooks listings + lite heuristic findings

## License

MIT © Lawrence Hutchins — FREE
