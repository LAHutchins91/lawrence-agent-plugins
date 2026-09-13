---
name: tfsec-checks
description: >
  List tfsec AWS006 / AVD- / tfsec check IDs from pasted HCL/config/comments
  and severity method counts (CRITICAL / HIGH / MEDIUM / LOW /
  minimum-severity / soft-fail). Local only — never runs tfsec CLI, no fetch.
version: 1.0.0
tags: [tfsec, iac, checks, severity, local]
---

# tfsec checks & severity

Use these tools when the user pastes tfsec config, ignore comments, or HCL text (never fetch a remote file, never run tfsec CLI):

1. **`tfsec_checks_list`** with `source` — → `{checks: [{id?}], count}`.
2. **`tfsec_severity_hint`** with `source` — → `{severity: [{method, count}], count}`.

Lite scanner. Input cap ~1MB. Documented limitations apply (not tfsec CLI; no network).

## Example prompts

- "Which AWS006 / AVD- IDs are referenced in this tfsec config?"
- "Which severity keywords does this tfsec config mention?"
- "List check IDs from this paste."
