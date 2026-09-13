# Bombardier Lab

Zero-auth **local** MCP tools for **bombardier** CLI text: target URL inventory, CLI option hints, latency/print flags, and heuristic lite lint. No bombardier runtime. No load-test executor. No network.

## Why novel

No zero-auth local MCP in the catalog focuses on practical **bombardier** CLI workflows — listing trailing target URLs, `-c` / `-n` / `-d` / `-m` / `-b` / `-H` / `-l` / `-p` / `-r` options, `printLatencies` / `-l` / `-p` latency-print signals, and educational smell heuristics without launching bombardier.

## Tools

| Tool | Purpose |
|------|---------|
| `bb_targets_list` | CLI text → `{ targets: [{url?}], count }` |
| `bb_options_hint` | CLI text → `{ options: [{flag, value?}], count }` |
| `bb_latency_hint` | CLI text → `{ latency: [{kind}], count }` |
| `bb_lint_lite` | CLI text → `{ findings, findingCount }` |

## Caps & caveats

- **String analysis only** — never imports or shells out to bombardier, never opens files on disk or over the network, never runs a load test, never evaluates code.
- Best-effort regex heuristics on common bombardier shapes (`bombardier -c … -n … URL`). Not a full shell parser.
- Lint rules are educational heuristics (empty, missing `-c`/`-n` tip, unbounded duration tip, no URL tip, etc.) — **not** an exploit guide.

## Start

```bash
node /workspace/bombardier-lab/dist/bundle.js
```

Local plugin install: `~/.cursor/plugins/local/bombardier-lab`

## Skills

- **bb-targets-options** — target URL list + CLI option hints
- **bb-latency-lint** — latency/print hints + lite lint

## License

MIT © Lawrence Hutchins
