# hey Lab

Zero-auth **local** MCP tools for scanning pasted **hey** shell/scripts: target URL listings (`hey ... https://...`, `-m POST`, trailing URL args), option hints (`-n` / `-c` / `-q` / `-z` / `-t` / `-m` / `-H` / `-D` / `-d` / `-T` / `-a` / `-x` / `-h2` / `-disable-keepalive`), output / summary counts (`-o` / `-csv` / `summary` / `latency` / `Requests/sec` / `Status code distribution`), and lite lint. Lite scanner (same family as vegeta-lab / autocannon-lab / locust-lab / artillery-lab / k6-script-lab) — **never runs hey or executes load tests**, no network.

This is **not** the hey CLI or a load-test runtime. Documented heuristics only. Users may paste source that references `hey` — this plugin does not depend on or execute that binary.

## Tools

| Tool | Purpose |
|------|---------|
| `hey_targets_list` | `hey ... https://...` / `-m POST` / trailing URL args → `[{url?, method?}]` |
| `hey_options_hint` | `-n` / `-c` / `-q` / `-z` / `-t` / `-m` / `-H` / `-D` / `-d` / `-T` / `-a` / `-x` / `-h2` / `-disable-keepalive` → `[{method, count}]` |
| `hey_output_hint` | `-o` / `-csv` / `summary` / `latency` / `Requests/sec` / `Status code distribution` → `[{method, count}]` |
| `hey_lint_lite` | missing `-n`/`-z`, `-c >= -n`, http:// target, empty file, `-n` without `-c` → `{findings[]}` |

## Limits

- Pasted source text you already have. No sockets, DNS, remote fetches, hey execution, or load-test runs for tool logic.
- Input capped at ~1MB (`1048576` characters).
- **Lite only** — not a full AST. Supported loosely: `//`, `/* */`, and `#` comments stripped; simple `'/"/\`` string literals; common hey command / flag / output usage. Not supported / incomplete: spreads, imported helpers expanded, computed keys, dynamic `require`/`import`.
- Does not run hey or talk to a network.
- FREE MIT.

## Start

```bash
node /workspace/hey-lab/dist/bundle.js
```

Local plugin install: `~/.cursor/plugins/local/hey-lab`

## Skills

- **hey-targets** — list target URL/method definitions and option hints from pasted hey source
- **hey-lint** — output / summary listings + lite heuristic findings

## License

MIT © Lawrence Hutchins — FREE
