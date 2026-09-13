---
name: shellcheck-lint
description: >
  Lite-lint pasted shell / ShellCheck config for unquoted $var
  (warning), disable without reason comment (info), empty file,
  broad SC* disables (warning), and missing shebang (info).
  Local only, never runs shellcheck CLI, no fetch.
version: 1.0.0
tags: [shellcheck, shell, lint, local]
---

# ShellCheck lite lint

Use this tool on pasted shell / ShellCheck config (do not fetch URLs or run shellcheck CLI):

1. **`shellcheck_lint_lite`** with `source` — findings:
   - unquoted_variable (warning)
   - disable_without_reason (info)
   - empty_file (warning)
   - broad_disable (warning)
   - missing_shebang (info)

Disclaimer only — not the shellcheck CLI. Lite scanner.

## Example prompts

- "Are there unquoted variables in this shell script?"
- "Is shellcheck disable missing a reason comment?"
- "Lint this script for broad shellcheck disables / missing shebang"
