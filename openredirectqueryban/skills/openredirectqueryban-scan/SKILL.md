---
name: openredirectqueryban-scan
description: Use when scanning for OpenRedirectQueryBan issues.
---
# OpenRedirectQueryBan scan

1. Locate relevant configs/source.
2. Apply heuristics: Fail CI on res.redirect(req.query.*) / Location from query.
3. Return concise findings (severity, path, fix).

Free marketplace funnel. Pro: https://plugins.lawrence.dev/pro
