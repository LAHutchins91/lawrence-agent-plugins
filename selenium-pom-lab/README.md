# Selenium POM Lab

Zero-auth **local** MCP tools for scanning pasted **Selenium** POM JS/TS: Page Object / class-style page definitions, locator counts (`By.id` / `By.css` / `By.xpath` / … / `findElement` / `findElements`), wait counts (`WebDriverWait` / `until` / `ExpectedConditions` / `implicitlyWait` / `sleep` / …), and lite lint. Lite JS/TS scanner (same family as playwright-pom-lab / enzyme-lab) — **never runs Selenium or launches a WebDriver/browser**, no network.

This is **not** the Selenium WebDriver runtime. Documented heuristics only. Users may paste source that imports `selenium-webdriver` — this plugin does not depend on or execute those packages.

## Tools

| Tool | Purpose |
|------|---------|
| `sel_pages_list` | Page/POM classes and `export const *Page` helpers → `[{name?, kind}]` |
| `sel_locators_hint` | `By.id` / `By.css` / `By.xpath` / `By.name` / `By.className` / `By.linkText` / `By.partialLinkText` / `By.tagName` / `findElement` / `findElements` → `[{method, count}]` |
| `sel_waits_hint` | `WebDriverWait` / `until` / `ExpectedConditions` / `implicitlyWait` / `sleep` / `Thread.sleep` / `setTimeout` / `driver.sleep` → `[{method, count}]` |
| `sel_lint_lite` | hard sleeps, XPath-heavy locators, missing waits, empty file, implicit-wait-only → `{findings[]}` |

## Limits

- Pasted source text you already have. No sockets, DNS, remote fetches, Selenium execution, or browser/WebDriver launch for tool logic.
- Input capped at ~1MB (`1048576` characters).
- **Lite JS/TS only** — not a full AST. Supported loosely: `//` and `/* */` comments stripped; simple `'/"/\`` string literals; common POM / By.* / wait usage. Not supported / incomplete: spreads, imported helpers expanded, computed keys, dynamic `require`/`import`.
- Does not run Selenium or talk to a network.
- FREE MIT.

## Start

```bash
node /workspace/selenium-pom-lab/dist/bundle.js
```

Local plugin install: `~/.cursor/plugins/local/selenium-pom-lab`

## Skills

- **sel-pages** — list Page/POM definitions and locator counts from pasted Selenium source
- **sel-lint** — wait counts + lite heuristic findings

## License

MIT © Lawrence Hutchins — FREE
