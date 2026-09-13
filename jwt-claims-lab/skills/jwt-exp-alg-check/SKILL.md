---
name: jwt-exp-alg-check
description: Check JWT exp/nbf against a given time and review educational alg warnings with the local zero-auth jwt-claims-lab MCP. Decode only — no verify/sign.
version: 1.0.0
tags: [jwt, exp, nbf, alg, developer-tools]
---

# JWT exp/nbf check & alg warnings

When the user needs timing checks or algorithm hygiene notes:

1. **`jwt_exp_check`** — `{ token, now?: ISO|epoch }` → `{ exp?, nbf?, now, expired?, notYetValid?, secondsToExp?, secondsToNbf? }`.
2. **`jwt_alg_warn`** — `{ token? }` or `{ header? }` → `{ alg, findings[{severity, rule, advice}] }`.
   - Warns on `alg=none`, missing alg, HS* shared-secret notes (educational), unusual algs.
   - Not an attack guide.

## Example prompts

- "Is this JWT expired as of 2026-01-01T00:00:00Z?"
- "Warn me about the alg in this token header"
- "Check nbf/exp for this Bearer token"
