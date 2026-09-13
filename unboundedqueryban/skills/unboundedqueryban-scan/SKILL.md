---
name: unboundedqueryban-scan
description: Use when scanning for UnboundedQueryBan issues.
---
# UnboundedQueryBan scan

1. Locate relevant configs/source.
2. Apply heuristics: Fail CI on ORM findMany/find without take/limit/pagination.
3. Return concise findings (severity, path, fix).

Free marketplace funnel. Pro: https://plugins.lawrence.dev/pro
