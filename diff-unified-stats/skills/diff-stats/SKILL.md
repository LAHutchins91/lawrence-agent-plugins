---
name: diff-stats
description: "Parse pasted unified diffs for file/add/del/net counts, per-file status lists, and hunk counts — zero-auth, local only, no network or git."
version: 1.0.0
tags: [diff, unified-diff, stats, hunks, review]
---

# Diff stats

When the user pastes a unified diff and wants size/structure metrics:

1. Call **`diff_stats`** with `diffText` → `{files, additions, deletions, net}`.
2. Call **`diff_file_list`** for per-path add/del + status (`added|modified|deleted|renamed`).
3. Call **`diff_hunk_count`** for total + per-file `@@` hunk counts.
4. Report structured JSON only. Never claim network, git remotes, or file I/O beyond the pasted text.

## Example prompts

- "How big is this diff?"
- "List files changed in this patch"
- "How many hunks are in this unified diff?"
