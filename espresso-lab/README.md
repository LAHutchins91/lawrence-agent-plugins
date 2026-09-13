# Espresso Lab

Zero-auth **local** MCP tools for **Espresso Java/Kotlin test text**: ViewMatchers inventory, ViewActions / `onView(...).perform(` hints, IdlingResource signals, and heuristic lite lint. No Android SDK. No Espresso instrumentation runtime. No network.

## Why novel

No zero-auth local MCP in the catalog focuses on practical **Espresso** UI-test workflows — listing `withId`/`withText`/`isDisplayed`/`allOf` matchers, `click`/`typeText`/`scrollTo` actions, idling-resource registration patterns, and educational smell heuristics without launching an emulator.

## Tools

| Tool | Purpose |
|------|---------|
| `es_matchers_list` | Espresso test text → `{ matchers: [{name}], count }` |
| `es_actions_hint` | Espresso test text → `{ actions: [{name}], count }` |
| `es_idling_hint` | Espresso test text → `{ idling: [{kind}], count }` |
| `es_lint_lite` | Espresso test text → `{ findings, findingCount }` |

## Caps & caveats

- **String analysis only** — never imports Android/Espresso runtime, never opens files on disk or over the network, never talks to a device/emulator, never evaluates or compiles Java/Kotlin.
- Best-effort regex heuristics on common Espresso shapes (`ViewMatchers.` / `ViewActions.` / `onView(...).perform(` / IdlingResource APIs). Not a full Espresso / Hamcrest AST or compiler.
- Lint rules are educational heuristics (empty, `Thread.sleep` antipattern tip, missing IdlingResource tip, `withId` overuse tip, etc.) — **not** an exploit guide.

## Start

```bash
node /workspace/espresso-lab/dist/bundle.js
```

Local plugin install: `~/.cursor/plugins/local/espresso-lab`

## Skills

- **es-matchers-actions** — matchers list + actions hints
- **es-idling-lint** — idling hints + lite lint

## License

MIT © Lawrence Hutchins
