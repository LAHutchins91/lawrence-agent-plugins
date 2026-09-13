---
name: ct-policies
description: >
  List Conftest/Rego policy identifiers (package / deny / violation) and
  namespace method counts (package_main / package_namespaces /
  package_namespaces_sub) from pasted Conftest Rego. Local only — never
  runs conftest/OPA CLI, no fetch.
version: 1.0.0
tags: [conftest, rego, opa, policy, namespaces, local]
---

# Conftest policies & namespaces

Use these tools when the user pastes Conftest Rego policy text (never fetch a remote file, never run conftest/OPA CLI):

1. **`ct_policies_list`** with `source` — → `{policies: [{name?, kind?}], count}`.
2. **`ct_namespaces_hint`** with `source` — → `{namespaces: [{method, count}], count}`.

Lite scanner. Input cap ~1MB. Documented limitations apply (not conftest/OPA CLI; no network).

## Example prompts

- "Which deny/violation policies are in this Conftest Rego?"
- "Is this package main or namespaces.xxx?"
- "List policy identifiers from this paste."
