---
name: env-contract-review
description: >
  Review .env / config drift locally: infer an env contract (kinds, required,
  secretLikely), check against actual env text, and optionally cross-check
  docker-compose ${VAR} overlap — redacted, CI-friendly, zero-auth.
version: 1.0.0
tags: [env, dotenv, contract, drift, secrets, compose, ci]
---

# Env contract review

When the user shares `.env` contents, a hand-written contract, or compose + env:

1. Call **`env_schema_infer`** on env file text to get keys, valueKind, required, secretLikely (masked samples only).
2. Call **`env_contract_check`** with that contract (or an edited one) vs the env under test — report missing required, unexpected keys, kind mismatches.
3. If docker-compose YAML is available, call **`compose_env_overlap`** to find missing `${VAR}` refs and unused env keys.
4. Summarize a CI-friendly drift brief (keys / masked only — never echo raw secrets).

## Example prompts

- "Infer a contract from this .env and check for drift"
- "Which required env keys are missing vs our contract?"
- "Does this compose file reference env vars we don't provide?"
