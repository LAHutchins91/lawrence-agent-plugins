---
name: ckv-checks
description: "List Checkov CKV_ / CKV2_ check IDs from pasted config/code/comments and framework method counts (terraform / cloudformation / kubernetes / dockerfile / secrets / arm / bicep / helm / github_actions). Local only — never runs checkov CLI, no fetch."
version: 1.0.0
tags: [checkov, iac, checks, frameworks, local]
---

# Checkov checks & frameworks

Use these tools when the user pastes Checkov config, skip comments, or IaC text (never fetch a remote file, never run checkov CLI):

1. **`ckv_checks_list`** with `source` — → `{checks: [{id?}], count}`.
2. **`ckv_frameworks_hint`** with `source` — → `{frameworks: [{method, count}], count}`.

Lite scanner. Input cap ~1MB. Documented limitations apply (not checkov CLI; no network).

## Example prompts

- "Which CKV_ IDs are referenced in this Checkov config?"
- "Which frameworks does this Checkov config mention?"
- "List check IDs from this paste."
