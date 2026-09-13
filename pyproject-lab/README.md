# Pyproject Lab

Zero-auth **local** MCP tools for scanning pasted `pyproject.toml` text: list dependencies, scripts, build backend, and lite lint. Lite TOML subset parser only — no `pip` / `poetry` / `uv` CLI, no network.

This is **not a full TOML 1.0 / PEP 621 / PEP 517 resolver**: common `[project]` / `[build-system]` / `[tool.*]` tables are supported. Poetry/PDM lockfiles, dependency resolution, and backend invocation are out of scope.

## Tools

| Tool | Purpose |
|------|---------|
| `pyproject_deps_list` | TOML text → `{dependencies: [{name, extra?, spec?}]}` from project deps + optional-deps |
| `pyproject_scripts_list` | → `{scripts: [{name, entry}]}` from `[project.scripts]` / `[project.gui-scripts]` |
| `pyproject_build_backend` | → `{requires[], buildBackend?}` from `[build-system]` |
| `pyproject_lint_lite` | missing project name/version, missing build-system, dynamic version, open-ended deps (`*` / unpinned), tool section notes → `{findings[]}` |

## Limits

- Pasted `pyproject.toml` text you already have. No sockets, DNS, remote fetches, or pip/poetry/uv CLI.
- Input capped at ~1MB (`1048576` characters).
- **Lite TOML subset** (from cargo-toml-lab / ini-toml-lite approach): bare/quoted/dotted keys; basic/literal strings (incl. multiline); ints/floats; bools; arrays; inline tables; `[tables]`; `[[arrays of tables]]`; `#` comments. Not full TOML 1.0 (no hex/oct/bin ints, ±inf/nan, native date-times, strict array homogeneity, etc.).
- PEP 508 markers after `;` are stripped for display; full marker evaluation is not performed.
- `[tool.poetry.dependencies]` and similar non-PEP-621 tables are not expanded.

## Start

```bash
node /workspace/pyproject-lab/dist/bundle.js
```

Local plugin install: `~/.cursor/plugins/local/pyproject-lab`

## Skills

- **pyproject-deps** — list dependencies / scripts / build-backend from pasted pyproject.toml
- **pyproject-lint** — lite heuristic findings on pasted pyproject.toml

## License

MIT © Lawrence Hutchins — FREE
