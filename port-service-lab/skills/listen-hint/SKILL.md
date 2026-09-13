---
name: listen-hint
description: "Bind-address notes for public, private, or local listen intents — zero-auth, advice only, no scanning or connect()."
version: 1.0.0
tags: [listen, bind, security, localhost, local]
---

# Listen bind hints

When the user asks how to bind a service (0.0.0.0 vs 127.0.0.1 vs ::) for a given intent:

1. Call **`listen_hint`** with `port` and optional `intent` (`local` default, `private`, or `public`).
2. Report `bindSuggestions`, `notes`, and `securityReminders`. Emphasize `scanning: false` — this tool never probes hosts.
3. Prefer loopback for local-only; require firewall / TLS / auth reminders for private and public.

## Example prompts

- "Should I bind my Flask app on 0.0.0.0 or 127.0.0.1?"
- "Listen hints for Postgres on a private LAN"
- "Public HTTPS listener bind notes for port 443"
