---
name: ssh-lint-redact
description: >
  Lint OpenSSH ssh_config text (duplicate aliases, wildcard order,
  StrictHostKeyChecking no, missing HostName, malformed lines, identity
  paths mentioned but never read) and redact ProxyCommand / URL userinfo
  with the local zero-auth ssh-config-lab MCP. Text only — no SSH I/O.
version: 1.0.0
tags: [ssh, ssh-config, lint, redact, developer-tools]
---

# SSH config lint & redact

When the user wants a safe review of ssh_config **text**:

1. **`ssh_config_lint`** — `{ text }` → `{ findings, findingCount }`.
   - Duplicate Host aliases, wildcard-before-specific ordering,
     `StrictHostKeyChecking no`, optional missing HostName for aliases,
     malformed lines, identity paths mentioned (never opened).
2. **`ssh_config_redact`** — `{ text }` → `{ text, redacted }`.
   - Redacts ProxyCommand password/token flags, URL userinfo, and
     credential-like inline values.
   - Leaves harmless HostName / User / Port unchanged unless they look
     explicitly credential-like.

## Example prompts

- "Lint this ssh_config for wildcard order and StrictHostKeyChecking"
- "Redact secrets from this ProxyCommand before I paste it"
- "Does this alias need a HostName?"
