# Artillery Lab

Zero-auth **local** MCP tools for scanning pasted **Artillery** YAML/JS scripts: scenario / flow listings (`scenarios:` / `scenario:` / `flow:` / `name:`), phase hints (`duration` / `arrivalRate` / `arrivalCount` / `rampTo` / `maxVusers` / `pause`), plugin / engine counts (`ensure` / `expect` / `metrics-by-endpoint` / `publish-metrics` / `apdex` / `playwright` / `socketio` / `ws`), and lite lint. Lite YAML/JS scanner (same family as k6-script-lab / detox-lab) — **never runs Artillery or executes load tests**, no network.

This is **not** the Artillery CLI or a load-test runtime. Documented heuristics only. Users may paste source that references `artillery` — this plugin does not depend on or execute that package.

## Tools

| Tool | Purpose |
|------|---------|
| `art_scenarios_list` | `scenarios:` / `scenario:` + `name:` / `flow:` → `[{name?, flowSteps?}]` |
| `art_phases_hint` | `duration` / `arrivalRate` / `arrivalCount` / `rampTo` / `maxVusers` / `pause` → `[{kind?, detail?}]` |
| `art_plugins_hint` | `ensure` / `expect` / `metrics-by-endpoint` / `publish-metrics` / `apdex` / `playwright` / `socketio` / `ws` → `[{name, count}]` |
| `art_lint_lite` | missing phases, http without expect/ensure, high arrivalRate without maxVusers, empty file, target http:// → `{findings[]}` |

## Limits

- Pasted source text you already have. No sockets, DNS, remote fetches, Artillery execution, or load-test runs for tool logic.
- Input capped at ~1MB (`1048576` characters).
- **Lite YAML/JS only** — not a full AST. Supported loosely: `//` and `/* */` and YAML `#` comments stripped; simple `'/"/\`` string literals; common config / phases / scenarios / flow / plugins usage. Not supported / incomplete: spreads, imported helpers expanded, computed keys, dynamic `require`/`import`.
- Does not run Artillery or talk to a network.
- FREE MIT.

## Start

```bash
node /workspace/artillery-lab/dist/bundle.js
```

Local plugin install: `~/.cursor/plugins/local/artillery-lab`

## Skills

- **art-scenarios** — list scenario/flow definitions and phase hints from pasted Artillery source
- **art-lint** — plugin/engine listings + lite heuristic findings

## License

MIT © Lawrence Hutchins — FREE
