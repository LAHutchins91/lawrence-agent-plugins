---
name: release-notes-draft
description: "Draft Keep-a-Changelog style release notes from git log / conventional commits locally: parse commits, group Added/Changed/Fixed/Breaking, and surface risk callouts — zero-auth, no changelog SaaS."
version: 1.0.0
tags: [changelog, release-notes, conventional-commits, keep-a-changelog, semver]
---

# Release notes draft

When the user pastes a `git log` dump, conventional commits, or asks for release notes:

1. Call **`commits_parse`** on the log text to normalize `{type,scope,breaking,subject}[]`.
2. Call **`breaking_change_scan`** for risk callouts (BREAKING CHANGE, `!`, major cues).
3. Call **`release_notes_draft`** with `commitsText` (or structured JSON) and optional `versionLabel` — produce Keep-a-Changelog markdown (Added/Changed/Fixed/Breaking).
4. Summarize: lead with Breaking risk callouts, then the drafted markdown.

## Example prompts

- "Turn this git log into Keep-a-Changelog notes for 1.4.0"
- "Draft release notes from these conventional commits"
- "Any breaking changes in this commit list?"
