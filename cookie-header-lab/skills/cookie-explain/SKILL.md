---
name: cookie-explain
description: "Educational notes on HttpOnly, Secure, SameSite, Path, and Domain for pasted Set-Cookie headers, locally with zero-auth MCP tools."
version: 1.0.0
tags: [cookie, set-cookie, httponly, secure, samesite, local]
---

# Cookie attribute explain

Use **`cookie_explain`** when the user wants to understand cookie flags:

1. Pass raw `header` (Set-Cookie preferred) or a parsed `cookie` object/array.
2. Surface warnings when session-ish names lack `Secure` or `HttpOnly`.
3. Remind that Cookie *request* headers do not carry those flags.

Always include the tool disclaimer: educational notes, not a security audit. Local only; no browser or network.

## Example prompts

- "What does SameSite=Lax mean on this Set-Cookie?"
- "Is it a problem that sessionid is missing HttpOnly?"
- "Explain Path and Domain on this cookie."
