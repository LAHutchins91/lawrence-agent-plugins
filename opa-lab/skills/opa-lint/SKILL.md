---
name: opa-lint
description: >
  List OPA/Rego test keyword counts (test_rules / with / mock_data) and
  lite-lint for missing package, bare deny without msg, empty file, import
  without package, and test without package. Local only, never runs OPA
  CLI, no fetch.
version: 1.0.0
tags: [opa, rego, policy, lint, tests, local]
---

# OPA tests & lite lint

Use these tools on pasted Rego source (do not fetch URLs or run OPA CLI):

1. **`opa_tests_hint`** with `source` — → `{tests: [{method, count}], count}`.
2. **`opa_lint_lite`** with `source` — findings:
   - missing package (warning)
   - bare deny without msg (info)
   - Empty file (warning)
   - import without package (warning)
   - test without package (info)

Disclaimer only — not the OPA CLI. Lite scanner.

## Example prompts

- "Does this Rego deny rule include a message?"
- "Any imports before package?"
- "Lint this Rego for missing package"
