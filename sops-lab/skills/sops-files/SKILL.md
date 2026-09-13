---
name: sops-files
description: >
  List SOPS encrypted-file markers / path hints from pasted YAML/JSON and
  key-type / creation_rules method counts (pgp / age / kms / gcp_kms /
  azure_kv / hc_vault; creation_rules / path_regex / encrypted_regex /
  mac / lastmodified / version). Local only — never runs sops CLI, never
  decrypts, never returns secret values, no fetch.
version: 1.0.0
tags: [sops, secrets, encryption, files, keys, rules, local]
---

# SOPS files, keys & rules

Use these tools when the user pastes SOPS config or encrypted YAML/JSON (never fetch a remote file, never run sops CLI, never decrypt):

1. **`sops_files_list`** with `source` — → `{files: [{path?, format?}], count}`.
2. **`sops_keys_hint`** with `source` — → `{keys: [{method, count}], count}`.
3. **`sops_rules_hint`** with `source` — → `{rules: [{method, count}], count}`.

Lite scanner. Input cap ~1MB. Never returns decrypted secret values. Documented limitations apply (not sops CLI; no network; no decrypt).

## Example prompts

- "Which SOPS-encrypted files / path hints are in this paste?"
- "Which key types (age / pgp / kms) does this SOPS config mention?"
- "What creation_rules / path_regex settings appear in this .sops.yaml?"
