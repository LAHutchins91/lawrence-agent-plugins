---
name: har-failing-triage
description: "Triage failing HTTP requests from a HAR capture (status ≥ 400 by default) and scan cookie names for missing Secure/HttpOnly on Set-Cookie — names only, never values. Local zero-auth MCP."
version: 1.0.0
tags: [har, http-archive, errors, failing, cookies, security, triage]
---

# HAR failing triage

When the user pastes a HAR or asks about errors / cookie hygiene in a capture:

1. Call **`har_failing`** with the HAR JSON (adjust `minStatus` if they care about 3xx or only 5xx).
2. Group findings by status and host; list method, url, status, time for each failure.
3. Call **`har_cookie_scan`** — report unique cookie names set/sent and any missing Secure/HttpOnly flags. Never echo cookie values.
4. Summarize: highest-severity failures first, then cookie flag gaps.

## Example prompts

- "Which requests failed in this HAR?"
- "Scan this capture for cookies missing Secure or HttpOnly"
- "Triage 5xx errors from tonight's network export"
