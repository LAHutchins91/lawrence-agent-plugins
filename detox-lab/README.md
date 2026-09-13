# Detox Lab

Zero-auth **local** MCP tools for scanning pasted **Detox** JS/TS: matcher call sites (`by.id` / `by.text` / `by.label` / `by.type` / `by.traits` / `element(by.`), action counts (`.tap` / `.longPress` / `.multiTap` / `.typeText` / …), sync/wait counts (`waitFor` / `toBeVisible` / `device.launchApp` / …), and lite lint. Lite JS/TS scanner (same family as appium-lab / selenium-pom-lab) — **never runs Detox or launches a device/emulator**, no network.

This is **not** the Detox CLI or Jest/React Native runtime. Documented heuristics only. Users may paste source that imports `detox` — this plugin does not depend on or execute that package.

## Tools

| Tool | Purpose |
|------|---------|
| `dx_matchers_list` | `by.id` / `by.text` / `by.label` / `by.type` / `by.traits` / `element(by.` → `[{method, arg?}]` |
| `dx_actions_hint` | `tap` / `longPress` / `multiTap` / `typeText` / `replaceText` / `clearText` / `scroll` / `scrollTo` / `swipe` / `setColumnToValue` / `setDatePickerDate` → `[{method, count}]` |
| `dx_sync_hint` | `waitFor` / `whileElement` / `withTimeout` / `toBeVisible` / `toExist` / `toHaveText` / `toHaveValue` / `detox.device.reloadReactNative` / `device.launchApp` → `[{method, count}]` |
| `dx_lint_lite` | hard sleeps / huge withTimeout / setTimeout-as-sync, missing waitFor, text-matcher-heavy, empty file, reloadReactNative in tests → `{findings[]}` |

## Limits

- Pasted source text you already have. No sockets, DNS, remote fetches, Detox execution, or device/emulator launch for tool logic.
- Input capped at ~1MB (`1048576` characters).
- **Lite JS/TS only** — not a full AST. Supported loosely: `//` and `/* */` comments stripped; simple `'/"/\`` string literals; common matcher / action / sync usage. Not supported / incomplete: spreads, imported helpers expanded, computed keys, dynamic `require`/`import`.
- Does not run Detox or talk to a network.
- FREE MIT.

## Start

```bash
node /workspace/detox-lab/dist/bundle.js
```

Local plugin install: `~/.cursor/plugins/local/detox-lab`

## Skills

- **dx-matchers** — list matcher call sites and action counts from pasted Detox source
- **dx-lint** — sync/wait counts + lite heuristic findings

## License

MIT © Lawrence Hutchins — FREE
