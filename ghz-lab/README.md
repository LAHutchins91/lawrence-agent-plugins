# ghz Lab

Zero-auth **local** MCP tools for scanning pasted **ghz** gRPC load shell/config: host/call target listings (`ghz --insecure host:port`, `--call` / `-n package.Service/Method`), proto hints (`-proto` / `--protoset` / `--proto` / `-i` / `--import-paths` / `-d` / `--data` / `-D` / `--data-file` / `-m` / `--metadata`), concurrency counts (`-c` / `--concurrency` / `-n` / `--total` / `-t` / `--duration` / `-q` / `--rps` / `-z` / `--connections` / `--cpus`), and lite lint. Lite scanner (same family as fortio-lab / ab-lab / hey-lab / vegeta-lab / autocannon-lab / locust-lab / artillery-lab / k6-script-lab) — **never runs ghz or executes gRPC load tests**, no network.

This is **not** the ghz CLI or a load-test runtime. Documented heuristics only. Users may paste source that references `ghz` — this plugin does not depend on or execute that binary.

## Tools

| Tool | Purpose |
|------|---------|
| `ghz_targets_list` | `ghz --insecure host:port`, `--call` / `-n package.Service/Method` → `[{host?, call?}]` |
| `ghz_proto_hint` | `-proto` / `--protoset` / `--proto` / `-i` / `--import-paths` / `-d` / `--data` / `-D` / `--data-file` / `-m` / `--metadata` → `[{method, count}]` |
| `ghz_concurrency_hint` | `-c` / `--concurrency` / `-n` / `--total` / `-t` / `--duration` / `-q` / `--rps` / `-z` / `--connections` / `--cpus` → `[{method, count}]` |
| `ghz_lint_lite` | missing `--call`/`-n` method, missing `-proto`/`--protoset`, `--insecure` without TLS, empty file, high `-c` without `-n`/`-t` → `{findings[]}` |

## Limits

- Pasted source text you already have. No sockets, DNS, remote fetches, ghz execution, or gRPC load-test runs for tool logic.
- Input capped at ~1MB (`1048576` characters).
- **Lite only** — not a full AST. Supported loosely: `//`, `/* */`, and `#` comments stripped; simple `'/"/\`` string literals; common ghz command / flag usage. Not supported / incomplete: spreads, imported helpers expanded, computed keys, dynamic `require`/`import`.
- Does not run ghz or talk to a network.
- FREE MIT.

## Start

```bash
node /workspace/ghz-lab/dist/bundle.js
```

Local plugin install: `~/.cursor/plugins/local/ghz-lab`

## Skills

- **ghz-targets** — list host/call definitions and proto hints from pasted ghz source
- **ghz-lint** — concurrency listings + lite heuristic findings

## License

MIT © Lawrence Hutchins — FREE
