# Tox INI Lab

Zero-auth **local** MCP tools for **tox.ini text**: expand `envlist`, map testenv commands, list deps, and heuristic lite lint. No `tox` binary. No network. No venv. No SaaS.

## Why novel

No zero-auth local MCP in the catalog focuses on practical **tox.ini text** workflows — envlist factor expansion, per-env command maps, dependency inventory, and quick educational smell heuristics without invoking tox.

## Tools

| Tool | Purpose |
|------|---------|
| `tox_envlist` | tox.ini text → `{ envlist, expanded?, count }` |
| `tox_commands_map` | tox.ini text → `{ envs:[{name, commands}], count }` |
| `tox_deps_list` | tox.ini text → `{ deps:[{env?, package}], unique, count }` |
| `tox_lint_lite` | tox.ini text → `{ findings, findingCount }` |

## Caps & caveats

- **String analysis only** — never runs `tox`, never creates venvs, never opens files on disk or over the network.
- `envlist` factor expansion is best-effort for simple `{a,b}` forms (including nested cartesian products). Complex generative names / generative environments are not fully modeled.
- Commands/deps parse follows tox.ini multiline value conventions (indented continuations). Does not evaluate substitutions like `{posargs}` or `{[section]key}`.
- Lint rules are educational heuristics (empty file, missing `[tox]`/`envlist`, `skip_missing_interpreters` tips, `usedevelop` vs `package`, `passenv` secret smells, empty commands, duplicate sections) — **not** an exploit guide.

## Start

```bash
node /workspace/tox-ini-lab/dist/bundle.js
```

Local plugin install: `~/.cursor/plugins/local/tox-ini-lab`

## Skills

- **tox-envlist-commands** — envlist + commands map
- **tox-deps-lint** — deps inventory + lite lint

## License

MIT © Lawrence Hutchins
