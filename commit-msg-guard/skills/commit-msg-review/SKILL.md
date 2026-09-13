---
name: commit-msg-review
description: "Parse and lint pasted Conventional Commits messages and check git trailers — zero-auth, no network, no git exec; never invent Signed-off-by identities."
version: 1.0.0
tags: [commit, conventional-commits, lint, trailers, review]
---

# Commit message review

When the user pastes a commit message (or asks whether it is Conventional Commits–compliant):

1. Call **`conventional_parse`** with `message` to get `{type, scope, breaking, subject, body, footers, valid, issues}`.
2. Call **`commit_msg_lint`** with the same paste; pass optional `rules` `{maxSubject?, requireScope?, allowedTypes?}` when they have a house style.
3. Call **`trailer_check`** when trailers matter (DCO, co-authors). Report malformed trailers; **never invent** Signed-off-by / Co-authored-by identities.

Summarize parse validity, lint findings, and trailer hygiene. Operate on pasted text only.

## Example prompts

- "Is this commit message conventional?"
- "Lint this subject with maxSubject 50 and requireScope"
- "Check Signed-off-by / Co-authored-by trailers on this paste"
