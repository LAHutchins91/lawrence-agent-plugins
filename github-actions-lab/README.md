# GitHub Actions Lab

Zero-auth **local** MCP tools for GitHub Actions **workflow YAML text**: list jobs, normalize `on:` triggers, extract secret **names** (never values), and heuristic lite lint. **String-level** analysis only — no GitHub API, no network I/O, no filesystem reads beyond the text you pass. No SaaS.

## Why novel

No zero-auth local MCP in the catalog focuses on practical **GitHub Actions workflow YAML text** workflows — job inventory, trigger normalization across string/list/map `on:` forms, secret-name refs, and quick educational smell heuristics without talking to GitHub.

## Tools

| Tool | Purpose |
|------|---------|
| `gha_list_jobs` | workflow YAML → `{ name?, jobs, count }` |
| `gha_list_triggers` | workflow YAML → `{ on, events }` |
| `gha_secrets_refs` | workflow YAML → `{ secrets, count }` (names only) |
| `gha_lint_lite` | workflow YAML → `{ findings, findingCount }` |

## Caps & caveats

- **YAML string analysis only** — never calls the GitHub API, never opens workflow paths on disk, never returns secret **values**.
- `on:` is normalized from string, list, or map forms into `events: string[]`.
- Secret detection matches `secrets.NAME` / `${{ secrets.NAME }}` style refs — names only.
- Lint rules are educational heuristics (`pull_request_target` notes, missing `permissions`, curl|bash smells, `@master` / unpinned action refs, etc.) — **not** an exploit guide.

## Start

```bash
node /workspace/github-actions-lab/dist/bundle.js
```

Local plugin install: `~/.cursor/plugins/local/github-actions-lab`

## Skills

- **gha-jobs-triggers** — List jobs and normalize triggers
- **gha-secrets-lint** — Secret name refs and lite lint

## License

MIT © Lawrence Hutchins
