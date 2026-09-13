# Gitignore Lab

Zero-auth **local** MCP tools for gitignore-style match, parse, explain, and merge. Pure string matching — no filesystem walks, no `git` spawn. No SaaS.

## Why novel

No zero-auth local MCP in the catalog focuses on practical gitignore pattern evaluation — match with last-rule-wins, parse into structured rules, explain which rule decided, and merge multiple lists.

## Tools

| Tool | Purpose |
|------|---------|
| `gi_match` | Evaluate path vs patterns → `{ ignored, path }` |
| `gi_parse` | Parse `.gitignore` text → `{ rules, count }` |
| `gi_explain` | Which rule decided → `{ ignored, matchedRule?, ruleIndex?, explanation }` |
| `gi_merge` | Combine pattern lists → `{ text, rules }` |

## Caps & caveats

- Supports `*`, `**`, `?`, trailing `/` (directory-only), `!` negation; **last matching rule wins**.
- Mark directories with a trailing `/` on the path (no FS probes).
- Patterns without `/` match in any directory (basename-style); patterns with `/` are root-anchored.
- Children under a matched directory inherit ignore (parent-prefix check).
- Comments (`#`) and blank lines are skipped by `gi_parse` / `gi_merge`.
- Not a full `git check-ignore` clone (no index, no `.git/info/exclude`, no FS).

## Start

```bash
node /workspace/gitignore-lab/dist/bundle.js
```

Local plugin install: `~/.cursor/plugins/local/gitignore-lab`

## Skills

- **gi-match-explain** — Match paths and explain which rule won
- **gi-parse-merge** — Parse and merge gitignore lists

## License

MIT © Lawrence Hutchins
