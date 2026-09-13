# Playwright POM Lab

Zero-auth **local** MCP tools for scanning pasted **Playwright** POM JS/TS: Page Object / class-style page definitions, locator counts (`getByRole` / `getByText` / … / `.locator(` / `page.locator`), fixture counts (`test.extend` / `beforeEach` / `describe` / `expect`), and lite lint. Lite JS/TS scanner (same family as enzyme-lab / jest-mock-lab) — **never runs Playwright or launches a browser**, no network.

This is **not** the Playwright test runner. Documented heuristics only. Users may paste source that imports `@playwright/test` — this plugin does not depend on or execute those packages.

## Tools

| Tool | Purpose |
|------|---------|
| `pw_pages_list` | Page/POM classes and `export const *Page` helpers → `[{name?, kind}]` |
| `pw_locators_hint` | `getByRole` / `getByText` / `getByTestId` / `getByLabel` / `getByPlaceholder` / `.locator(` / `page.locator` → `[{method, count}]` |
| `pw_fixtures_hint` | `test.extend` / `test.beforeEach` / `test.afterEach` / `test.describe` / `expect(` → `[{method, count}]` |
| `pw_lint_lite` | hard waits, CSS-heavy selectors, missing await, empty file, networkidle → `{findings[]}` |

## Limits

- Pasted source text you already have. No sockets, DNS, remote fetches, Playwright execution, or browser launch for tool logic.
- Input capped at ~1MB (`1048576` characters).
- **Lite JS/TS only** — not a full AST. Supported loosely: `//` and `/* */` comments stripped; simple `'/"/\`` string literals; common POM / getBy* / fixture usage. Not supported / incomplete: spreads, imported helpers expanded, computed keys, dynamic `require`/`import`.
- Does not run Playwright or talk to a network.
- FREE MIT.

## Start

```bash
node /workspace/playwright-pom-lab/dist/bundle.js
```

Local plugin install: `~/.cursor/plugins/local/playwright-pom-lab`

## Skills

- **pw-pages** — list Page/POM definitions and locator counts from pasted Playwright source
- **pw-lint** — fixture counts + lite heuristic findings

## License

MIT © Lawrence Hutchins — FREE
