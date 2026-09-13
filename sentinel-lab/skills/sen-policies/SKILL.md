---
name: sen-policies
description: "List HashiCorp Sentinel policy rule names (main = / named rules / policy identifiers) and import method counts (tfplan/v2 / tfconfig / tfrun / http / decimal / strings / types) from pasted Sentinel. Local only — never runs Sentinel CLI, no fetch."
version: 1.0.0
tags: [sentinel, hashicorp, policy, imports, local]
---

# Sentinel policies & imports

Use these tools when the user pastes Sentinel policy text (never fetch a remote file, never run Sentinel CLI):

1. **`sen_policies_list`** with `source` — → `{policies: [{name?}], count}`.
2. **`sen_imports_hint`** with `source` — → `{imports: [{method, count}], count}`.

Lite scanner. Input cap ~1MB. Documented limitations apply (not Sentinel CLI; no network).

## Example prompts

- "Which policies / main rules are in this Sentinel?"
- "How many tfplan vs http imports?"
- "List policy names from this paste."
