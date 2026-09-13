# Autocannon Lab

Zero-auth **local** MCP tools for scanning pasted **autocannon** JS scripts: target URL / title listings (`autocannon(` / `autocannon.track(` / `url:` / `title:`), options hints (`connections` / `duration` / `amount` / `pipelining` / `workers` / `timeout` / `headers` / `method` / `body` / `bailout` / `overallRate`), metrics / handler counts (`latency` / `requests` / `throughput` / `errors` / `timeouts` / `non2xx` / `2xx` / `statusCodeStats` / `on('done'` / `.then(result`), and lite lint. Lite JS scanner (same family as locust-lab / artillery-lab / k6-script-lab) — **never runs autocannon or executes load tests**, no network.

This is **not** the autocannon CLI or a load-test runtime. Documented heuristics only. Users may paste source that references `autocannon` — this plugin does not depend on or execute that package.

## Tools

| Tool | Purpose |
|------|---------|
| `ac_targets_list` | `autocannon(` / `autocannon.track(` / `url:` / `title:` → `[{url?, title?}]` |
| `ac_options_hint` | `connections` / `duration` / `amount` / `pipelining` / `workers` / `timeout` / `headers` / `method` / `body` / `bailout` / `overallRate` → `[{method, count}]` |
| `ac_metrics_hint` | `latency` / `requests` / `throughput` / `errors` / `timeouts` / `non2xx` / `2xx` / `statusCodeStats` / `on('done'` / `.then(result` → `[{method, count}]` |
| `ac_lint_lite` | missing duration/amount, high connections without workers, http:// target, empty file, no result handler → `{findings[]}` |

## Limits

- Pasted source text you already have. No sockets, DNS, remote fetches, autocannon execution, or load-test runs for tool logic.
- Input capped at ~1MB (`1048576` characters).
- **Lite JS only** — not a full AST. Supported loosely: `//` and `/* */` comments stripped; simple `'/"/\`` string literals; common autocannon( / options / metrics usage. Not supported / incomplete: spreads, imported helpers expanded, computed keys, dynamic `require`/`import`.
- Does not run autocannon or talk to a network.
- FREE MIT.

## Start

```bash
node /workspace/autocannon-lab/dist/bundle.js
```

Local plugin install: `~/.cursor/plugins/local/autocannon-lab`

## Skills

- **ac-targets** — list target URL/title definitions and options hints from pasted autocannon source
- **ac-lint** — metrics / handler listings + lite heuristic findings

## License

MIT © Lawrence Hutchins — FREE
