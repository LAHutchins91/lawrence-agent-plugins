---
name: weaktlsban-scan
description: Use when scanning for WeakTlsBan issues.
---
# WeakTlsBan scan

1. Locate relevant configs/source.
2. Apply heuristics: Fail CI on TLS misconfig (rejectUnauthorized false, SSLv3/TLSv1, weak ciphers).
3. Return concise findings (severity, path, fix).

Free marketplace funnel. Pro: https://plugins.lawrence.dev/pro
