# Nock Lab

Zero-auth **local** MCP tools for scanning pasted **nock** JS/TS: scope inventory (`nock('https://…')`), intercept method counts (`.get` / `.post` / `.put` / `.delete` / `.patch` / `.head` / `.options`), persist/times hints, and lite lint. Lite JS/TS scanner (same family as ow-lab / msw-handler-lab) — **never activates nock interceptors**, no HTTP mocking runtime, no network.

This is **not** the nock library. Documented heuristics only.

## Tools

| Tool | Purpose |
|------|---------|
| `nock_scopes_list` | `nock('https://…')` → `[{baseUrl}]` |
| `nock_intercepts_hint` | `.get` / `.post` / `.put` / `.delete` / `.patch` / `.head` / `.options` → `[{method, count}]` |
| `nock_persist_hint` | `.persist` / `.times` / `.once` / `.twice` counts → `[{method, count}]` |
| `nock_lint_lite` | missing `nock.cleanAll`/`restore`, persist without times caution, empty intercepts, reply without status → `{findings[]}` |

## Limits

- Pasted source text you already have. No sockets, DNS, remote fetches, or nock interceptor activation for tool logic (never mock HTTP).
- Input capped at ~1MB (`1048576` characters).
- **Lite JS/TS only** — not a full AST. Supported loosely: `//` and `/* */` comments stripped; simple `'/"/\`` string literals; common `nock(…)` scopes / intercept / persist usage. Not supported / incomplete: spreads, imported helper scopes expanded, computed keys, dynamic `require`/`import`.
- Does not activate interceptors, make real HTTP, or talk to a network.
- FREE MIT.

## Start

```bash
node /workspace/nock-lab/dist/bundle.js
```

Local plugin install: `~/.cursor/plugins/local/nock-lab`

## Skills

- **nock-scopes** — list scopes and intercept counts from pasted nock source
- **nock-lint** — persist/times hints + lite heuristic findings

## License

MIT © Lawrence Hutchins — FREE
