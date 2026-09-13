---
name: trivy-scans
description: >
  List Trivy scan targets/types (image / fs / repo / config / sbom /
  kubernetes / vuln) from pasted config/CI and severity method counts
  (CRITICAL / HIGH / MEDIUM / LOW / UNKNOWN / --severity / severity:).
  Local only — never runs trivy CLI, no fetch.
version: 1.0.0
tags: [trivy, security, scans, severity, local]
---

# Trivy scans & severity

Use these tools when the user pastes Trivy config, CI, or ignore text (never fetch a remote file, never run trivy CLI):

1. **`trivy_scans_list`** with `source` — → `{scans: [{kind?, target?}], count}`.
2. **`trivy_severity_hint`** with `source` — → `{severity: [{method, count}], count}`.

Lite scanner. Input cap ~1MB. Documented limitations apply (not trivy CLI; no network).

## Example prompts

- "Which Trivy scan kinds are in this CI snippet?"
- "Which severity keywords does this Trivy config mention?"
- "List scan targets from this paste."
