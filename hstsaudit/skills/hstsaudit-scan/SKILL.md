---
name: hstsaudit-scan
description: Use when scanning for HstsAudit (`hstsaudit`) issues.
---
# HstsAudit (`hstsaudit`) scan

1. Locate relevant configs/source.
2. Apply heuristics: Lint Strict-Transport-Security headers — catch missing `max-age`, too-short `max-age` (&lt; 1 year), and missing `includeSubDomains` in raw headers, nginx `add_header`, and Express / helmet configs.
3. Return concise findings (severity, path, fix).

Free marketplace funnel. Pro: https://plugins.lawrence.dev/pro
