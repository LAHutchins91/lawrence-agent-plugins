---
name: syft-lint
description: >
  Lite-lint pasted Syft SBOM config for missing -o/--output, table-only
  CI output, empty file, all-layers heavy scope, and stdout-only without
  file redirect. Local only, never runs syft CLI, no fetch.
version: 1.0.0
tags: [syft, sbom, lint, local]
---

# Syft lite lint

Use this tool on pasted Syft config / CI source (do not fetch URLs or run syft CLI):

1. **`syft_lint_lite`** with `source` — findings:
   - missing output format (warning)
   - table-only CI (info)
   - Empty file (warning)
   - all-layers heavy (info)
   - no file output / stdout only (info)

Disclaimer only — not the syft CLI. Lite scanner.

## Example prompts

- "Does this Syft CI set an SBOM output format?"
- "Is this using table-only output in CI?"
- "Lint this Syft config for all-layers / missing file output"
