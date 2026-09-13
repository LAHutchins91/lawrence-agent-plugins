# Diff Unified Stats

Zero-auth **local** MCP tools for pasted unified-diff statistics and light risk flags. No network / no git — paste text only.

## Why novel

Stats-first companion to heavier PR risk scanners: file/add/del/net, per-file status lists, hunk counts, and focused risk flags (lockfiles, migrations, secrets filenames, large deletes) without auth or remotes.

## Tools

| Tool | Purpose |
|------|---------|
| `diff_stats` | Unified diff → `{files, additions, deletions, net}` |
| `diff_file_list` | Changed paths with per-file add/del + status (`added\|modified\|deleted\|renamed`) |
| `diff_hunk_count` | Total + per-file `@@` hunk counts |
| `diff_risk_flags` | Heuristics → `findings[{severity, rule, path?, advice}]` |

## Start

```bash
node /workspace/diff-unified-stats/dist/bundle.js
```

## Skills

- **diff-stats** — aggregate stats, file list, hunk counts
- **diff-risk-flags** — lockfile / migration / secrets / large-delete flags

## License

MIT © Lawrence Hutchins
