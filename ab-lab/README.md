# ApacheBench Lab

Zero-auth **local** MCP tools for scanning pasted **ApacheBench (`ab`)** shell/scripts: target URL listings (`ab ... http(s)://...`, `-p` POST body file implying POST), option hints (`-n` / `-c` / `-t` / `-p` / `-T` / `-H` / `-A` / `-P` / `-X` / `-k` / `-g` / `-e` / `-r` / `-s` / `-w`), concurrency / summary counts (`-n` / `-c` / `-t` / `-k` / `Requests per second` / `Time per request`), and lite lint. Lite scanner (same family as hey-lab / vegeta-lab / autocannon-lab / locust-lab / artillery-lab / k6-script-lab) — **never runs ab or executes load tests**, no network.

This is **not** the ApacheBench CLI or a load-test runtime. Documented heuristics only. Users may paste source that references `ab` — this plugin does not depend on or execute that binary.

## Tools

| Tool | Purpose |
|------|---------|
| `ab_targets_list` | `ab ... http(s)://...` / `-p` POST body → `[{url?, method?}]` |
| `ab_options_hint` | `-n` / `-c` / `-t` / `-p` / `-T` / `-H` / `-A` / `-P` / `-X` / `-k` / `-g` / `-e` / `-r` / `-s` / `-w` → `[{method, count}]` |
| `ab_concurrency_hint` | `-n` / `-c` / `-t` / `-k` / `Requests per second` / `Time per request` → `[{method, count}]` |
| `ab_lint_lite` | missing `-n`/`-t`, `-c >= -n`, http:// target, empty file, high `-n` without `-k` → `{findings[]}` |

## Limits

- Pasted source text you already have. No sockets, DNS, remote fetches, ab execution, or load-test runs for tool logic.
- Input capped at ~1MB (`1048576` characters).
- **Lite only** — not a full AST. Supported loosely: `//`, `/* */`, and `#` comments stripped; simple `'/"/\`` string literals; common ab command / flag / output usage. Not supported / incomplete: spreads, imported helpers expanded, computed keys, dynamic `require`/`import`.
- Does not run ab or talk to a network.
- FREE MIT.

## Start

```bash
node /workspace/ab-lab/dist/bundle.js
```

Local plugin install: `~/.cursor/plugins/local/ab-lab`

## Skills

- **ab-targets** — list target URL/method definitions and option hints from pasted ab source
- **ab-lint** — concurrency / summary listings + lite heuristic findings

## License

MIT © Lawrence Hutchins — FREE
