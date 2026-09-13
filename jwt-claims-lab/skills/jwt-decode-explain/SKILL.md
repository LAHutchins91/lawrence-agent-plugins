---
name: jwt-decode-explain
description: >
  Decode JWTs (header + payload only) and explain common claims using the local
  zero-auth jwt-claims-lab MCP. Never verifies signatures or mints tokens.
version: 1.0.0
tags: [jwt, claims, decode, developer-tools]
---

# JWT decode & claims explain

When the user needs to inspect a JWT or understand claims:

1. **`jwt_decode`** — `{ token }` → `{ header, payload, claimsRedacted, note }`.
   - Base64url-decodes header and payload only.
   - Secret-like keys become `[REDACTED]`.
   - Signature is **not** verified — treat payload as untrusted.
2. **`jwt_claims_explain`** — `{ token? }` or `{ claims? }` → `{ explanations[{claim, meaning, value?}] }`.
   - Covers iss, sub, aud, exp, nbf, iat, jti, azp, scope, and common OIDC claims.

## Example prompts

- "Decode this JWT and show the claims"
- "What does the `aud` claim mean?"
- "Explain these claims: { iss, sub, exp }"
