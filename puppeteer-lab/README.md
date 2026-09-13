# Puppeteer Lab

Zero-auth **local** MCP tools for **Puppeteer script JS/TS text**: page lifecycle inventory (`puppeteer.launch` / `browser.newPage` / `page.goto` / close), selector API hints (`click` / `type` / `$` / `$eval` / `waitForSelector`), wait hints, and heuristic lite lint. No Puppeteer binary. No browser runtime. No network.

## Why novel

No zero-auth local MCP in the catalog focuses on practical **Puppeteer script** workflows — listing pages/gotos, selector APIs, and waits plus educational smell heuristics without launching Chromium.

## Tools

| Tool | Purpose |
|------|---------|
| `pptr_pages_list` | source text → `{ pages, count }` |
| `pptr_selectors_hint` | source text → `{ selectors, count }` |
| `pptr_wait_hint` | source text → `{ waits, count }` |
| `pptr_lint_lite` | source text → `{ findings, findingCount }` |

## Caps & caveats

- **String analysis only** — never imports `puppeteer`, never opens files on disk or over the network, never evaluates script code, never launches a browser.
- Best-effort regex heuristics on `puppeteer.launch` / `browser.newPage` / `page.goto` / selector APIs / wait helpers (not a full JS/TS AST or Puppeteer runtime).
- Lint rules are educational heuristics (empty, `waitForTimeout` anti-pattern, missing `close`/`disconnect`, `networkidle` tips, headless defaults, etc.) — **not** an exploit guide.

## Start

```bash
node /workspace/puppeteer-lab/dist/bundle.js
```

Local plugin install: `~/.cursor/plugins/local/puppeteer-lab`

## Skills

- **pptr-pages-selectors** — page lifecycle list + selector API hints
- **pptr-waits-lint** — wait hints + lite lint

## License

MIT © Lawrence Hutchins
