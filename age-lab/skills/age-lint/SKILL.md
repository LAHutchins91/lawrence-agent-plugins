---
name: age-lint
description: >
  Lite-lint pasted age config for AGE-SECRET-KEY- private key markers in
  paste (warning, redacted), encrypt without -r/recipients, empty file,
  passphrase mode, and decrypt in CI scripts. Local only, never runs age
  CLI, never decrypts, never returns private keys or secret values, no fetch.
version: 1.0.0
tags: [age, encryption, lint, local]
---

# age lite lint

Use this tool on pasted age config / scripts (do not fetch URLs, run age CLI, decrypt, or echo private keys):

1. **`age_lint_lite`** with `source` — findings:
   - private_key_in_paste (warning)
   - encrypt_without_recipient (warning)
   - empty_file (warning)
   - passphrase_flag (info)
   - decrypt_in_ci (info)

Disclaimer only — not the age CLI. Never returns private keys or secret values. Lite scanner.

## Example prompts

- "Is there an AGE-SECRET-KEY- private key pasted in this script?"
- "Does this encrypt call omit -r / recipients?"
- "Lint this CI job that decrypts age files"
