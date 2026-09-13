---
name: blame-digest
description: "Answer ownership and churn questions from pasted git text: digest blame into per-file owner rankings, and scan numstat logs for hottest files — zero-auth, no git subprocess."
version: 1.0.0
tags: [git, blame, ownership, churn, hotspot, archaeology]
---

# Blame digest / churn hotspots

When the user asks who owns a file, how ownership is skewed, or which paths churn most:

1. If they paste **git blame** (porcelain or annotated), call **`blame_digest`** with `blameText` (and `fileLabel` if the paste has no filename). Report authors ranked by lines owned.
2. If they paste **`git log --numstat`** (or numstat lines), call **`hotspot_scan`** (optional `topN`, default 20). Report highest churn = adds + deletes.
3. Summarize: top owners, ownership concentration, and hottest paths — no network, no spawning `git`.

## Example prompts

- "Digest this blame — who owns src/auth/session.ts?"
- "Which files churn hardest in this numstat paste?"
- "Ownership vs hotspot brief for this module"
