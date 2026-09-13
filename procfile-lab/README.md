# Procfile Lab

Zero-auth **local** MCP tools for **Procfile text**: parse `name: command` entries, list process types, collect `$VAR` / `${VAR}` refs, and heuristic lite lint. No network. No process spawn. No SaaS.

## Why novel

No zero-auth local MCP in the catalog focuses on practical **Procfile** workflows — entry parse, process-type inventory, env-ref extraction, and quick educational smell heuristics without running Foreman/Honcho/Heroku tooling.

## Tools

| Tool | Purpose |
|------|---------|
| `procfile_parse` | Procfile text → `{ entries:[{name, command, line?}], count }` |
| `procfile_process_list` | Procfile text → `{ processes, count }` |
| `procfile_env_refs` | Procfile text → `{ refs:[{name, process?, raw?}], unique, count }` |
| `procfile_lint_lite` | Procfile text → `{ findings, findingCount }` |

## Caps & caveats

- **String analysis only** — never spawns processes, never opens files on disk or over the network.
- Lines are `name: command`; blanks and `#` comments are skipped.
- Env refs are best-effort `$VAR` / `${VAR}` matches in commands (no shell expansion).
- Lint rules are educational heuristics (empty file, missing web/worker, duplicates, invalid names, bare python without `$PORT`, missing `$PORT` on web-like entries, tabs) — **not** an exploit guide.

## Start

```bash
node /workspace/procfile-lab/dist/bundle.js
```

Local plugin install: `~/.cursor/plugins/local/procfile-lab`

## Skills

- **procfile-parse-list** — parse entries + list process types
- **procfile-env-lint** — env `$VAR` refs + lite lint

## License

MIT © Lawrence Hutchins
