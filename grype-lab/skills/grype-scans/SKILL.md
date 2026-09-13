---
name: grype-scans
description: >
  List Grype scan targets/types (dir / image / sbom / file / docker)
  from pasted config/CI and severity method counts (Critical / High /
  Medium / Low / Negligible / Unknown / fail-on / --fail-on).
  Local only — never runs grype CLI, no fetch.
version: 1.0.0
tags: [grype, security, scans, severity, local]
---

# Grype scans & severity

Use these tools when the user pastes Grype config, CI, or ignore text (never fetch a remote file, never run grype CLI):

1. **`grype_scans_list`** with `source` — → `{scans: [{kind?, target?}], count}`.
2. **`grype_severity_hint`** with `source` — → `{severity: [{method, count}], count}`.

Lite scanner. Input cap ~1MB. Documented limitations apply (not grype CLI; no network).

## Example prompts

- "Which Grype scan kinds are in this CI snippet?"
- "Which severity keywords does this Grype config mention?"
- "List scan targets from this paste."
