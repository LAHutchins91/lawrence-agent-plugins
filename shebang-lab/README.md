# Shebang Lab

Zero-auth **local** MCP tools for shebang parse, interpreter detection, normalize, and warn. First-line string analysis only — no exec, no filesystem. No SaaS.

## Why novel

No zero-auth local MCP in the catalog focuses on practical shebang first-line analysis — parse `#!`, detect interpreter family, rewrite to env/absolute forms, and lint common pitfalls (CRLF, bare `python`, missing shebang).

## Tools

| Tool | Purpose |
|------|---------|
| `parse_shebang` | First line if `#!` → `{ shebang, interpreterPath?, args, line }` |
| `detect_interpreter` | Heuristic family → `{ family, detail }` |
| `normalize_shebang` | Prefer `env` or `absolute` forms → `{ shebang, rewrittenFirstLine?, note? }` |
| `shebang_warn` | Lint findings → `{ findings, findingCount }` |

## Caps & caveats

- **First line only** — rest of file is ignored except for script-likeness heuristics in `shebang_warn`.
- No execution of interpreters; no PATH lookups; no filesystem reads.
- Family detection is heuristic (`nodejs`→node, `env python3`→python, etc.).
- `normalize_shebang` only rewrites known families (node/python/bash/sh/ruby/perl/php); unknown left unchanged.
- Bare `python` is flagged and upgraded to `python3` when normalizing to env style.
- CRLF on the shebang line is reported as an error (kernel may include `\r` in the path).

## Start

```bash
node /workspace/shebang-lab/dist/bundle.js
```

Local plugin install: `~/.cursor/plugins/local/shebang-lab`

## Skills

- **shebang-parse-detect** — Parse shebang and detect interpreter family
- **shebang-normalize-warn** — Normalize shebang style and lint warnings

## License

MIT © Lawrence Hutchins
