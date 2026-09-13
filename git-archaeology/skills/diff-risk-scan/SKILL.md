---
name: diff-risk-scan
description: >
  Review a pasted unified diff for heuristic PR risk (large deletes, lockfiles,
  migrations, auth paths, secrets-ish names, binaries). Optionally pair with a
  why-here brief from recent commit log text — local, zero-auth.
version: 1.0.0
tags: [git, diff, pr, risk, migration, auth, secrets]
---

# Diff risk scan

When the user pastes a PR / unified diff for risk review:

1. Call **`pr_risk_from_diff`** on the diff text — surface severity-ranked findings (`large-deletes`, `lockfile-change`, `migration-path`, `auth-path`, `secrets-ish-filename`, `binary-marker`, etc.).
2. If they also share recent commits for a hot file, call **`why_here_brief`** with `filePath` + `logText` for context on why that code exists.
3. Write a merge-risk brief: critical/high first, then medium, with concrete advice — never invent remote git history.

## Example prompts

- "Scan this PR diff for risk"
- "Any migration/auth/secrets issues in this patch?"
- "Diff risk + why does src/auth/login.ts exist given this log?"
