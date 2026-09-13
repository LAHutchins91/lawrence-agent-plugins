# Playwright Config Lab

Zero-auth **local** MCP tools for scanning pasted `playwright.config.*` text: projects, browsers, webServer hints, and lite lint. Lite JS/TS config scanner only — no `playwright` / `@playwright/test` binary, no resolve/run, no network.

This is **not** the Playwright CLI and **not** a full AST (no Babel/TypeScript parser): common `defineConfig({ projects, use, webServer, fullyParallel, workers })` shapes are supported. Spreads are not fully expanded; `devices['…']` names map to engines via heuristics only.

## Tools

| Tool | Purpose |
|------|---------|
| `pw_projects_list` | → `{projects: [{name, browserName?}]}` from `projects: […]` |
| `pw_browsers_list` | → `{browsers: [chromium\|firefox\|webkit\|…]}` unique engines |
| `pw_webserver_hint` | → `{webServers: [{command?, url?, reuseExistingServer?}]}` |
| `pw_lint_lite` | missing `baseURL` with `webServer`, trace/screenshot off, no projects/browserName, serial+high workers → `{findings[]}` |

## Limits

- Pasted `playwright.config.*` text you already have. No sockets, DNS, remote fetches, or Playwright CLI (`npx playwright` never run).
- Input capped at ~1MB (`1048576` characters).
- **Lite JS/TS scanner**: `//` and `/* */` comments stripped loosely; simple `'…'` / `"…"` / `` `…` `` strings; labeled keys only when written literally. Not a full language parser — no AST, no spreads resolved, no imported values.
- `devices['Desktop Chrome']` → `chromium` (and similar name heuristics); does not load `@playwright/test` device presets.
- `reuseExistingServer: !process.env.CI` expressions are **not** evaluated — only `true`/`false` literals.
- Unusual formatting may be missed. Documented heuristics only — not `playwright test --config`.
- FREE MIT.

## Start

```bash
node /workspace/playwright-config-lab/dist/bundle.js
```

Local plugin install: `~/.cursor/plugins/local/playwright-config-lab`

## Skills

- **pw-projects** — list projects, browsers, and webServer hints from pasted config
- **pw-lint** — lite heuristic findings on pasted playwright config

## License

MIT © Lawrence Hutchins — FREE
