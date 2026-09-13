# Angular JSON Lab

Zero-auth **local** MCP tools for scanning pasted `angular.json` text: projects list, architect targets, styles/scripts arrays, and lite lint. JSON-only (`JSON.parse`, with loose JSONC/trailing-comma strip when needed) — no `ng` binary for tool logic, no resolve/run, no network.

This is **not** the Angular CLI. Documented heuristics only. `project.json` alone is accepted only when it has the same workspace shape (top-level `projects` map, or a single-project object with `architect` / `projectType` / `root`).

## Tools

| Tool | Purpose |
|------|---------|
| `ng_projects_list` | → `{projects: [{name, projectType?, root?, sourceRoot?}]}` |
| `ng_architect_targets` | → `{targets: [{project, target, builder?}]}` (optional `project` filter) |
| `ng_styles_scripts` | → `{entries: [{project, styles[], scripts[]}]}` from build options |
| `ng_lint_lite` | missing `defaultProject` (legacy), no projects, builder version-ish notes, budgets missing on production → `{findings[]}` |

## Limits

- Pasted angular.json (or same-shape) text you already have. No sockets, DNS, remote fetches, or Angular CLI for tool logic (`ng` never run by tools).
- Input capped at ~1MB (`1048576` characters).
- **JSON-only**: prefers `JSON.parse`; strips `//` / `/* */` and trailing commas loosely when plain parse fails. Does not resolve file refs or execute builders.
- Unusual Nx-only layouts without an angular.json-compatible `projects`/`architect` shape may be missed.
- FREE MIT.

## Start

```bash
node /workspace/angular-json-lab/dist/bundle.js
```

Local plugin install: `~/.cursor/plugins/local/angular-json-lab`

## Skills

- **ng-projects** — list projects, architect targets, and styles/scripts from pasted angular.json
- **ng-lint** — lite heuristic findings on pasted angular.json

## License

MIT © Lawrence Hutchins — FREE
