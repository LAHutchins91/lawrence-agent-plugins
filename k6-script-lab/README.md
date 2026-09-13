# k6 Script Lab

Zero-auth **local** MCP tools for scanning pasted **k6** JS scripts: scenario / executor definitions (`scenarios{}` with `constant-vus` / `ramping-vus` / `per-vu-iterations` / `shared-iterations` / `constant-arrival-rate` / `ramping-arrival-rate` / `externally-controlled`), check / group / http counts, thresholds (`http_req_duration` / `http_req_failed` / `checks` / custom Rate/Trend/Counter), and lite lint. Lite JS scanner (same family as detox-lab / xcuitest-lab) — **never runs k6 or executes load tests**, no network.

This is **not** the k6 binary or a load-test runtime. Documented heuristics only. Users may paste source that imports `k6` — this plugin does not depend on or execute that package.

## Tools

| Tool | Purpose |
|------|---------|
| `k6_scenarios_list` | `scenarios{}` keys + executor types → `[{name?, executor?}]` |
| `k6_checks_hint` | `check` / `group` / `fail` / `http.get` / `http.post` / `http.put` / `http.del` / `http.request` → `[{method, count}]` |
| `k6_thresholds_hint` | `thresholds{}` (`http_req_duration` / `http_req_failed` / `checks` / custom Rate/Trend/Counter) → `[{metric?, expr?}]` |
| `k6_lint_lite` | missing thresholds, sleep-only pacing, http without check, empty file, insecureSkipTLSVerify → `{findings[]}` |

## Limits

- Pasted source text you already have. No sockets, DNS, remote fetches, k6 execution, or load-test runs for tool logic.
- Input capped at ~1MB (`1048576` characters).
- **Lite JS only** — not a full AST. Supported loosely: `//` and `/* */` comments stripped; simple `'/"/\`` string literals; common options / scenarios / thresholds / check / http usage. Not supported / incomplete: spreads, imported helpers expanded, computed keys, dynamic `require`/`import`.
- Does not run k6 or talk to a network.
- FREE MIT.

## Start

```bash
node /workspace/k6-script-lab/dist/bundle.js
```

Local plugin install: `~/.cursor/plugins/local/k6-script-lab`

## Skills

- **k6-scenarios** — list scenario/executor definitions and check/http counts from pasted k6 source
- **k6-lint** — thresholds listings + lite heuristic findings

## License

MIT © Lawrence Hutchins — FREE
