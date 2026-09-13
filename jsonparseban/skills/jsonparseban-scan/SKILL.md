---
name: jsonparseban-scan
description: Use when scanning for JsonParseBan issues.
---
# JsonParseBan scan

1. Locate relevant configs/source.
2. Apply heuristics: Fail CI on unsafe JSON.parse of req.body / event.data / readFile without validation.
3. Return concise findings (severity, path, fix).

Free marketplace funnel. Pro: https://plugins.lawrence.dev/pro
