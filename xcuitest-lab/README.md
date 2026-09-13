# XCUITest Lab

Zero-auth **local** MCP tools for scanning pasted **XCUITest** Swift/ObjC-ish source: query call sites (`app.buttons["…"]` / `staticTexts` / `textFields` / `otherElements` / `cells` / `tables` / `navigationBars` / `element(matching:)` / `descendants(matching:)` / `identifier` / `label` / `value`), action counts (`.tap` / `.doubleTap` / `.swipeLeft` / `.typeText` / …), expectation counts (`XCTAssert` / `waitForExistence` / `XCTWaiter` / …), and lite lint. Lite Swift/ObjC-ish scanner (same family as detox-lab / appium-lab) — **never runs XCUITest or launches Xcode/simulator**, no network.

This is **not** XCTest/XCUITest runtime or Xcode. Documented heuristics only. Users may paste source that imports XCTest — this plugin does not depend on or execute that framework.

## Tools

| Tool | Purpose |
|------|---------|
| `xcui_queries_list` | `buttons` / `staticTexts` / `textFields` / `otherElements` / `cells` / `tables` / `navigationBars` / `element(matching:)` / `descendants(matching:)` / `identifier` / `label` / `value` → `[{method, arg?}]` |
| `xcui_actions_hint` | `tap` / `doubleTap` / `press` / `swipeLeft` / `swipeRight` / `swipeUp` / `swipeDown` / `typeText` / `clearText` / `adjustToPickerWheelValue` / `pinch` / `rotate` → `[{method, count}]` |
| `xcui_expectations_hint` | `XCTAssert` / `XCTAssertEqual` / `XCTAssertTrue` / `waitForExistence` / `expectation` / `XCTNSPredicateExpectation` / `XCTWaiter` / `exists` / `isHittable` → `[{method, count}]` |
| `xcui_lint_lite` | hard sleeps, missing wait, label-query-heavy, empty file, force unwrap after query → `{findings[]}` |

## Limits

- Pasted source text you already have. No sockets, DNS, remote fetches, XCUITest execution, or Xcode/simulator launch for tool logic.
- Input capped at ~1MB (`1048576` characters).
- **Lite Swift/ObjC-ish only** — not a full AST. Supported loosely: `//` and `/* */` comments stripped (optional leading-`#` line comments); simple `'/"/` string literals; common query / action / expectation usage. Not supported / incomplete: macros, imported helpers expanded, computed subscripts, dynamic selectors.
- Does not run XCUITest or talk to a network.
- FREE MIT.

## Start

```bash
node /workspace/xcuitest-lab/dist/bundle.js
```

Local plugin install: `~/.cursor/plugins/local/xcuitest-lab`

## Skills

- **xcui-queries** — list query call sites and action counts from pasted XCUITest source
- **xcui-lint** — expectation counts + lite heuristic findings

## License

MIT © Lawrence Hutchins — FREE
