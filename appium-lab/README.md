# Appium Lab

Zero-auth **local** MCP tools for scanning pasted **Appium** JS/TS/JSON-ish: capability keys (`platformName` / `deviceName` / `app` / …), locator counts (`By.accessibilityId` / `accessibility id` / `-ios predicate` / `-android uiautomator` / `xpath` / `id` / `class name` / `MobileBy` / `findElement` / `findElements` / `` $` `` / `$$`), gesture counts (`touchAction` / `performActions` / `swipe` / …), and lite lint. Lite JS/TS scanner (same family as selenium-pom-lab / playwright-pom-lab) — **never runs Appium or launches a device/emulator/WebDriver**, no network.

This is **not** the Appium server or WebDriverIO runtime. Documented heuristics only. Users may paste source that imports `webdriverio` / `appium` — this plugin does not depend on or execute those packages.

## Tools

| Tool | Purpose |
|------|---------|
| `ap_caps_list` | Capability / desiredCapability keys → `[{key, value?}]` |
| `ap_locators_hint` | `By.accessibilityId` / `accessibility id` / `-ios predicate` / `-android uiautomator` / `xpath` / `id` / `class name` / `MobileBy` / `findElement` / `findElements` / `` $` `` / `$$` → `[{method, count}]` |
| `ap_gestures_hint` | `touchAction` / `performActions` / `swipe` / `scroll` / `tap` / `longPress` / `dragAndDrop` / `multiTouch` → `[{method, count}]` |
| `ap_lint_lite` | hard sleeps, XPath-heavy locators, missing platformName, empty file, deprecated touchAction → `{findings[]}` |

## Limits

- Pasted source text you already have. No sockets, DNS, remote fetches, Appium execution, or device/emulator/WebDriver launch for tool logic.
- Input capped at ~1MB (`1048576` characters).
- **Lite JS/TS only** — not a full AST. Supported loosely: `//` and `/* */` comments stripped; simple `'/"/\`` string literals; common capabilities / locator / gesture usage. Not supported / incomplete: spreads, imported helpers expanded, computed keys, dynamic `require`/`import`.
- Does not run Appium or talk to a network.
- FREE MIT.

## Start

```bash
node /workspace/appium-lab/dist/bundle.js
```

Local plugin install: `~/.cursor/plugins/local/appium-lab`

## Skills

- **ap-caps** — list capability keys and locator counts from pasted Appium source
- **ap-lint** — gesture counts + lite heuristic findings

## License

MIT © Lawrence Hutchins — FREE
