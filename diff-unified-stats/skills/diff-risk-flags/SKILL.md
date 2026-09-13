---
name: diff-risk-flags
description: >
  Light risk heuristics on pasted unified diffs — lockfiles, migrations,
  secrets-ish filenames, large deletes — zero-auth local only.
version: 1.0.0
tags: [diff, risk, lockfile, migration, secrets, review]
---

# Diff risk flags

When the user pastes a unified diff and wants a quick risk skim (not a full PR auditor):

1. Call **`diff_risk_flags`** with `diffText` (optional `largeDeleteThreshold`, default 50).
2. Report `findings[{severity, rule, path?, advice}]` and `findingCount`.
3. Rules covered: `lockfile-change`, `migration-path`, `secrets-filename`, `large-deletes`.
4. Do not invent extra scanners; keep focused on these light flags.

## Example prompts

- "Any risky paths in this diff?"
- "Flag lockfile or migration changes"
- "Does this patch touch .env or delete a lot?"
