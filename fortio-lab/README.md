# Fortio Lab

Zero-auth **local** MCP tools for scanning pasted **Fortio** shell/scripts: target URL listings (`fortio load` / `fortio curl` / `fortio echo`, `-url`, `http(s)://`), QPS hints (`-qps` / `-c` / `-t` / `-n` / `-r` / `-p` / `-H` / `-payload` / `-keepalive` / `-a`), percentile / histogram counts (`-json` / `-p` / `Percentile` / `p50` / `p75` / `p90` / `p99` / `p999` / `histogram` / `All done`), and lite lint. Lite scanner (same family as ab-lab / hey-lab / vegeta-lab / autocannon-lab / locust-lab / artillery-lab / k6-script-lab) — **never runs Fortio or executes load tests**, no network.

This is **not** the Fortio CLI or a load-test runtime. Documented heuristics only. Users may paste source that references `fortio` — this plugin does not depend on or execute that binary.

## Tools

| Tool | Purpose |
|------|---------|
| `ft_targets_list` | `fortio load` / `curl` / `echo`, `-url`, `http(s)://` → `[{url?, mode?}]` |
| `ft_qps_hint` | `-qps` / `-c` / `-t` / `-n` / `-r` / `-p` / `-H` / `-payload` / `-keepalive` / `-a` → `[{method, count}]` |
| `ft_percentiles_hint` | `-json` / `-p` / `Percentile` / `p50` / `p75` / `p90` / `p99` / `p999` / `histogram` / `All done` → `[{method, count}]` |
| `ft_lint_lite` | missing `-qps`/`-n`, high `-c` without `-qps`, http:// target, empty file, load without `-t` → `{findings[]}` |

## Limits

- Pasted source text you already have. No sockets, DNS, remote fetches, Fortio execution, or load-test runs for tool logic.
- Input capped at ~1MB (`1048576` characters).
- **Lite only** — not a full AST. Supported loosely: `//`, `/* */`, and `#` comments stripped; simple `'/"/\`` string literals; common Fortio command / flag / output usage. Not supported / incomplete: spreads, imported helpers expanded, computed keys, dynamic `require`/`import`.
- Does not run Fortio or talk to a network.
- FREE MIT.

## Start

```bash
node /workspace/fortio-lab/dist/bundle.js
```

Local plugin install: `~/.cursor/plugins/local/fortio-lab`

## Skills

- **ft-targets** — list target URL/mode definitions and QPS hints from pasted Fortio source
- **ft-lint** — percentile / histogram listings + lite heuristic findings

## License

MIT © Lawrence Hutchins — FREE
