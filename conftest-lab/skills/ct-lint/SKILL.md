---
name: ct-lint
description: "List Conftest/Rego input keyword counts (input_dot / input_bracket / with_input_as / conf_test) and lite-lint for missing package, deny without msg, empty file, non-main package (needs -n), and violation+deny mixed. Local only, never runs conftest/OPA CLI, no fetch."
version: 1.0.0
tags: [conftest, rego, opa, policy, lint, inputs, local]
---

# Conftest inputs & lite lint

Use these tools on pasted Conftest Rego source (do not fetch URLs or run conftest/OPA CLI):

1. **`ct_inputs_hint`** with `source` — → `{inputs: [{method, count}], count}`.
2. **`ct_lint_lite`** with `source` — findings:
   - missing package (warning)
   - deny without msg (info)
   - Empty file (warning)
   - non-main without namespace flag (info)
   - violation and deny mixed (info)

Disclaimer only — not the conftest or OPA CLI. Lite scanner.

## Example prompts

- "Does this Conftest deny rule include a message?"
- "Does this non-main package need -n?"
- "Lint this Conftest Rego for mixed deny/violation"
