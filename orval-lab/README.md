# Orval Lab

Zero-auth **local** MCP tools for scanning pasted **orval.config**.(js|ts|mjs): output target listings (`defineConfig` / `export default` / `output:` / `target:` / project keys), client counts (`axios` / `axios-functions` / `react-query` / `solid-query` / `vue-query` / `svelte-query` / `swr` / `fetch` / `angular`), hooks/mode hints (`override.mutator` / `hooks.afterAllFilesWrite` / `prettier` / `mock` / `mode: tags` / `mode: split` / `mode: single`), and lite lint. Lite scanner (same family as openapi-generator-lab / buf-lab) — **never runs orval or codegen, never fetches OpenAPI specs**, no network.

This is **not** the orval CLI or a codegen runtime. Documented heuristics only. Users may paste source that references `orval` — this plugin does not depend on or execute that binary.

## Tools

| Tool | Purpose |
|------|---------|
| `or_outputs_list` | `defineConfig` / `export default` / `output:` / `target:` / project keys → `[{name?, target?, client?}]` |
| `or_client_hint` | `client:` axios / axios-functions / react-query / solid-query / vue-query / svelte-query / swr / fetch / angular → `[{method, count}]` |
| `or_hooks_hint` | `override.mutator` / `hooks.afterAllFilesWrite` / `prettier` / `mock` / `mode: tags` / `mode: split` / `mode: single` → `[{method, count}]` |
| `or_lint_lite` | without `input.target`, without `output.target`, `http://` input, empty file, `mock: true` without msw → `{findings[]}` |

## Limits

- Pasted source text you already have. No sockets, DNS, remote fetches, orval execution, or codegen for tool logic.
- Input capped at ~1MB (`1048576` characters).
- **Lite only** — not a full JS/TS AST. Supported loosely: `//`, `/* */`, and `#` comments stripped; simple `'/"/\`` string literals; common orval.config keys. Not supported / incomplete: spreads, imported helpers, computed keys, remote spec fetch.
- Does not run orval or talk to a network.
- FREE MIT.

## Start

```bash
node /workspace/orval-lab/dist/bundle.js
```

Local plugin install: `~/.cursor/plugins/local/orval-lab`

## Skills

- **or-outputs** — list output targets and client hints from pasted orval.config
- **or-lint** — hooks/mode listings + lite heuristic findings

## License

MIT © Lawrence Hutchins — FREE
