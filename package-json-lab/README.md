# Package JSON Lab

Zero-auth **local** MCP tools for **package.json text**: list scripts, bucket dependency keys, check `engines.node` against an optional Node version, and heuristic lite lint. **String-level** analysis only — no `npm install`, no network I/O, no filesystem reads beyond the text you pass. No SaaS.

## Why novel

No zero-auth local MCP in the catalog focuses on practical **package.json text** workflows — script inventory, deps vs devDeps overlap, engines.node satisfaction notes, and quick educational smell heuristics without talking to the registry.

## Tools

| Tool | Purpose |
|------|---------|
| `pkg_scripts_list` | package.json text → `{ name?, scripts, count }` |
| `pkg_deps_diff` | package.json text → dep buckets + onlyInDeps / onlyInDev / overlap |
| `pkg_engines_check` | package.json text (+ optional `nodeVersion`) → `{ engines?, satisfies?, notes }` |
| `pkg_lint_lite` | package.json text → `{ findings, findingCount }` |

## Caps & caveats

- **JSON string analysis only** — never runs npm/network, never opens package.json paths on disk.
- Dep tools report **package name keys only**, not version ranges (except lint smells).
- Engines check uses simple semver ranges when possible; complex/custom ranges get a note.
- Lint rules are educational heuristics (missing name/version, private+publishConfig, `*` ranges, `file:` deps, curl\|bash in scripts, etc.) — **not** an exploit guide.

## Start

```bash
node /workspace/package-json-lab/dist/bundle.js
```

Local plugin install: `~/.cursor/plugins/local/package-json-lab`

## Skills

- **pkg-scripts-deps** — List scripts and bucket dependencies
- **pkg-engines-lint** — Engines.node check and lite lint

## License

MIT © Lawrence Hutchins
