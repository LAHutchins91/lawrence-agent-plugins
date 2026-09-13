---
name: vault-policies-auths
description: >
  Inventory Vault ACL policy path blocks (path + capabilities) and detect
  auth methods (userpass, approle, kubernetes, github, jwt/oidc, ldap, aws)
  with the local zero-auth vault-lab MCP. String/regex only — no vault CLI,
  server, or network. Never invents or decodes secrets.
version: 1.0.0
tags: [vault, hcl, policy, auth, mcp, developer-tools]
---

# Vault policies & auths

When the user pastes **Vault** policy or auth config HCL:

1. **`vault_policies_list`** — `{ text }` → `{ policies: [{path?, capabilities?}], count }`.
2. **`vault_auths_hint`** — `{ text }` → `{ auths: string[], count }`.
   - Looks for auth/userpass, approle, kubernetes, github, jwt/oidc, ldap, aws.

## Example prompts

- "List the Vault policy paths and capabilities in this HCL"
- "Which auth methods does this Vault config mention?"
- "Inventory path blocks and capabilities in this Vault policy paste"
