---
name: postmessageoriginban-scan
description: Use when scanning for PostMessageOriginBan issues.
---
# PostMessageOriginBan scan

1. Locate relevant configs/source.
2. Apply heuristics: Fail CI on postMessage('*') and message listeners without origin checks.
3. Return concise findings (severity, path, fix).

Free marketplace funnel. Pro: https://plugins.lawrence.dev/pro
