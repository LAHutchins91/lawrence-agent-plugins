---
name: boundary-scopes-auths
description: >
  Inventory Boundary scopes (global / org / project) and detect auth methods
  (password, oidc, ldap) with the local zero-auth boundary-lab MCP.
  String/regex only — no boundary CLI, controller/worker, or network.
  Never invents credentials; flags key names only.
version: 1.0.0
tags: [boundary, hcl, scope, auth, mcp, developer-tools]
---

# Boundary scopes & auths

When the user pastes **Boundary** scope or auth-method HCL/config:

1. **`boundary_scopes_list`** — `{ text }` → `{ scopes: [{name?, type?, id?}], count }`.
2. **`boundary_auths_hint`** — `{ text }` → `{ auths: string[], count }`.
   - Looks for password, oidc, ldap and `auth_method` / `boundary_auth_method` blocks.

## Example prompts

- "List the Boundary scopes (global/org/project) in this HCL"
- "Which auth methods does this Boundary config mention?"
- "Inventory org/project scopes and password/oidc/ldap auth in this paste"
