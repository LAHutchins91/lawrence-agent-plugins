---
name: al-negotiate
description: "Negotiate the best available language from an Accept-Language preference list using basic prefix matching, locally with zero-auth MCP tools."
version: 1.0.0
tags: [accept-language, negotiate, i18n, locale, local]
---

# Accept-Language negotiate

Use **`al_negotiate`** when the user has client preferences and a server `available` list:

1. Pass `requested` as Accept-Language text or JSON `[{tag,q}]`.
2. Pass `available` as JSON array string or comma-separated tags (`en,fr,de`).
3. Read `best` and ranked `candidates` (exact > prefix). Document that matching is basic — not CLDR/ICU.

Always mention BCP47 lite / negotiation limits from the tool disclaimer.

## Example prompts

- "Client sent `en-US,en;q=0.9,fr;q=0.5` — we offer en, fr, de. Which wins?"
- "Match `zh-Hans` against available `zh,zh-CN,en`."
