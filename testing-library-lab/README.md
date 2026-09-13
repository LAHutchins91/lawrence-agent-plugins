# Testing Library Lab

Zero-auth **local** MCP tools for **Testing Library JS/TS text**: query inventory (`getBy*` / `queryBy*` / `findBy*` / `screen.*` / render helpers), event hints (`userEvent` / `fireEvent`), wait hints (`waitFor` / `findBy*`), and heuristic lite lint. No DOM. No `@testing-library/*` runtime. No network.

## Why novel

No zero-auth local MCP in the catalog focuses on practical **Testing Library** workflows — listing queries/events/waits and educational smell heuristics without importing DOM APIs or running tests.

## Tools

| Tool | Purpose |
|------|---------|
| `tl_queries_list` | source text → `{ queries, count }` |
| `tl_events_hint` | source text → `{ events, count }` |
| `tl_wait_hint` | source text → `{ waits, count }` |
| `tl_lint_lite` | source text → `{ findings, findingCount }` |

## Caps & caveats

- **String analysis only** — never imports `@testing-library/*`, never opens files on disk or over the network, never evaluates test code, never touches a DOM.
- Best-effort regex heuristics on `screen.getBy*` / `getByText` / `findBy*` / `queryBy*` / `userEvent.` / `fireEvent.` / `waitFor` (not a full JS/TS AST or Testing Library runtime).
- Lint rules are educational heuristics (empty, getBy* in async without findBy/waitFor tip, container queries overuse, missing cleanup tip, prefer userEvent over fireEvent, etc.) — **not** an exploit guide.

## Start

```bash
node /workspace/testing-library-lab/dist/bundle.js
```

Local plugin install: `~/.cursor/plugins/local/testing-library-lab`

## Skills

- **tl-queries-events** — query list + userEvent/fireEvent hints
- **tl-wait-lint** — waitFor/findBy hints + lite lint

## License

MIT © Lawrence Hutchins
