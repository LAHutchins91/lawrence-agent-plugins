---
name: missingawaitban-scan
description: Use when scanning for MissingAwaitBan issues.
---
# MissingAwaitBan scan

1. Locate relevant configs/source.
2. Apply heuristics: Fail CI on floating fetch/prisma/fs.promises/.then without await.
3. Return concise findings (severity, path, fix).

Free marketplace funnel. Pro: https://plugins.lawrence.dev/pro
