# Release Notes Forge

Zero-auth **local** MCP tools that turn conventional-commit / `git log` text into Keep-a-Changelog release notes, breaking-change risk callouts, and semver bump suggestions. No changelog SaaS, no API keys — everything runs on stdio via Node.

## Why novel

No zero-auth local MCP turns conventional-commit / changelog text into structured release notes + risk callouts without a SaaS.

## Tools

| Tool | Purpose |
|------|---------|
| `commits_parse` | Parse `git log --oneline` / conventional dumps into `{type,scope,breaking,subject}[]` (unknown → chore/raw) |
| `release_notes_draft` | Keep-a-Changelog markdown (Added/Changed/Fixed/Breaking) from text or structured JSON |
| `breaking_change_scan` | List breaking candidates (BREAKING CHANGE, `!`, major cues) with risk callouts |
| `semver_suggest` | Suggest next semver bump (major/minor/patch) with rationale |

## Start

```bash
node /workspace/release-notes-forge/dist/bundle.js
```

## Skills

- **release-notes-draft** — parse → breaking scan → Keep-a-Changelog draft
- **semver-bump-suggest** — breaking scan → semver suggestion (+ optional notes)

## License

MIT © Lawrence Hutchins
