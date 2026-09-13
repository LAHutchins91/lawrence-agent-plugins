# Vegeta Lab

Zero-auth **local** MCP tools for scanning pasted **Vegeta** shell/Go/targets scripts: target listings (`GET`/`POST`/`PUT`/`DELETE` lines, `NewStaticTargeter`, `Method`/`URL`), rate / pacer hints (`Rate` / `ConstantPacer` / `ConstantArrivalRate` / `-rate` / `-duration` / `-connections` / `-workers` / `-timeout` / `attack`), report / encode counts (`report` / `encode` / `NewDecoder` / `NewEncoder` / `-output` / `plot` / `hdrplot` / `json` / `hist`), and lite lint. Lite scanner (same family as autocannon-lab / locust-lab / artillery-lab / k6-script-lab) — **never runs Vegeta or executes load tests**, no network.

This is **not** the Vegeta CLI or a load-test runtime. Documented heuristics only. Users may paste source that references `vegeta` — this plugin does not depend on or execute that binary.

## Tools

| Tool | Purpose |
|------|---------|
| `veg_targets_list` | `GET`/`POST`/`PUT`/`DELETE` lines / `NewStaticTargeter` / `Method`/`URL` → `[{method?, url?}]` |
| `veg_rates_hint` | `Rate` / `ConstantPacer` / `ConstantArrivalRate` / `-rate` / `-duration` / `-connections` / `-workers` / `-timeout` / `attack` → `[{method, count}]` |
| `veg_reports_hint` | `report` / `encode` / `NewDecoder` / `NewEncoder` / `-output` / `plot` / `hdrplot` / `json` / `hist` → `[{method, count}]` |
| `veg_lint_lite` | missing rate/pacer, missing duration, http:// target, empty file, attack without report → `{findings[]}` |

## Limits

- Pasted source text you already have. No sockets, DNS, remote fetches, Vegeta execution, or load-test runs for tool logic.
- Input capped at ~1MB (`1048576` characters).
- **Lite only** — not a full AST. Supported loosely: `//`, `/* */`, and `#` comments stripped; simple `'/"/\`` string literals; common Vegeta target / attack / report usage. Not supported / incomplete: spreads, imported helpers expanded, computed keys, dynamic `require`/`import`.
- Does not run Vegeta or talk to a network.
- FREE MIT.

## Start

```bash
node /workspace/vegeta-lab/dist/bundle.js
```

Local plugin install: `~/.cursor/plugins/local/vegeta-lab`

## Skills

- **veg-targets** — list target Method/URL definitions and rate/pacer hints from pasted Vegeta source
- **veg-lint** — report / encode listings + lite heuristic findings

## License

MIT © Lawrence Hutchins — FREE
