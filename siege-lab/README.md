# Siege Lab

Zero-auth **local** MCP tools for **siege** CLI / urls.txt / `.siegerc` text: URL inventory, CLI & rc option hints, concurrency extraction, and heuristic lite lint. No siege runtime. No load-test executor. No network.

## Why novel

No zero-auth local MCP in the catalog focuses on practical **siege** workflows — listing urls.txt / CLI URLs, `-c` / `-r` / `-t` / `-d` / `-f` / `-i` / `-b` / `-g` options and `.siegerc` `key = value` pairs, concurrency/reps/time hints, and educational smell heuristics without launching siege.

## Tools

| Tool | Purpose |
|------|---------|
| `sg_urls_list` | urls.txt / CLI text → `{ urls: string[], count }` |
| `sg_options_hint` | CLI / `.siegerc` text → `{ options: [{flag, value?}], count }` |
| `sg_concurrency_hint` | CLI / `.siegerc` text → `{ concurrent?, reps?, time? }` |
| `sg_lint_lite` | CLI / urls.txt / `.siegerc` text → `{ findings, findingCount }` |

## Caps & caveats

- **String analysis only** — never imports or shells out to siege, never opens files on disk or over the network, never runs a load test, never evaluates code.
- Best-effort regex heuristics on common siege shapes (`siege -c … -r … -f urls.txt`, `.siegerc` `concurrent = 25`). Not a full shell parser.
- Lint rules are educational heuristics (empty, missing `-c` tip, benchmark without delay tip, no URL tip, etc.) — **not** an exploit guide.

## Start

```bash
node /workspace/siege-lab/dist/bundle.js
```

Local plugin install: `~/.cursor/plugins/local/siege-lab`

## Skills

- **sg-urls-options** — URL list + CLI / `.siegerc` option hints
- **sg-concurrency-lint** — concurrency hints + lite lint

## License

MIT © Lawrence Hutchins
