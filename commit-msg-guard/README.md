# Commit Msg Guard

Zero-auth **local** MCP tools for pasted commit messages: parse Conventional Commits, lint subject/type/scope rules, scan for breaking-change markers, and check git trailers — without inventing identities. No network, no file I/O beyond stdio — paste text in, get structured JSON out.

## Why novel

No zero-auth local MCP in the catalog specializes in Conventional Commits parse + lint + breaking-change scan + trailer hygiene on pasted text only (no git exec, no remotes).

## Tools

| Tool | Purpose |
|------|---------|
| `conventional_parse` | Message → `{type, scope, breaking, subject, body, footers[], valid, issues[]}` |
| `commit_msg_lint` | Message + optional `{maxSubject?, requireScope?, allowedTypes?}` → `findings[{severity, rule, advice}]` |
| `breaking_change_scan` | One message or multi-commit log → breaking markers (`!` / `BREAKING CHANGE`) with excerpts |
| `trailer_check` | Detect Signed-off-by / Co-authored-by / Reviewed-by / etc.; flag malformed; never invent identities |

## Start

```bash
node /workspace/commit-msg-guard/dist/bundle.js
```

## Skills

- **commit-msg-review** — parse + lint + trailer workflows
- **breaking-change-scan** — scan messages/logs for breaking markers

## License

MIT © Lawrence Hutchins
