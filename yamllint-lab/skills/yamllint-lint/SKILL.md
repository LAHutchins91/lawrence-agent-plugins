---
name: yamllint-lint
description: >
  Lite-lint pasted YAML / .yamllint config for tabs in indent
  (warning), missing --- document-start (info), empty file,
  rules: * disable-all (warning), and line-length max > 200 (info).
  Local only, never runs yamllint CLI, no fetch.
version: 1.0.0
tags: [yamllint, yaml, lint, local]
---

# yamllint lite lint

Use this tool on pasted YAML / .yamllint config (do not fetch URLs or run yamllint CLI):

1. **`yamllint_lint_lite`** with `source` — findings:
   - tabs_in_indent (warning)
   - missing_document_start (info)
   - empty_file (warning)
   - rule_level_disable_all (warning)
   - line_length_very_high (info)

Disclaimer only — not the yamllint CLI. Lite scanner.

## Example prompts

- "Are there tabs used for YAML indentation?"
- "Is document-start --- missing?"
- "Lint this .yamllint for * disable-all / very high line-length"
