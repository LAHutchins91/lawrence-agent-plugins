# WebdriverIO Lab

Zero-auth **local** MCP tools for **WebdriverIO JS/TS text**: Mocha-style specs inventory (`describe` / `it` / hooks or config `specs:`), selector hints (`$` / `$$` / `browser.$` / `custom$`), common `browser.` / `element.` command hints, and heuristic lite lint. No WebdriverIO runtime. No browser/WebDriver. No network.

## Why novel

No zero-auth local MCP in the catalog focuses on practical **WebdriverIO** workflows — listing specs/hooks, `$`/`$$` selectors, and browser/element commands plus educational smell heuristics without launching a driver.

## Tools

| Tool | Purpose |
|------|---------|
| `wdio_specs_list` | source text → `{ specs, count }` |
| `wdio_selectors_hint` | source text → `{ selectors, count }` |
| `wdio_commands_hint` | source text → `{ commands, count }` |
| `wdio_lint_lite` | source text → `{ findings, findingCount }` |

## Caps & caveats

- **String analysis only** — never imports `webdriverio`/`@wdio/*`, never opens files on disk or over the network, never evaluates script code, never launches a browser/driver.
- Best-effort regex heuristics on Mocha `describe`/`it`/hooks, config `specs:`, `$`/`$$`/`browser.$`, and common WDIO APIs (not a full JS/TS AST or WDIO runtime).
- Lint rules are educational heuristics (empty, `browser.pause` anti-pattern, XPath overuse, missing `waitUntil`, sync mode deprecated tip, etc.) — **not** an exploit guide.

## Start

```bash
node /workspace/webdriverio-lab/dist/bundle.js
```

Local plugin install: `~/.cursor/plugins/local/webdriverio-lab`

## Skills

- **wdio-specs-selectors** — specs/hooks list + selector API hints
- **wdio-commands-lint** — command hints + lite lint

## License

MIT © Lawrence Hutchins
