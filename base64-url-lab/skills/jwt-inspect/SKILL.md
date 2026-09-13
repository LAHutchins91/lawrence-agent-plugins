---
name: jwt-inspect
description: Inspect JWT header and payload by splitting and base64url-decoding only (no signature verification); secret-like claims are redacted.
version: 1.0.0
tags: [jwt, token, inspect, base64url, developer-tools]
---

# JWT inspect (decode only)

When the user wants to see what is inside a JWT:

1. Call **`jwt_parts`** with `{ token }` (Bearer prefix optional).
2. Report `header`, `payload`, and any `claimsRedacted` keys.
3. Remind them: **signature is NOT verified** — do not trust claims for auth decisions.

Never ask this plugin to verify signatures; it intentionally does not.

## Example prompts

- "What's in this JWT header/payload?"
- "Redact secrets and show me the claims"
- "Is this token malformed?"
