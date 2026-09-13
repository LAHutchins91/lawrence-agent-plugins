# Git Archaeology

Zero-auth **local** MCP tools for archaeology on pasted git text: blame ownership digests, churn hotspots from numstat logs, “why this code exists” briefs, and heuristic PR diff risk. No private network, no git subprocess for tools — paste text in, get structured summaries out via stdio Node.

## Why novel

No zero-auth local MCP in the catalog specializes in ownership/churn/diff-risk digests from pasted git porcelain without spawning `git` or talking to remotes.

## Tools

| Tool | Purpose |
|------|---------|
| `blame_digest` | Parse git blame porcelain or annotated blame → per-file owner summary ranked by lines owned |
| `hotspot_scan` | Parse `git log --numstat` style text → files with highest churn (adds+deletes), top N |
| `why_here_brief` | File path label + recent commit log text → themes, frequent authors, date span |
| `pr_risk_from_diff` | Unified diff → heuristic risk findings (large deletes, lockfiles, migrations, auth, secrets, binary) |

## Start

```bash
node /workspace/git-archaeology/dist/bundle.js
```

## Skills

- **blame-digest** — ownership + churn questions via `blame_digest` / `hotspot_scan`
- **diff-risk-scan** — PR risk via `pr_risk_from_diff` (+ optional `why_here_brief`)

## License

MIT © Lawrence Hutchins
