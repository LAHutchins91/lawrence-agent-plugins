# MSW Handler Lab

Zero-auth **local** MCP tools for **MSW handler JS/TS text**: handler inventory (`http.*` / `rest.*` / `graphql.*`), method counts, fixture hints (`HttpResponse` / `ctx.*`), and heuristic lite lint. No `msw` runtime. No network.

## Why novel

No zero-auth local MCP in the catalog focuses on practical **Mock Service Worker** handler workflows — listing handlers/methods/fixtures and educational smell heuristics without importing `msw` or starting a worker/server.

## Tools

| Tool | Purpose |
|------|---------|
| `msw_handlers_list` | source text → `{ handlers, count }` |
| `msw_methods_hint` | source text → `{ methods, total }` |
| `msw_fixtures_hint` | source text → `{ fixtures, count }` |
| `msw_lint_lite` | source text → `{ findings, findingCount }` |

## Caps & caveats

- **String analysis only** — never imports msw, never opens files on disk or over the network, never evaluates handler code.
- Best-effort regex heuristics on `http.*` / `rest.*` / `graphql.*` / `HttpResponse` / `ctx.*` (not a full JS/TS AST or msw runtime).
- Lint rules are educational heuristics (empty, missing setupWorker/setupServer tip, wildcard path overuse, passthrough tips, etc.) — **not** an exploit guide.

## Start

```bash
node /workspace/msw-handler-lab/dist/bundle.js
```

Local plugin install: `~/.cursor/plugins/local/msw-handler-lab`

## Skills

- **msw-handlers-methods** — handler list + method counts
- **msw-fixtures-lint** — fixture hints + lite lint

## License

MIT © Lawrence Hutchins
