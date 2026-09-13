---
name: syft-scans
description: >
  List Syft scan sources (dir / image / file / oci-dir / singularity)
  from pasted config/CI and format/scope method counts (spdx-json /
  cyclonedx-json / syft-json / table / text / --output / -o; squashed /
  all-layers / scope / --scope / catalogers / package).
  Local only — never runs syft CLI, no fetch.
version: 1.0.0
tags: [syft, sbom, scans, formats, scope, local]
---

# Syft scans, formats & scope

Use these tools when the user pastes Syft config or CI text (never fetch a remote file, never run syft CLI):

1. **`syft_scans_list`** with `source` — → `{scans: [{kind?, target?}], count}`.
2. **`syft_formats_hint`** with `source` — → `{formats: [{method, count}], count}`.
3. **`syft_scope_hint`** with `source` — → `{scope: [{method, count}], count}`.

Lite scanner. Input cap ~1MB. Documented limitations apply (not syft CLI; no network).

## Example prompts

- "Which Syft scan kinds are in this CI snippet?"
- "Which SBOM output formats does this Syft config mention?"
- "What scope / cataloger settings appear in this paste?"
