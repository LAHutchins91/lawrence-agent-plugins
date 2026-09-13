---
name: cookie-parse
description: >
  Parse pasted Cookie / Set-Cookie header text and redact secret values
  locally with zero-auth MCP tools. No network and no browser access.
version: 1.0.0
tags: [cookie, set-cookie, header, parse, redact, local]
---

# Cookie / Set-Cookie parse

Use these tools when the user pastes a Cookie or Set-Cookie header they already have:

1. **`cookie_parse`** with `header` — request `Cookie:` name=value pairs (`"; "`-separated).
2. **`set_cookie_parse`** with `header` — one or more `Set-Cookie` lines (newlines ok) plus attributes.
3. **`cookie_redact`** with `header` — return redacted header text. **Never echo original cookie values.**

This is string analysis of pasted text only. Do not fetch URLs, drive a browser, or capture cookies.

## Example prompts

- "Parse `Cookie: sessionid=…; theme=dark`."
- "Split these two Set-Cookie lines and list Path / SameSite."
- "Redact the values in this Cookie header before I paste it in a ticket."
