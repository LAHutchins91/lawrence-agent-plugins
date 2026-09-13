# Vitest Config Lab

Zero-auth **local** MCP tools for scanning pasted `vitest.config.*` / `vite.config.*` text: include/exclude globs, coverage summary, workspace projects, and lite lint. Lite JS/TS config scanner only — no `vitest` / `vite` binary, no resolve/run, no network.

This is **not** the Vitest CLI and **not** a full AST (no Babel/TypeScript parser): common `defineConfig({ test: { include, exclude, environment, globals, coverage, projects } })`, `defineWorkspace([...])`, and workspace array exports are supported. Spreads, imported constants, and computed keys are out of scope.

## Tools

| Tool | Purpose |
|------|---------|
| `vitest_include_patterns` | → `{include[], exclude[]}` from `test.include` / `test.exclude` |
| `vitest_coverage_summary` | → `{provider?, reporters[], thresholds?, present}` from `test.coverage` |
| `vitest_workspace_projects` | → `{projects: [{nameOrPath}]}` from workspace / `projects` arrays |
| `vitest_lint_lite` | missing `test.environment`, coverage without thresholds, globals-only notes, empty include → `{findings[]}` |

## Limits

- Pasted `vitest.config.*` / `vite.config.*` / `vitest.workspace.*` text you already have. No sockets, DNS, remote fetches, or Vitest/Vite CLI.
- Input capped at ~1MB (`1048576` characters).
- **Lite JS/TS scanner**: `//` and `/* */` comments stripped loosely; simple `'…'` / `"…"` / `` `…` `` strings; labeled keys only when written literally. Not a full language parser — no AST, no spreads resolved, no imported values.
- Does not expand globs on disk or apply Vitest default include patterns when keys are omitted. Unusual formatting may be missed. Documented heuristics only — not `vitest --config`.
- FREE MIT.

## Start

```bash
node /workspace/vitest-config-lab/dist/bundle.js
```

Local plugin install: `~/.cursor/plugins/local/vitest-config-lab`

## Skills

- **vitest-include** — list include/exclude, coverage, and workspace projects from pasted config
- **vitest-lint** — lite heuristic findings on pasted vitest/vite config

## License

MIT © Lawrence Hutchins — FREE
