---
name: sqlidentifierban-scan
description: Use when scanning for SqlIdentifierBan issues.
---
# SqlIdentifierBan scan

1. Locate relevant configs/source.
2. Apply heuristics: Fail CI on FROM/ORDER BY identifier interpolation from user input.
3. Return concise findings (severity, path, fix).

Free marketplace funnel. Pro: https://plugins.lawrence.dev/pro
