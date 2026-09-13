---
name: softdeleteleakban-scan
description: Use when scanning for SoftDeleteLeakBan issues.
---
# SoftDeleteLeakBan scan

1. Locate relevant configs/source.
2. Apply heuristics: Fail CI when ORM find/findMany omits soft-delete exclusion filters.
3. Return concise findings (severity, path, fix).

Free marketplace funnel. Pro: https://plugins.lawrence.dev/pro
