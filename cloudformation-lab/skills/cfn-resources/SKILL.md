---
name: cfn-resources
description: >
  List CloudFormation Resources (logical id + Type) and Parameters
  (name + Type) from pasted CloudFormation YAML/JSON. Local only —
  never runs AWS CLI or cfn-lint binary, no fetch.
version: 1.0.0
tags: [cloudformation, aws, cfn, yaml, json, resources, parameters, local]
---

# CloudFormation resources & parameters

Use these tools when the user pastes CloudFormation YAML/JSON text (never fetch a remote file, never run AWS CLI or cfn-lint):

1. **`cfn_resources_list`** with `source` — → `{resources: [{id?, type?}], count}`.
2. **`cfn_parameters_hint`** with `source` — → `{parameters: [{name?, type?}], count}`.

Lite scanner. Input cap ~1MB. Documented limitations apply (not AWS CLI; not cfn-lint; no network).

## Example prompts

- "Which resources are defined in this CloudFormation template?"
- "What parameters does this stack take?"
- "List AWS:: types from this paste."
