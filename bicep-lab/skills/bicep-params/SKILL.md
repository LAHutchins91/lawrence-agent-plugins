---
name: bicep-params
description: >
  List Bicep param declarations (name + type) and resource Microsoft.*
  type counts from pasted Bicep. Local only — never runs Azure CLI or
  bicep CLI, no fetch.
version: 1.0.0
tags: [bicep, azure, arm, params, resources, local]
---

# Bicep params & resources

Use these tools when the user pastes Bicep text (never fetch a remote file, never run Azure CLI or bicep CLI):

1. **`bicep_params_list`** with `source` — → `{params: [{name?, type?}], count}`.
2. **`bicep_resources_hint`** with `source` — → `{resources: [{method, count}], count}`.

Lite scanner. Input cap ~1MB. Documented limitations apply (not Azure CLI; not bicep CLI; no network).

## Example prompts

- "Which params are defined in this Bicep file?"
- "What Microsoft.* resources does this template declare?"
- "List param types from this paste."
