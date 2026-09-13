---
name: nosqlinjectban-scan
description: Use when scanning for NoSqlInjectBan issues.
---
# NoSqlInjectBan scan

1. Locate relevant configs/source.
2. Apply heuristics: Fail CI on Mongo/Mongoose NoSQL injection (req-spread, $where, operator merge).
3. Return concise findings (severity, path, fix).

Free marketplace funnel. Pro: https://plugins.lawrence.dev/pro
