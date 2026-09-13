---
name: vault-secrets-lint
description: >
  Detect Vault secrets-engine mounts/types (kv, kv-v2, database, pki, transit,
  aws) — mount paths/types only — plus educational lite lint with the local
  zero-auth vault-lab MCP. No vault CLI, server, or network. Never invents or
  decodes secrets; not an exploit guide.
version: 1.0.0
tags: [vault, secrets-engine, lint, hcl, mcp, developer-tools]
---

# Vault secrets engines & lite lint

When the user pastes **Vault** mount/config HCL or wants a smell-check:

1. **`vault_secrets_hint`** — `{ text }` → `{ engines: [{type?, path?}], count }`.
   - Mount *paths/types* only — never secret values.
2. **`vault_lint_lite`** — `{ text }` → `{ findings:[{severity,rule,advice}], findingCount }`.
   - Heuristics: empty, missing path block, overly broad `path "*"`, sudo tip,
     plaintext root token tip, disable_mlock tip.
   - Not an exploit guide; does not teach ACL bypass.

## Example prompts

- "What secrets engines (kv/pki/transit) are mounted in this Vault config?"
- "Lint this Vault policy for path \"*\" or plaintext root token tips"
- "Any sudo capabilities or disable_mlock in this paste?"
