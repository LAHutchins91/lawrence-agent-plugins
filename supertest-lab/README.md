# Supertest Lab

Zero-auth **local** MCP tools for scanning pasted **Supertest** JS/TS: request method counts (`request(app).get` / `.post` / `.put` / `.delete` / `.patch`), expect hints (`.expect(status)` / `.expect('Content-Type'…)`), auth hints (`.set('Authorization'…)` / `.auth(`), and lite lint. Lite JS/TS scanner (same family as nock-lab / msw-handler-lab) — **never sends HTTP**, no network. Never echoes bearer token values.

This is **not** the Supertest library. Documented heuristics only.

## Tools

| Tool | Purpose |
|------|---------|
| `st_requests_list` | `request(app).get` / `.post` / `.put` / `.delete` / `.patch` → `[{method, count}]` |
| `st_expects_hint` | `.expect(status)` / `.expect('Content-Type'…)` → `[{kind, count}]` |
| `st_auth_hint` | `.set('Authorization'…)` / `.auth(` counts → `[{method, count}]` (tokens redacted) |
| `st_lint_lite` | request without expect, missing await, hard-coded bearer caution (redact), empty file → `{findings[]}` |

## Limits

- Pasted source text you already have. No sockets, DNS, remote fetches, or real HTTP for tool logic.
- Input capped at ~1MB (`1048576` characters).
- **Lite JS/TS only** — not a full AST. Supported loosely: `//` and `/* */` comments stripped; simple `'/"/\`` string literals; common `request(…)` / `.expect` / auth usage. Not supported / incomplete: spreads, imported helpers expanded, computed keys, dynamic `require`/`import`.
- Does not send HTTP or talk to a network. Bearer token values are never echoed.
- FREE MIT.

## Start

```bash
node /workspace/supertest-lab/dist/bundle.js
```

Local plugin install: `~/.cursor/plugins/local/supertest-lab`

## Skills

- **st-requests** — list request method counts and expect hints from pasted Supertest source
- **st-lint** — auth hints + lite heuristic findings (tokens redacted)

## License

MIT © Lawrence Hutchins — FREE
